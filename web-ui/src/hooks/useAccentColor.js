import { getColor } from "colorthief"
import { useEffect, useRef, useState } from "react"

import { normalizeHex } from "../utils/common"

const CACHE_MAX = 100
const colorCache = new Map()

const cacheGet = (key) => {
    if (!colorCache.has(key)) return undefined
    const value = colorCache.get(key)
    colorCache.delete(key)
    colorCache.set(key, value)
    return value
}

const cacheSet = (key, value) => {
    if (colorCache.size >= CACHE_MAX) {
        const firstKey = colorCache.keys().next().value
        colorCache.delete(firstKey)
    }
    colorCache.set(key, value)
}

let workerInstance = null
let workerSeq = 0
const workerPending = new Map()

const getWorker = () => {
    if (workerInstance !== null) return workerInstance || null
    if (typeof Worker === "undefined") {
        workerInstance = false
        return null
    }
    try {
        const worker = new Worker(
            new URL("./accentColorWorker.js", import.meta.url),
            { type: "module" }
        )
        worker.onmessage = (e) => {
            const { id, hex, error } = e.data
            const pending = workerPending.get(id)
            if (!pending) return
            workerPending.delete(id)
            if (error) pending.reject(new Error(error))
            else pending.resolve(hex)
        }
        worker.onerror = (err) => {
            for (const { reject } of workerPending.values()) reject(err)
            workerPending.clear()
        }
        workerInstance = worker
        return worker
    } catch {
        workerInstance = false
        return null
    }
}

const extractViaWorker = (bitmap, quality) => {
    const worker = getWorker()
    if (!worker) return null
    const id = ++workerSeq
    return new Promise((resolve, reject) => {
        workerPending.set(id, { resolve, reject })
        worker.postMessage({ id, bitmap, quality }, [bitmap])
    })
}

const extractFromBlobMainThread = async (blob, quality) => {
    const url = URL.createObjectURL(blob)
    try {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.decoding = "async"
        img.src = url
        await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
        })
        const color = await getColor(img, { quality })
        return color.hex()
    } finally {
        URL.revokeObjectURL(url)
    }
}

const extractSvgAccent = (text) => {
    const fills = text
        .matchAll(/(?:fill|stroke)=(?:"|')([^"']+)(?:"|')/g)
        .map((m) => m[1])
        .filter((c) => c !== "none" && !c.startsWith("url("))
        .toArray()

    if (!fills.length) return null

    const freq = {}
    fills.forEach((c) => (freq[c] = (freq[c] || 0) + 1))
    const accent = Object.entries(freq).toSorted((a, b) => b[1] - a[1])[0][0]
    return normalizeHex(accent)
}

export async function getAccentHex(source, quality = 10) {
    const cacheKey = `${source}_${quality}`
    const cached = cacheGet(cacheKey)
    if (cached) return cached

    let blob, mime
    if (source instanceof Blob) {
        blob = source
        mime = blob.type
    } else {
        const resp = await fetch(source, { mode: "cors" })
        blob = await resp.blob()
        mime = resp.headers.get("content-type") || ""
    }

    const isSvg =
        mime.includes("svg") ||
        (typeof source === "string" && source.endsWith(".svg"))

    if (isSvg) {
        const text = await blob.text()
        const accent = extractSvgAccent(text)
        if (accent) {
            cacheSet(cacheKey, accent)
            return accent
        }
    }

    if (typeof createImageBitmap === "function" && getWorker()) {
        try {
            const bitmap = await createImageBitmap(blob)
            const hex = await extractViaWorker(bitmap, quality)
            if (hex) {
                cacheSet(cacheKey, hex)
                return hex
            }
        } catch {
            // fall through to main-thread path
        }
    }

    const hex = await extractFromBlobMainThread(blob, quality)
    cacheSet(cacheKey, hex)
    return hex
}

export function useAccentColor(src, quality = 10) {
    const [hex, setHex] = useState(null)

    useEffect(() => {
        if (!src) {
            setHex(null)
            return
        }

        let canceled = false
        setHex(null)

        getAccentHex(src, quality)
            .then((c) => !canceled && setHex(c))
            .catch(() => !canceled && setHex(null))

        return () => {
            canceled = true
        }
    }, [src, quality])

    return src ? hex : null
}

export function useAccentColorLazy(src, quality = 10, options = {}) {
    const [hex, setHex] = useState(null)
    const [isVisible, setIsVisible] = useState(false)
    const elementRef = useRef(null)

    const { rootMargin = "50px", threshold = 0.01 } = options

    useEffect(() => {
        const node = elementRef.current
        if (!src || !node) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true)
                        observer.unobserve(entry.target)
                    }
                })
            },
            { rootMargin, threshold }
        )

        observer.observe(node)

        return () => {
            observer.unobserve(node)
        }
    }, [src, rootMargin, threshold])

    useEffect(() => {
        if (!src || !isVisible) {
            setHex(null)
            return
        }

        let canceled = false
        getAccentHex(src, quality)
            .then((c) => !canceled && setHex(c))
            .catch(() => !canceled && setHex(null))

        return () => {
            canceled = true
        }
    }, [src, quality, isVisible])

    return { hex: src ? hex : null, ref: elementRef }
}
