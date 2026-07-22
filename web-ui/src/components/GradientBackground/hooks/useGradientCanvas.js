import { useEffect, useEffectEvent, useRef } from "react"
import { MAX_CANVAS_SIZE, RESIZE_DEBOUNCE_GRADIENT } from "../utils/constants"
import { getContainerDimensions, parseColor } from "../utils/gradientUtils"
import { computeGradientPixels } from "./gradientCompute"

const createWorker = () => {
    if (typeof Worker === "undefined") return null
    try {
        return new Worker(new URL("./gradientWorker.js", import.meta.url), {
            type: "module",
        })
    } catch {
        return null
    }
}

const requestPixels = (worker, seq, params) =>
    new Promise((resolve, reject) => {
        const handleMessage = (event) => {
            if (event.data?.id !== seq) return
            worker.removeEventListener("message", handleMessage)
            worker.removeEventListener("error", handleError)
            resolve(event.data.pixels)
        }
        const handleError = (err) => {
            worker.removeEventListener("message", handleMessage)
            worker.removeEventListener("error", handleError)
            reject(err)
        }
        worker.addEventListener("message", handleMessage)
        worker.addEventListener("error", handleError)
        worker.postMessage({ id: seq, ...params })
    })

const drawFallbackFill = (canvas, color) => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const [r, g, b] = parseColor(color)
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const applyScale = (canvas, ctx, imageData, width, height) => {
    if (
        !canvas._tempCanvas ||
        canvas._tempCanvas.width !== imageData.width ||
        canvas._tempCanvas.height !== imageData.height
    ) {
        canvas._tempCanvas = document.createElement("canvas")
        canvas._tempCanvas.width = imageData.width
        canvas._tempCanvas.height = imageData.height
    }
    const tempCtx = canvas._tempCanvas.getContext("2d")
    tempCtx.putImageData(imageData, 0, 0)
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(canvas._tempCanvas, 0, 0, width, height)
}

const applyIntensity = (canvas, ctx, width, height, intensity) => {
    if (
        !canvas._intensityCanvas ||
        canvas._intensityCanvas.width !== width ||
        canvas._intensityCanvas.height !== height
    ) {
        canvas._intensityCanvas = document.createElement("canvas")
        canvas._intensityCanvas.width = width
        canvas._intensityCanvas.height = height
    }
    const tempCtx = canvas._intensityCanvas.getContext("2d")
    tempCtx.globalAlpha = intensity
    tempCtx.drawImage(canvas, 0, 0)
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(canvas._intensityCanvas, 0, 0)
}

export function useGradientCanvas({
    canvasRef,
    containerRef,
    activeColors,
    positions,
    rotation,
    intensity,
}) {
    const workerRef = useRef(null)
    const seqRef = useRef(0)

    useEffect(() => {
        workerRef.current = createWorker()
        return () => {
            workerRef.current?.terminate()
            workerRef.current = null
        }
    }, [])

    const generateGradient = useEffectEvent(async () => {
        const canvas = canvasRef.current
        const container = containerRef.current

        if (
            !canvas ||
            !container ||
            !activeColors ||
            activeColors.length !== 4
        ) {
            return
        }

        const { width, height } = getContainerDimensions(container)

        if (
            width <= 0 ||
            height <= 0 ||
            !isFinite(width) ||
            !isFinite(height)
        ) {
            canvas.width = 100
            canvas.height = 100
            drawFallbackFill(canvas, activeColors[0])
            return
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const scale = width * height > MAX_CANVAS_SIZE ? 0.5 : 1
        const scaledWidth = Math.floor(width * scale)
        const scaledHeight = Math.floor(height * scale)

        const seq = ++seqRef.current
        const params = {
            scaledWidth,
            scaledHeight,
            colors: activeColors,
            positions,
            rotation,
        }

        let pixels
        if (workerRef.current) {
            try {
                pixels = await requestPixels(workerRef.current, seq, params)
            } catch {
                pixels = computeGradientPixels(params)
            }
        } else {
            pixels = computeGradientPixels(params)
        }

        if (seq !== seqRef.current) return
        if (!canvas.isConnected) return

        const imageData = new ImageData(pixels, scaledWidth, scaledHeight)

        if (scale !== 1) {
            applyScale(canvas, ctx, imageData, width, height)
        } else {
            ctx.putImageData(imageData, 0, 0)
        }

        if (intensity !== 1) {
            applyIntensity(canvas, ctx, width, height, intensity)
        }
    })

    useEffect(() => {
        let timeoutId = null
        let resizeTimeoutId = null

        const scheduleGeneration = (delay = 0) => {
            if (timeoutId) clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                generateGradient()
                timeoutId = null
            }, delay)
        }

        scheduleGeneration(0)

        const handleResize = () => {
            if (resizeTimeoutId) clearTimeout(resizeTimeoutId)
            resizeTimeoutId = setTimeout(() => {
                generateGradient()
                resizeTimeoutId = null
            }, RESIZE_DEBOUNCE_GRADIENT)
        }

        window.addEventListener("resize", handleResize)
        const resizeObserver = new ResizeObserver(() => handleResize())
        if (containerRef.current) resizeObserver.observe(containerRef.current)

        return () => {
            if (timeoutId) clearTimeout(timeoutId)
            if (resizeTimeoutId) clearTimeout(resizeTimeoutId)
            window.removeEventListener("resize", handleResize)
            resizeObserver.disconnect()
        }
    }, [activeColors, rotation, intensity, positions, containerRef])
}
