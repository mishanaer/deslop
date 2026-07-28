import PropTypes from "prop-types"
import { useState } from "react"

import { useSkin } from "../../hooks/DeviceProvider"

import { useTapHighlight } from "./useTapHighlight"

import * as styles from "./Tappable.module.css"

const cx = (...classes) => classes.filter(Boolean).join(" ")

// Compose the caller's event handlers with the ones the tap-highlight needs so
// that handlers on the same events (e.g. an onTouchStart used to preload a
// route) keep firing alongside the highlight.
const mergeHandlers = (external, internal) => {
    const merged = { ...external }
    for (const key of Object.keys(internal)) {
        const ownFn = external[key]
        const tapFn = internal[key]
        merged[key] = ownFn
            ? (event) => {
                  ownFn(event)
                  tapFn(event)
              }
            : tapFn
    }
    return merged
}

// Adds native-feeling press feedback to any element: an iOS tint (overlay) or
// dimming (opacity) on Apple, and a Material ripple on Android/Desktop. Renders
// as `as` (default div) and stays layout-transparent — the feedback layers are
// absolutely positioned, so `as` keeps its own layout.
const Tappable = ({
    as: Component = "div",
    children,
    className = "",
    mode = "overlay",
    disabled = false,
    ...props
}) => {
    const { isApple, isMaterial } = useSkin()
    const [ripples, setRipples] = useState({})

    const [tapped, tapHandlers, tappedClassNames] = useTapHighlight({
        mode,
        disabled,
        onTap: ({ target, clientX, clientY }) => {
            if (!isMaterial || !target) return
            const { x, y, width, height } = target.getBoundingClientRect()
            const size = Math.max(width * 2, height * 2)
            setRipples((prev) => ({
                ...prev,
                [`${performance.now()}`]: [
                    clientX - x - size / 2,
                    clientY - y - size / 2,
                    size,
                ],
            }))
        },
    })

    const isOpacity = mode === "opacity"
    const handlers = mergeHandlers(props, tapHandlers)

    return (
        <Component
            {...handlers}
            disabled={disabled || undefined}
            className={cx(
                styles.root,
                className,
                isOpacity && cx(...tappedClassNames),
            )}
        >
            {children}
            {isApple && !isOpacity && (
                <div className={cx(styles.fade, ...tappedClassNames)} />
            )}
            {isMaterial && (
                <div className={styles.ripples}>
                    {Object.entries(ripples).map(([id, value]) => (
                        <span
                            key={id}
                            className={cx(
                                styles.ripple,
                                tapped && styles.tapped,
                            )}
                            style={{
                                left: value[0],
                                top: value[1],
                                width: value[2],
                                height: value[2],
                            }}
                            onAnimationEnd={() => {
                                if (tapped) return
                                setRipples((prev) => {
                                    const next = { ...prev }
                                    delete next[id]
                                    return next
                                })
                            }}
                        />
                    ))}
                </div>
            )}
        </Component>
    )
}

Tappable.propTypes = {
    as: PropTypes.elementType,
    children: PropTypes.node,
    className: PropTypes.string,
    mode: PropTypes.oneOf(["overlay", "opacity"]),
    disabled: PropTypes.bool,
}

export default Tappable
