import { useLayoutEffect, useRef, useState } from "react"
import PropTypes from "prop-types"

import * as styles from "./FitText.module.css"

export default function FitText({
    children,
    minScale = 0.4,
    fitHeight = false,
    fill = 1,
    className,
    innerClassName,
}) {
    const outerRef = useRef(null)
    const innerRef = useRef(null)
    const [scale, setScale] = useState(1)

    useLayoutEffect(() => {
        const outer = outerRef.current
        const inner = innerRef.current
        if (!outer || !inner) return

        const measure = () => {
            const outerW = outer.clientWidth
            const innerW = inner.offsetWidth
            if (!outerW || !innerW) return
            // `fill` caps how much of the container the content may occupy
            let ratio = (fill * outerW) / innerW
            if (fitHeight) {
                const outerH = outer.clientHeight
                const innerH = inner.offsetHeight
                if (outerH && innerH)
                    ratio = Math.min(ratio, (fill * outerH) / innerH)
            }
            const next = Math.max(minScale, Math.min(1, ratio))
            setScale((prev) => (Math.abs(prev - next) < 0.002 ? prev : next))
        }

        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(outer)
        ro.observe(inner)
        return () => ro.disconnect()
    }, [minScale, fitHeight, fill, children])

    return (
        <div
            ref={outerRef}
            className={[styles.outer, className].filter(Boolean).join(" ")}
        >
            <div
                ref={innerRef}
                className={[styles.inner, innerClassName]
                    .filter(Boolean)
                    .join(" ")}
                style={{ transform: `scale(${scale})` }}
            >
                {children}
            </div>
        </div>
    )
}

FitText.propTypes = {
    children: PropTypes.node.isRequired,
    minScale: PropTypes.number,
    fitHeight: PropTypes.bool,
    fill: PropTypes.number,
    className: PropTypes.string,
    innerClassName: PropTypes.string,
}
