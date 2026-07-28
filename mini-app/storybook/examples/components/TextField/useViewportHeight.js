import { useEffect, useState } from "react"
import WebApp from "@lib/twa"

const getViewportHeight = () =>
    WebApp.viewportHeight ||
    (typeof window === "undefined" ? 0 : window.innerHeight)

export function useViewportHeight() {
    const [height, setHeight] = useState(getViewportHeight)

    useEffect(() => {
        let rafId = null

        const updateHeight = () => {
            if (rafId) cancelAnimationFrame(rafId)

            rafId = requestAnimationFrame(() => {
                const newHeight = getViewportHeight()
                setHeight(newHeight)
                window.scrollTo(0, 0)
            })
        }

        updateHeight()

        if (WebApp.onEvent) {
            WebApp.onEvent("viewportChanged", updateHeight)
        }
        window.addEventListener("resize", updateHeight, { passive: true })

        return () => {
            if (rafId) cancelAnimationFrame(rafId)
            if (WebApp.offEvent) {
                WebApp.offEvent("viewportChanged", updateHeight)
            }
            window.removeEventListener("resize", updateHeight)
        }
    }, [])

    return height
}
