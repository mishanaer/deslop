import { useLayoutEffect } from "react"
import PropTypes from "prop-types"
import * as m from "motion/react-m"
import { generateClipPath, getLayoutSize } from "@lisse/core"

// Wraps the modal panel so the corner clip mounts with it (the panel lives
// inside AnimatePresence; ModalView itself is always mounted).
//
// The squircle is applied directly instead of via useSmoothCorners: the hook
// defers its ResizeObserver work to the next animation frame, so while the
// tray height tween runs the clip trails the panel by a frame. The sheet is
// bottom-anchored and grows upward, so the stale (shorter) clip cuts the
// freshly grown strip off the bottom edge — a transparent gap flashing over
// the dimmed page. Writing the clip inside our own ResizeObserver callback
// (fires after layout, before paint) keeps it in sync with every painted
// frame.
const ModalPanel = ({ panelRef, corners, children, ...rest }) => {
    useLayoutEffect(() => {
        const el = panelRef.current
        if (!el) return undefined
        const apply = () => {
            const { width, height } = getLayoutSize(el)
            if (width <= 0 || height <= 0) return
            el.style.clipPath = generateClipPath(width, height, corners)
        }
        apply()
        const observer = new ResizeObserver(apply)
        observer.observe(el)
        return () => {
            observer.disconnect()
            el.style.clipPath = ""
        }
    }, [panelRef, corners])

    return (
        <m.div ref={panelRef} {...rest}>
            {children}
        </m.div>
    )
}

ModalPanel.propTypes = {
    panelRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any }),
    ]),
    corners: PropTypes.object,
    children: PropTypes.node,
}

export default ModalPanel
