import { useEffect, useLayoutEffect, useRef } from "react"
import PropTypes from "prop-types"
import * as m from "motion/react-m"
import { AnimatePresence, animate, useMotionValue } from "motion/react"
import * as styles from "./ModalView.module.css"

import { ModalNavContext } from "./context"
import { useResizeObserver } from "../../hooks/useResizeObserver"
import { EASING } from "../../utils/animations"

const ZOOM_IN = 0.95
const ZOOM_OUT = 1.05
const PAGE_BLUR = "blur(4px)"

// Cross-fade with a light blur and an in-window zoom. The camera pushes in on
// forward navigation: the entering page grows into place while the exiting
// one keeps growing past it; back plays the same move in reverse.
const pageVariants = {
    enter: (direction) => ({
        opacity: 0,
        scale: direction > 0 ? ZOOM_IN : ZOOM_OUT,
        filter: PAGE_BLUR,
    }),
    center: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: (direction) => ({
        opacity: 0,
        scale: direction > 0 ? ZOOM_OUT : ZOOM_IN,
        filter: PAGE_BLUR,
    }),
}

// Fade and height share timing so the page change and the tray resize read
// as one gesture.
const fadeTransition = { duration: 0.3, ease: EASING.QUINT_OUT }
const heightTransition = { duration: 0.3, ease: EASING.QUINT_OUT }

// Dynamic Tray body: measures the in-flow (entering) page and animates the
// viewport height to it. popLayout pops the exiting page to absolute, so the
// measurement never sees it (same pattern as Tabs/TabContent).
const TrayPages = ({ pages, activeId, depth, direction, nav }) => {
    const innerRef = useRef(null)

    // Height is a motion value rendered through style, so the viewport always
    // carries an inline height once measured. Relying on animate={{height}}
    // instead leaves no inline height after an equal-target update (motion
    // skips it), and the first push then snaps to the new content height
    // before the tween can start.
    const height = useMotionValue("auto")
    const targetRef = useRef(null)
    const animationRef = useRef(null)

    const applyHeight = (next, animated) => {
        if (targetRef.current === next) return
        targetRef.current = next
        animationRef.current?.stop()
        if (animated) {
            animationRef.current = animate(height, next, heightTransition)
        } else {
            height.set(next)
        }
    }

    // Measure synchronously on page change so the height tween starts on the
    // same frame as the cross-fade. The first measurement pins the height
    // without animating. Re-runs on unrelated renders are no-ops (targetRef).
    useLayoutEffect(() => {
        const el = innerRef.current
        if (el) applyHeight(el.offsetHeight, height.get() !== "auto")
    }, [activeId, depth, applyHeight, height])

    useEffect(() => () => animationRef.current?.stop(), [])

    // Organic content growth between navigations (images, collapsibles).
    useResizeObserver(innerRef, () => {
        const el = innerRef.current
        if (el) applyHeight(el.offsetHeight, true)
    })

    const active = pages.find((page) => page.id === activeId)

    return (
        <ModalNavContext.Provider value={nav}>
            <div className={styles.blurWarmup} aria-hidden="true" />
            <m.div className={styles.trayViewport} style={{ height }}>
                <div ref={innerRef} className={styles.measure}>
                    <AnimatePresence
                        mode="popLayout"
                        initial={false}
                        custom={direction}
                    >
                        <m.div
                            key={`${depth}-${activeId}`}
                            className={styles.page}
                            custom={direction}
                            variants={pageVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={fadeTransition}
                        >
                            {active ? active.element : null}
                        </m.div>
                    </AnimatePresence>
                </div>
            </m.div>
        </ModalNavContext.Provider>
    )
}

TrayPages.propTypes = {
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            element: PropTypes.node,
        })
    ).isRequired,
    activeId: PropTypes.string,
    depth: PropTypes.number.isRequired,
    direction: PropTypes.number.isRequired,
    nav: PropTypes.shape({
        push: PropTypes.func.isRequired,
        pop: PropTypes.func.isRequired,
        canPop: PropTypes.bool.isRequired,
        activeId: PropTypes.string,
        close: PropTypes.func.isRequired,
    }).isRequired,
}

export default TrayPages
