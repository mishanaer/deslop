import { useEffect, useRef } from "react"

export function useResizeObserver(ref, callback, { enabled = true } = {}) {
    const callbackRef = useRef(callback)
    useEffect(() => {
        callbackRef.current = callback
    })

    useEffect(() => {
        if (!enabled) return
        const node = ref.current
        if (!node) return
        const observer = new ResizeObserver((entries) => {
            callbackRef.current(entries[0])
        })
        observer.observe(node)
        return () => observer.disconnect()
    }, [ref, enabled])
}
