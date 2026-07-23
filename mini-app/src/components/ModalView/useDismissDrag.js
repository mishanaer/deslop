import { useEffect, useRef } from "react"
import {
    useDragControls,
    useMotionValue,
    useReducedMotion,
    useTransform,
} from "motion/react"

const DISMISS_OFFSET = 100
const DISMISS_VELOCITY = 500
const DIRECTION_SLOP = 6

// Nearest scrollable ancestor of node, walking up to and including stopEl.
const findScrollable = (node, stopEl) => {
    let el = node instanceof Element ? node : null
    while (el) {
        if (el.scrollHeight > el.clientHeight) {
            const { overflowY } = getComputedStyle(el)
            if (overflowY === "auto" || overflowY === "scroll") return el
        }
        if (el === stopEl) return null
        el = el.parentElement
    }
    return null
}

// Swipe-down-to-dismiss for the modal panel. A single motion value `y` is
// shared between the entrance/exit variants and the drag gesture, so
// hand-offs between them stay velocity-continuous, and the overlay dim is
// derived from the same value.
export function useDismissDrag({ onClose, panelRef }) {
    const reduceMotion = useReducedMotion()
    const dragControls = useDragControls()

    // Starts off-screen so the overlay computes as transparent on first mount.
    const y = useMotionValue(window.innerHeight)

    const overlayOpacity = useTransform(y, (latest) => {
        const viewport = window.innerHeight || 1
        return 1 - Math.min(Math.max(latest / viewport, 0), 1)
    })

    const cleanupRef = useRef(null)
    const stopListeners = () => {
        cleanupRef.current?.()
        cleanupRef.current = null
    }
    useEffect(() => () => cleanupRef.current?.(), [])

    // Once we commit to dragging the panel, block native touch scrolling for
    // the rest of the gesture so inner scrollers cannot move underneath, and
    // swallow the trailing click when the pointer actually travelled — a drag
    // released over a header button must not activate it.
    const beginDrag = (event) => {
        dragControls.start(event)
        const startX = event.clientX
        const startY = event.clientY
        let moved = false
        const onMove = (e) => {
            if (
                Math.abs(e.clientX - startX) > DIRECTION_SLOP ||
                Math.abs(e.clientY - startY) > DIRECTION_SLOP
            )
                moved = true
        }
        const preventScroll = (e) => {
            if (e.cancelable) e.preventDefault()
        }
        window.addEventListener("touchmove", preventScroll, { passive: false })
        window.addEventListener("pointermove", onMove)
        const detach = () => {
            window.removeEventListener("touchmove", preventScroll)
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerup", detach)
            window.removeEventListener("pointercancel", detach)
            if (moved) {
                const swallowClick = (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                }
                window.addEventListener("click", swallowClick, {
                    capture: true,
                    once: true,
                })
                setTimeout(
                    () =>
                        window.removeEventListener("click", swallowClick, {
                            capture: true,
                        }),
                    250
                )
            }
        }
        window.addEventListener("pointerup", detach)
        window.addEventListener("pointercancel", detach)
    }

    // Drag handles (the panel header via data-modal-drag) engage immediately;
    // elsewhere the drag engages only when the touched scroller sits at its
    // top AND the first decisive move is downward-dominant; otherwise the
    // gesture stays native (scroll, horizontal pans, taps).
    const onPanelPointerDown = (event) => {
        if (reduceMotion) return
        if (event.pointerType === "mouse" && event.button !== 0) return
        const panel = panelRef.current
        if (!panel) return
        if (event.target.closest?.("[data-modal-drag]")) {
            beginDrag(event)
            return
        }
        const scrollable = findScrollable(event.target, panel)
        if (scrollable && scrollable.scrollTop > 0) return

        stopListeners()
        const startX = event.clientX
        const startY = event.clientY
        const onMove = (e) => {
            const dx = e.clientX - startX
            const dy = e.clientY - startY
            if (Math.abs(dx) < DIRECTION_SLOP && Math.abs(dy) < DIRECTION_SLOP)
                return
            stopListeners()
            if (dy > 0 && Math.abs(dy) > Math.abs(dx)) beginDrag(e)
        }
        const onEnd = () => stopListeners()
        window.addEventListener("pointermove", onMove)
        window.addEventListener("pointerup", onEnd)
        window.addEventListener("pointercancel", onEnd)
        cleanupRef.current = () => {
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerup", onEnd)
            window.removeEventListener("pointercancel", onEnd)
        }
    }

    const onDragEnd = (event, info) => {
        if (
            info.offset.y > DISMISS_OFFSET ||
            info.velocity.y > DISMISS_VELOCITY
        ) {
            onClose()
        }
    }

    const dragProps = {
        drag: reduceMotion ? false : "y",
        dragListener: false,
        dragControls,
        dragConstraints: { top: 0 },
        dragElastic: { top: 0.05 },
        dragMomentum: false,
        dragSnapToOrigin: true,
        onDragEnd,
    }

    return {
        y,
        overlayOpacity,
        dragProps,
        onPanelPointerDown,
    }
}
