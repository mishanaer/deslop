import { useLayoutEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import { useColorScheme } from "../../hooks/useColorScheme"
import Text from "../Text"

import * as styles from "./SegmentedControl.module.css"

/**
 * Segmented picker with an animated active indicator. Uncontrolled — tracks
 * its own index from `defaultIndex`; onChange receives the selected index.
 * @param {object} props
 * @param {Array<import("react").ReactNode>} props.segments Labels, one per segment.
 * @param {number} [props.defaultIndex=0]
 * @param {(index: number) => void} [props.onChange]
 * @param {"light"|"dark"} [props.colorScheme]
 * @param {boolean} [props.fitContent=false]
 * @example
 * <SegmentedControl segments={["Day", "Week", "Month"]} onChange={setRange} />
 */
const SegmentedControl = ({
    segments,
    onChange,
    defaultIndex = 0,
    colorScheme: forceColorScheme,
    fitContent = false,
    ...props
}) => {
    const [activeIndex, setActiveIndex] = useState(defaultIndex)
    const [fitIndicator, setFitIndicator] = useState(null)
    const rootRef = useRef(null)
    const segmentRefs = useRef([])
    const colorScheme = useColorScheme(forceColorScheme)

    useLayoutEffect(() => {
        if (!fitContent) return undefined

        const root = rootRef.current
        const segment = segmentRefs.current[activeIndex]
        if (!root || !segment) return undefined

        const measure = () => {
            const rootRect = root.getBoundingClientRect()
            const segmentRect = segment.getBoundingClientRect()
            const next = {
                width: segmentRect.width,
                x: segmentRect.left - rootRect.left,
            }
            setFitIndicator((current) =>
                current?.width === next.width && current?.x === next.x ? current : next,
            )
        }

        measure()

        const view = root.ownerDocument.defaultView
        const resizeObserver = view?.ResizeObserver ? new view.ResizeObserver(measure) : null
        resizeObserver?.observe(root)
        view?.addEventListener("resize", measure)

        return () => {
            resizeObserver?.disconnect()
            view?.removeEventListener("resize", measure)
        }
    }, [activeIndex, fitContent, segments.length])

    const handleSegmentClick = (index) => {
        setActiveIndex(index)
        if (onChange) onChange(index)
    }

    return (
        <div
            ref={rootRef}
            className={`${styles.root} ${fitContent ? styles.fitContent : ""}`}
            data-color-scheme={colorScheme}
            {...props}
        >
            {segments.map((segment, index) => (
                <button
                    key={index}
                    ref={(node) => {
                        segmentRefs.current[index] = node
                    }}
                    className={`${styles.segment} ${index === activeIndex ? styles.active : ""}`}
                    onClick={() => handleSegmentClick(index)}
                >
                    <Text variant="footnote" weight="semibold">
                        {segment}
                    </Text>
                </button>
            ))}
            <div
                className={styles.activeIndicator}
                style={
                    fitContent && fitIndicator
                        ? {
                              width: `${fitIndicator.width}px`,
                              transform: `translateX(${fitIndicator.x}px)`,
                          }
                        : {
                              width: `calc(${100 / segments.length}% - var(--ui-space-4))`,
                              transform: `translateX(calc(${activeIndex} * (100% + var(--ui-space-4))))`,
                              marginLeft: "var(--ui-space-2)",
                              marginRight: "var(--ui-space-2)",
                          }
                }
            />
        </div>
    )
}

SegmentedControl.propTypes = {
    segments: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    defaultIndex: PropTypes.number,
    colorScheme: PropTypes.string,
    fitContent: PropTypes.bool,
}
export default SegmentedControl
