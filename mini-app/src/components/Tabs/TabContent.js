import { useRef, useState } from "react"
import PropTypes from "prop-types"
import * as m from "motion/react-m"
import { AnimatePresence, useReducedMotion } from "motion/react"

import { useResizeObserver } from "../../hooks/useResizeObserver"

const SLIDE_DISTANCE = 24

const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? SLIDE_DISTANCE : -SLIDE_DISTANCE,
        opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({
        x: direction > 0 ? -SLIDE_DISTANCE : SLIDE_DISTANCE,
        opacity: 0,
    }),
}

const TabContent = ({ activeIndex, children }) => {
    const reduceMotion = useReducedMotion()
    const [state, setState] = useState({ prev: activeIndex, direction: 0 })

    if (state.prev !== activeIndex) {
        setState({ prev: activeIndex, direction: activeIndex - state.prev })
    }
    const { direction } = state

    const innerRef = useRef(null)
    const [height, setHeight] = useState(null)

    useResizeObserver(innerRef, () => {
        const el = innerRef.current
        if (el) setHeight(el.offsetHeight)
    })

    const slideTransition = reduceMotion
        ? { duration: 0 }
        : { duration: 0.35, ease: [0.23, 1, 0.32, 1] }
    const heightTransition = reduceMotion
        ? { duration: 0 }
        : { duration: 0.3, ease: [0.23, 1, 0.32, 1] }

    return (
        <m.div
            style={{ overflow: "hidden" }}
            initial={false}
            animate={height == null ? undefined : { height }}
            transition={heightTransition}
        >
            <div ref={innerRef}>
                <AnimatePresence
                    mode="popLayout"
                    initial={false}
                    custom={direction}
                >
                    <m.div
                        key={activeIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={slideTransition}
                    >
                        {children}
                    </m.div>
                </AnimatePresence>
            </div>
        </m.div>
    )
}

TabContent.propTypes = {
    activeIndex: PropTypes.number.isRequired,
    children: PropTypes.node,
}

export default TabContent
