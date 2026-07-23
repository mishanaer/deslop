import { useRef, useState, useLayoutEffect } from "react"
import PropTypes from "prop-types"
import { useResizeObserver } from "../../hooks/useResizeObserver"

const Collapsible = ({ open, children, duration = 200, easing = "ease" }) => {
    const contentRef = useRef(null)

    const [height, setHeight] = useState(open ? "auto" : 0)
    const [shouldRender, setShouldRender] = useState(open)
    const actualShouldRender = open ? true : shouldRender
    const handleTransitionEnd = (e) => {
        if (e.propertyName !== "height") return
        if (open) {
            setHeight("auto")
            return
        }
        setShouldRender(false)
    }
    useLayoutEffect(() => {
        const el = contentRef.current
        if (!el) return

        if (open) {
            const fullHeight = el.scrollHeight
            setHeight(fullHeight)
            return
        }
        if (height === "auto") {
            const fullHeight = el.scrollHeight
            setHeight(fullHeight)
            requestAnimationFrame(() => setHeight(0))
            return
        }
        setHeight(0)
    }, [open, height])
    useResizeObserver(
        contentRef,
        () => {
            const el = contentRef.current
            if (el) setHeight(el.scrollHeight)
        },
        { enabled: open }
    )

    const style = {
        width: "100%",
        overflow: "hidden",
        height: height === "auto" ? "auto" : `${height}px`,
        transition:
            height === "auto" ? undefined : `height ${duration}ms ${easing}`,
        willChange: "height",
    }

    return (
        <div
            style={style}
            onTransitionEnd={handleTransitionEnd}
            aria-hidden={!open && !actualShouldRender}
        >
            <div ref={contentRef}>{actualShouldRender ? children : null}</div>
        </div>
    )
}

Collapsible.propTypes = {
    open: PropTypes.bool,
    children: PropTypes.node,
    duration: PropTypes.number,
    easing: PropTypes.string,
}
export default Collapsible
