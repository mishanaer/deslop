import { useEffect, useRef, useState } from "react"

import { createEngine } from "./glEngine"

/**
 * Wires the WebGL2 particle engine to React lifecycle and the `hidden` prop.
 *
 * @returns {{ supported: boolean, revealOriginRef: object }} supported is false
 *   when WebGL2 is unavailable (caller shows a static fallback); revealOriginRef
 *   holds the pointer origin for the reveal burst.
 */
export function useParticles({
    canvasRef,
    contentRef,
    hidden,
    color,
    radius,
    padding,
    maskDilation,
}) {
    const [supported, setSupported] = useState(true)
    const revealOriginRef = useRef(null)
    const engineRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const content = contentRef.current
        if (!canvas || !content) return

        const gl = canvas.getContext("webgl2", { premultipliedAlpha: false })
        if (!gl) {
            setSupported(false)
            return
        }

        const engine = createEngine({
            gl,
            canvas,
            content,
            color,
            radius,
            padding,
            maskDilation,
        })
        engineRef.current = engine

        const ro = new ResizeObserver(() => engine.resize())
        ro.observe(content)
        engine.resize()

        // Pause the render loop while scrolled out of the viewport.
        const io = new IntersectionObserver(([entry]) => {
            engine.setOnscreen(entry.isIntersecting)
        })
        io.observe(content)

        return () => {
            ro.disconnect()
            io.disconnect()
            engine.destroy()
            engineRef.current = null
        }
    }, [canvasRef, contentRef, color, radius, padding, maskDilation])

    // Spawn the cloud on cover, burst it away on reveal. reveal() before any
    // cover() is a no-op, so the initial mount stays dormant.
    useEffect(() => {
        const engine = engineRef.current
        if (!engine) return
        if (hidden) engine.cover()
        else engine.reveal(revealOriginRef.current)
    }, [hidden])

    return { supported, revealOriginRef }
}
