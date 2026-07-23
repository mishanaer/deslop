import { useLayoutEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import * as m from "motion/react-m"
import { Calligraph } from "calligraph"
import * as styles from "./Wheel.module.css"

import Tick from "./Tick"
import useWheelSnap from "./useWheelSnap"

const CenterIndicator = <div className={styles.centerIndicator} />

// Past this many pixels of drag the release is a drag end, not a tap
const TAP_SLOP = 5

const Wheel = ({
    value,
    defaultValue = 1,
    onChange,
    max = 40,
    prefix = "",
    suffix = "\u00d7",
    disabled = false,
    enableHaptic = true,
    className,
}) => {
    const containerRef = useRef(null)
    const draggedRef = useRef(false)
    const [radius, setRadius] = useState(250)

    const {
        currentValue,
        x,
        handleDrag,
        handleDragEnd,
        animateToValue,
        dragConstraints,
        ticks,
        min,
    } = useWheelSnap({
        value,
        defaultValue,
        onChange,
        max,
        disabled,
        enableHaptic,
    })

    // The drum spans the full container: ticks fold past its edges at 90deg
    useLayoutEffect(() => {
        const node = containerRef.current
        if (!node) return
        const measure = () => {
            if (node.clientWidth > 0) setRadius(node.clientWidth / 2)
        }
        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(node)
        return () => observer.disconnect()
    }, [])

    const handleTickSelect = (tickValue) => {
        if (disabled || draggedRef.current) return
        animateToValue(tickValue)
    }

    const handleKeyDown = (e) => {
        if (disabled) return

        const keyActions = {
            ArrowLeft: () => animateToValue(Math.max(min, currentValue - 1)),
            ArrowDown: () => animateToValue(Math.max(min, currentValue - 1)),
            ArrowRight: () => animateToValue(Math.min(max, currentValue + 1)),
            ArrowUp: () => animateToValue(Math.min(max, currentValue + 1)),
            Home: () => animateToValue(min),
            End: () => animateToValue(max),
        }

        const action = keyActions[e.key]
        if (!action) return
        e.preventDefault()
        action()
    }

    const cx = className ? `${styles.root} ${className}` : styles.root

    return (
        <div className={cx} data-disabled={disabled || undefined}>
            <div className={styles.header}>
                <m.button
                    className={styles.button}
                    onClick={() => animateToValue(min)}
                    disabled={disabled}
                    whileTap={!disabled ? { scale: 0.95 } : undefined}
                >
                    Min
                </m.button>
                <m.button
                    className={styles.button}
                    onClick={() => animateToValue(max)}
                    disabled={disabled}
                    whileTap={!disabled ? { scale: 0.95 } : undefined}
                >
                    Max
                </m.button>
            </div>

            <div className={styles.currentValue}>
                {prefix}
                <Calligraph
                    variant="number"
                    animation="snappy"
                    style={{ color: "inherit", fontSize: "inherit" }}
                >
                    {currentValue}
                </Calligraph>
                {suffix}
            </div>

            <div
                ref={containerRef}
                className={styles.wheelContainer}
                role="slider"
                aria-label="Value selector"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={currentValue}
                aria-disabled={disabled || undefined}
                tabIndex={disabled ? -1 : 0}
                onKeyDown={handleKeyDown}
            >
                {CenterIndicator}

                <m.div
                    className={styles.ticksContainer}
                    style={{ x }}
                    drag={disabled ? false : "x"}
                    dragConstraints={dragConstraints}
                    dragElastic={0.1}
                    dragMomentum={false}
                    onPointerDown={() => {
                        draggedRef.current = false
                    }}
                    onDrag={(event, info) => {
                        if (Math.abs(info.offset.x) > TAP_SLOP) {
                            draggedRef.current = true
                        }
                        handleDrag()
                    }}
                    onDragEnd={handleDragEnd}
                >
                    {ticks.map((tickValue, index) => (
                        <Tick
                            key={tickValue}
                            value={tickValue}
                            index={index}
                            x={x}
                            radius={radius}
                            onSelect={handleTickSelect}
                        />
                    ))}
                </m.div>
            </div>
        </div>
    )
}

Wheel.propTypes = {
    value: PropTypes.number,
    defaultValue: PropTypes.number,
    onChange: PropTypes.func,
    max: PropTypes.number,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    disabled: PropTypes.bool,
    enableHaptic: PropTypes.bool,
    className: PropTypes.string,
}

export default Wheel
