import { useEffect, useId, useRef } from "react"
import PropTypes from "prop-types"
import * as m from "motion/react-m"
import { animate, useReducedMotion } from "motion/react"
import Text from "../Text"
import { GlassContainer } from "../GlassEffect"

import { SPRING } from "../../utils/animations"
import * as styles from "./Tabs.module.scss"

const Tabs = ({
    tabs,
    activeTabIndex = 0,
    onChange,
    scrollable = false,
    variant,
    className,
    ...props
}) => {
    const layoutId = `tabs-indicator-${useId()}`
    const reduceMotion = useReducedMotion()
    const rootRef = useRef(null)
    const tabRefs = useRef([])
    const isCompact = variant === "compact"
    const isGlass = variant === "glass"

    useEffect(() => {
        if (!scrollable) return
        const root = rootRef.current
        if (!root) return
        const maxScroll = root.scrollWidth - root.clientWidth
        if (maxScroll <= 0) return
        const progress =
            tabs.length > 1 ? activeTabIndex / (tabs.length - 1) : 0
        const target = progress * maxScroll
        if (Math.abs(root.scrollLeft - target) < 0.5) return
        if (reduceMotion) {
            root.scrollLeft = target
            return
        }
        const controls = animate(root.scrollLeft, target, {
            duration: 0.4,
            ease: [0.23, 1, 0.32, 1],
            onUpdate: (v) => {
                root.scrollLeft = v
            },
        })
        return () => controls.stop()
    }, [activeTabIndex, scrollable, tabs.length, reduceMotion])

    const handleClick = (index) => {
        if (index !== activeTabIndex) onChange?.(index)
    }

    const handleKeyDown = (event) => {
        const count = tabs.length
        if (!count) return
        let nextIndex = null
        if (event.key === "ArrowRight") nextIndex = (activeTabIndex + 1) % count
        else if (event.key === "ArrowLeft")
            nextIndex = (activeTabIndex - 1 + count) % count
        else if (event.key === "Home") nextIndex = 0
        else if (event.key === "End") nextIndex = count - 1
        if (nextIndex == null) return
        event.preventDefault()
        onChange?.(nextIndex)
        tabRefs.current[nextIndex]?.focus()
    }

    const listClass = [
        styles.list,
        scrollable ? styles.scrollable : "",
        isCompact ? styles.compact : "",
        isGlass ? styles.glassList : "",
    ]
        .filter(Boolean)
        .join(" ")

    const transition = reduceMotion ? { duration: 0 } : SPRING.GENTLE

    const textProps = isGlass
        ? {
              apple: { variant: "subheadline1", weight: "semibold" },
              material: { variant: "subheadline1", weight: "medium" },
          }
        : {
              apple: { variant: "subheadline2", weight: "semibold" },
              material: { variant: "subheadline2", weight: "medium" },
          }

    const tabButtons = tabs.map((label, index) => {
        const isActive = index === activeTabIndex
        return (
            <button
                type="button"
                key={index}
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                ref={(el) => {
                    tabRefs.current[index] = el
                }}
                className={`${styles.tab} ${isActive ? styles.active : ""}`}
                onClick={() => handleClick(index)}
            >
                {isActive && (
                    <m.span
                        aria-hidden="true"
                        layoutId={layoutId}
                        className={styles.indicator}
                        transition={transition}
                    />
                )}
                <Text {...textProps} className={styles.label}>
                    {label}
                </Text>
            </button>
        )
    })

    if (isGlass) {
        return (
            <div
                className={`${styles.glassRoot} ${className || ""}`.trim()}
                {...props}
            >
                <GlassContainer />
                <div
                    ref={rootRef}
                    role="tablist"
                    className={listClass}
                    onKeyDown={handleKeyDown}
                >
                    {tabButtons}
                </div>
            </div>
        )
    }

    return (
        <div
            ref={rootRef}
            role="tablist"
            className={`${listClass} ${className || ""}`.trim()}
            onKeyDown={handleKeyDown}
            {...props}
        >
            {tabButtons}
        </div>
    )
}

Tabs.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.node).isRequired,
    activeTabIndex: PropTypes.number,
    onChange: PropTypes.func,
    scrollable: PropTypes.bool,
    variant: PropTypes.oneOf(["compact", "glass"]),
    className: PropTypes.string,
}

export default Tabs
