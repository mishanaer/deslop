import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react"

const shallowEqual = (a, b) => {
    if (a === b) return true
    if (!a || !b) return false
    const ak = Object.keys(a)
    if (ak.length !== Object.keys(b).length) return false
    for (const k of ak) if (a[k] !== b[k]) return false
    return true
}

export function useAnchoredPosition({
    isOpen,
    triggerRef,
    contentRef,
    initialPosition,
    calculate,
    deps = [],
    equals = shallowEqual,
}) {
    const [position, setPosition] = useState(initialPosition)
    const [isPositioned, setIsPositioned] = useState(false)
    const contentSizeRef = useRef(null)

    const resetPosition = useCallback(() => {
        setIsPositioned(false)
        contentSizeRef.current = null
    }, [])

    useLayoutEffect(() => {
        if (!isOpen || isPositioned) return
        if (!triggerRef.current || !contentRef.current) return
        const triggerRect = triggerRef.current.getBoundingClientRect()
        const { width, height } = contentRef.current.getBoundingClientRect()
        contentSizeRef.current = { width, height }
        setPosition(calculate(triggerRect, { width, height }))
        setIsPositioned(true)
    }, [isOpen, isPositioned, triggerRef, contentRef, calculate, ...deps])

    useEffect(() => {
        if (!isOpen || !isPositioned) return
        let frame = null
        const reposition = () => {
            frame = null
            if (!triggerRef.current || !contentSizeRef.current) return
            const rect = triggerRef.current.getBoundingClientRect()
            const next = calculate(rect, contentSizeRef.current)
            setPosition((prev) => (equals(prev, next) ? prev : next))
        }
        const schedule = () => {
            if (frame !== null) return
            frame = requestAnimationFrame(reposition)
        }
        window.addEventListener("scroll", schedule, true)
        window.addEventListener("resize", schedule)
        return () => {
            if (frame !== null) cancelAnimationFrame(frame)
            window.removeEventListener("scroll", schedule, true)
            window.removeEventListener("resize", schedule)
        }
    }, [isOpen, isPositioned, triggerRef, calculate, equals, ...deps])

    return { position, isPositioned, resetPosition }
}
