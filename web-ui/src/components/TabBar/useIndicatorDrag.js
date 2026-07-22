import { useEffect, useRef, useState } from "react"

import { clamp } from "../../utils/number"

export function useIndicatorDrag({
    tabsLength,
    activeIndex,
    onSnapToSame,
    onSnapToNew,
    spring,
}) {
    const overlayRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [dragLeftPercent, setDragLeftPercent] = useState(null)
    const activePointerIdRef = useRef(null)
    const isPointerDownRef = useRef(false)
    const pointerDownIdRef = useRef(null)
    const startXRef = useRef(0)
    const DRAG_THRESHOLD_PX = 6

    const segmentPercent = 100 / tabsLength

    const indicatorWidth = `calc(${segmentPercent}% + 7.33px - 4px)`
    const indicatorLeft = `calc(${segmentPercent * activeIndex}% - ${3.67 * activeIndex}px)`

    const clipLeft = indicatorLeft
    const clipRight = `calc(100% - (${indicatorLeft} + ${indicatorWidth}) - 2.33px * ${activeIndex})`

    const animateClipPath =
        isDragging && dragLeftPercent != null
            ? `inset(0 ${100 - (dragLeftPercent + segmentPercent)}% 0 ${dragLeftPercent}% round 100px)`
            : `inset(0 ${clipRight} 0 ${clipLeft} round 100px)`

    const transition = isDragging
        ? { clipPath: { duration: 0 } }
        : { clipPath: spring }

    const updateDragFromClientX = (clientX) => {
        const el = overlayRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const xRel = clientX - rect.left
        const width = rect.width
        if (width <= 0) return
        const centerPercent = (xRel / width) * 100
        const left = clamp(
            centerPercent - segmentPercent / 2,
            0,
            100 - segmentPercent
        )
        setDragLeftPercent(left)
    }

    const onPointerDown = (e) => {
        isPointerDownRef.current = true
        pointerDownIdRef.current = e.pointerId
        startXRef.current = e.clientX
        // Не начинаем drag сразу — ждём порога движения
    }

    const onPointerMove = (e) => {
        // Игнорируем чужие указатели
        if (
            pointerDownIdRef.current != null &&
            e.pointerId !== pointerDownIdRef.current
        )
            return

        if (!isDragging) {
            if (!isPointerDownRef.current) return
            const dx = Math.abs(e.clientX - startXRef.current)
            if (dx >= DRAG_THRESHOLD_PX) {
                // Активируем drag
                try {
                    e.currentTarget.setPointerCapture?.(e.pointerId)
                    activePointerIdRef.current = e.pointerId
                } catch {
                    // pointer capture is best-effort
                }
                setIsDragging(true)
                updateDragFromClientX(e.clientX)
                e.preventDefault()
            }
            return
        }

        // Активный drag
        if (
            activePointerIdRef.current != null &&
            e.pointerId !== activePointerIdRef.current
        ) {
            return
        }
        updateDragFromClientX(e.clientX)
        e.preventDefault()
    }

    const finishDrag = (clientX) => {
        // Snap to nearest tab by current pointer/drag position
        const el = overlayRef.current
        let nextIndex = activeIndex
        if (el && typeof clientX === "number") {
            const rect = el.getBoundingClientRect()
            const xRel = clientX - rect.left
            const width = rect.width
            if (width > 0) {
                const segWidth = width / tabsLength
                nextIndex = clamp(
                    Math.round(xRel / segWidth - 0.5),
                    0,
                    tabsLength - 1
                )
            }
        } else if (dragLeftPercent != null) {
            const seg = 100 / tabsLength
            nextIndex = clamp(
                Math.round(dragLeftPercent / seg),
                0,
                tabsLength - 1
            )
        }

        if (nextIndex === activeIndex) {
            onSnapToSame?.()
        } else {
            onSnapToNew?.(nextIndex)
        }

        setIsDragging(false)
        setDragLeftPercent(null)
        activePointerIdRef.current = null
    }

    const onPointerUp = (e) => {
        // Сброс состояния pointerdown
        isPointerDownRef.current = false
        pointerDownIdRef.current = null

        if (!isDragging) {
            // Это был тап — позволяем сгенерировать click
            return
        }
        if (
            activePointerIdRef.current != null &&
            e.pointerId !== activePointerIdRef.current
        ) {
            return
        }
        try {
            e.currentTarget.releasePointerCapture?.(e.pointerId)
        } catch {
            // pointer capture is best-effort
        }
        finishDrag(e.clientX)
        e.preventDefault()
    }

    const onPointerCancel = (e) => {
        isPointerDownRef.current = false
        pointerDownIdRef.current = null
        if (!isDragging) return
        finishDrag(e?.clientX)
        e.preventDefault?.()
    }

    const onPointerLeave = (e) => {
        if (!isDragging) return
        finishDrag(e?.clientX)
    }

    useEffect(() => {
        const cancel = () => {
            setIsDragging(false)
            setDragLeftPercent(null)
            activePointerIdRef.current = null
            isPointerDownRef.current = false
            pointerDownIdRef.current = null
        }
        window.addEventListener("blur", cancel)
        return () => window.removeEventListener("blur", cancel)
    }, [])

    return {
        overlayRef,
        isDragging,
        animate: { clipPath: animateClipPath },
        transition,
        handlers: {
            onPointerDown,
            onPointerMove,
            onPointerUp,
            onPointerCancel,
            onPointerLeave,
        },
    }
}

export default useIndicatorDrag
