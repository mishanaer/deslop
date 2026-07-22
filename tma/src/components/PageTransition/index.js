import { useRef } from "react"
import PropTypes from "prop-types"
import * as m from "motion/react-m"
import { AnimatePresence, useIsPresent } from "motion/react"
import { useLocation } from "wouter"
import useScrollRestoration from "../../hooks/useScrollRestoration"
import { EASING } from "../../utils/animations"
import { FrozenLocationContext } from "./context"

import * as styles from "./PageTransition.module.scss"

const variants = {
    initial: { opacity: 0, scale: 1.006 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.01 },
}

const transition = {
    duration: 0.3,
    ease: EASING.MATERIAL_STANDARD,
}

// The scroller is a separate component so that every location gets a fresh
// mount and with it a fresh scroll save/restore pass. `ref` must reach the
// m.div: with mode="popLayout" AnimatePresence measures and absolutizes the
// exiting element through its direct child's ref. The location this instance
// was keyed with is frozen into context so the route content keeps rendering
// it while exiting — see context.js.
const PageScroll = ({ ref, location, className, children }) => {
    const scrollRef = useRef(null)
    // Saving stops the moment the screen starts exiting — see the hook.
    const isPresent = useIsPresent()
    useScrollRestoration(scrollRef, "page", { enabled: isPresent })
    return (
        <m.div
            ref={(node) => {
                scrollRef.current = node
                if (typeof ref === "function") ref(node)
                else if (ref) ref.current = node
            }}
            className={className}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
        >
            <FrozenLocationContext.Provider value={location}>
                {children}
            </FrozenLocationContext.Provider>
        </m.div>
    )
}

PageScroll.propTypes = {
    ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    location: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
}

/**
 * Wraps a route to orchestrate the page-level enter/exit (fade + scale) and
 * per-location scroll restoration. One per route — don't nest competing route
 * transitions inside pages.
 * @param {boolean} [props.bottomInset] Reserve safe-area space at the bottom.
 * @param {boolean} [props.contained]   Scope the transition to a sub-container.
 * @example
 * <PageTransition bottomInset>
 *   <Page mode="secondary">{routeContent}</Page>
 * </PageTransition>
 */
const PageTransition = ({ children, bottomInset = false, contained = false }) => {
    const [location] = useLocation()

    const rootClassName = contained
        ? `${styles.root} ${styles.contained}`
        : styles.root

    return (
        <div className={rootClassName}>
            <AnimatePresence mode="popLayout">
                <PageScroll
                    key={location}
                    location={location}
                    className={`${styles.scroll} ${bottomInset ? styles.withBottomInset : ""}`}
                >
                    {children}
                </PageScroll>
            </AnimatePresence>
        </div>
    )
}

PageTransition.propTypes = {
    children: PropTypes.node,
    bottomInset: PropTypes.bool,
    contained: PropTypes.bool,
}

export default PageTransition
