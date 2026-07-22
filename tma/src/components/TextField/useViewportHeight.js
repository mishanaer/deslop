import { useEffect, useState } from "react"
import WebApp from "../../lib/twa"

export function useViewportHeight() {
    const [height, setHeight] = useState(
        () => WebApp.viewportHeight || window.innerHeight
    )

    useEffect(() => {
        let rafId = null

        const updateHeight = () => {
            if (rafId) cancelAnimationFrame(rafId)

            rafId = requestAnimationFrame(() => {
                const newHeight = WebApp.viewportHeight || window.innerHeight
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
