import { useState } from "react"
import PropTypes from "prop-types"
import { useColorScheme } from "../../hooks/useColorScheme"
import Text from "../Text"

import * as styles from "./SegmentedControl.module.css"

/**
 * Segmented picker with an animated active indicator. Uncontrolled — tracks
 * its own index from `defaultIndex`; onChange receives the selected index.
 * @param {Array<import("react").ReactNode>} props.segments Labels, one per segment.
 * @param {number} [props.defaultIndex=0]
 * @param {(index: number) => void} [props.onChange]
 * @example
 * <SegmentedControl segments={["Day", "Week", "Month"]} onChange={setRange} />
 */
const SegmentedControl = ({
    segments,
    onChange,
    defaultIndex = 0,
    colorScheme: forceColorScheme,
    ...props
}) => {
    const [activeIndex, setActiveIndex] = useState(defaultIndex)
    const colorScheme = useColorScheme(forceColorScheme)

    const handleSegmentClick = (index) => {
        setActiveIndex(index)
        if (onChange) onChange(index)
    }

    return (
        <div className={styles.root} data-color-scheme={colorScheme} {...props}>
            {segments.map((segment, index) => (
                <button
                    key={index}
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
                style={{
                    width: `calc(${100 / segments.length}% - var(--ui-space-4))`,
                    transform: `translateX(calc(${activeIndex} * (100% + var(--ui-space-4))))`,
                    marginLeft: "var(--ui-space-2)",
                    marginRight: "var(--ui-space-2)",
                }}
            />
        </div>
    )
}

SegmentedControl.propTypes = {
    segments: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    defaultIndex: PropTypes.number,
    colorScheme: PropTypes.string,
}
export default SegmentedControl
