import { useId } from "react"
import PropTypes from "prop-types"

import * as styles from "../../TabBar.module.css"

function GradientMask({
    width,
    height,
    insets = { top: 21, right: 21, bottom: 21, left: 21 },
    innerHeight = 64,
    className,
}) {
    // Hooks must run unconditionally before any early returns
    const uid = useId()

    if (!width || !height) return null

    const { top, right, bottom, left } = insets
    const overlayWidth = width + left + right
    const overlayHeight = innerHeight + top + bottom
    const innerWidth = Math.max(0, overlayWidth - left - right)
    const rx = Math.min(innerHeight / 2, innerWidth / 2, 999)

    const gradId = `grad-${uid}`
    const maskId = `mask-${uid}`

    const overlayPaddingX = Math.max(left, right)
    const overlayPaddingY = Math.max(top, bottom)

    return (
        <svg
            width={overlayWidth}
            height={overlayHeight}
            viewBox={`0 0 ${overlayWidth} ${overlayHeight}`}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            className={[styles.gradient, className].filter(Boolean).join(" ")}
            style={{
                "--overlay-padding-x": `${overlayPaddingX}px`,
                "--overlay-padding-y": `${overlayPaddingY}px`,
            }}
            aria-hidden
        >
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop
                        offset="0%"
                        stopColor="var(--mask-color)"
                        stopOpacity="var(--mask-opacity-top)"
                    />
                    <stop
                        offset="100%"
                        stopColor="var(--mask-color)"
                        stopOpacity="var(--mask-opacity-bottom)"
                    />
                </linearGradient>
                <mask id={maskId} maskUnits="userSpaceOnUse">
                    <rect
                        x="0"
                        y="0"
                        width={overlayWidth}
                        height={overlayHeight}
                        fill="var(--tma-static-white)"
                    />
                    <rect
                        x={left}
                        y={top}
                        width={innerWidth}
                        height={innerHeight}
                        rx={rx}
                        ry={rx}
                        fill="var(--tma-static-black)"
                    />
                </mask>
            </defs>
            <rect
                width={overlayWidth}
                height={overlayHeight}
                fill={`url(#${gradId})`}
                mask={`url(#${maskId})`}
            />
        </svg>
    )
}

GradientMask.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    insets: PropTypes.shape({
        top: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number,
    }),
    innerHeight: PropTypes.number,
    className: PropTypes.string,
}

export default GradientMask
