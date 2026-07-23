import { useEffect, useEffectEvent, useRef } from "react"
import {
    DEVICE_PIXEL_RATIO_MAX,
    RESIZE_DEBOUNCE_PATTERN,
} from "../utils/constants"
import { getContainerDimensions } from "../utils/gradientUtils"
import { fillCanvasWithPattern } from "../utils/patternUtils"
import * as styles from "../GradientBackground.module.css"

export function usePatternCanvas({
    patternCanvasRef,
    containerRef,
    patternUrl,
    activeIsDarkPattern,
}) {
    const patternImageRef = useRef(null)
    const patternDimensionsRef = useRef({ width: 0, height: 0 })

    const renderPattern = useEffectEvent((forceRender = false) => {
        const patternCanvas = patternCanvasRef.current
        const container = containerRef.current

        if (!patternCanvas || !container || !patternUrl) {
            return
        }

        if (!patternCanvas.isConnected) {
            return
        }

        const { width: baseWidth, height: baseHeight } =
            getContainerDimensions(container)

        if (
            baseWidth <= 0 ||
            baseHeight <= 0 ||
            !isFinite(baseWidth) ||
            !isFinite(baseHeight)
        ) {
            return
        }

        const devicePixelRatio = Math.min(
            DEVICE_PIXEL_RATIO_MAX,
            window.devicePixelRatio || 1
        )
        const width = Math.round(baseWidth * devicePixelRatio)
        const height = Math.round(baseHeight * devicePixelRatio)

        const prevDimensions = patternDimensionsRef.current
        const widthChanged = Math.abs(width - prevDimensions.width) > 1
        const heightChanged = Math.abs(height - prevDimensions.height) > 1

        if (!forceRender && !widthChanged && !heightChanged) {
            return
        }

        patternDimensionsRef.current = { width, height }
        patternCanvas.dpr = devicePixelRatio

        if (widthChanged || heightChanged) {
            patternCanvas.width = width
            patternCanvas.height = height
        }

        const ctx = patternCanvas.getContext("2d")
        const img = patternImageRef.current
        if (!ctx || !img || !img.complete || img.naturalWidth === 0) {
            return
        }

        fillCanvasWithPattern(
            ctx,
            patternCanvas,
            img,
            width,
            height,
            activeIsDarkPattern
        )
        // Reveal only after the first frame is on the canvas, so the pattern
        // fades in over the gradient instead of popping in once loaded.
        patternCanvas.classList.add(styles.patternReady)
    })

    useEffect(() => {
        patternImageRef.current = null
        patternDimensionsRef.current = { width: 0, height: 0 }

        if (!patternUrl) {
            return
        }

        // Start fetching immediately; the first draw happens on load.
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => renderPattern(true)
        img.onerror = (error) => {
            console.warn("Failed to load pattern image:", patternUrl, error)
        }
        img.src = patternUrl
        patternImageRef.current = img

        // Sizes the canvas now and draws right away if the image is cached.
        renderPattern(true)

        let resizeTimeoutId = null

        const handleResize = () => {
            if (resizeTimeoutId) {
                clearTimeout(resizeTimeoutId)
            }
            resizeTimeoutId = setTimeout(() => {
                requestAnimationFrame(() => {
                    renderPattern()
                })
                resizeTimeoutId = null
            }, RESIZE_DEBOUNCE_PATTERN)
        }

        window.addEventListener("resize", handleResize)
        const resizeObserver = new ResizeObserver(() => {
            handleResize()
        })

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current)
        }

        return () => {
            if (resizeTimeoutId) {
                clearTimeout(resizeTimeoutId)
            }
            img.onload = null
            img.onerror = null
            window.removeEventListener("resize", handleResize)
            resizeObserver.disconnect()
            patternImageRef.current = null
            patternDimensionsRef.current = { width: 0, height: 0 }
        }
    }, [patternUrl, activeIsDarkPattern, containerRef])
}
