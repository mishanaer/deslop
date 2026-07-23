import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useMotionValue, animate } from "motion/react"
import WebApp from "../../lib/twa"
import { SPRING } from "../../utils/animations"

const TICK_WIDTH = 32
const TICK_GAP = 8
export const STEP_WIDTH = TICK_WIDTH + TICK_GAP
const VELOCITY_FACTOR = 0.6
const MIN = 1

function getValueFromX(xPos, max) {
    const index = Math.round(-xPos / STEP_WIDTH)
    if (index < 0) return MIN
    if (index + 1 > max) return max
    return index + 1
}

function clamp(val, max) {
    return Math.min(max, Math.max(MIN, val))
}

const useWheelSnap = ({
    value,
    defaultValue = 1,
    onChange,
    max = 40,
    disabled = false,
    enableHaptic = true,
}) => {
    const isControlled = value !== undefined
    const [uncontrolled, setUncontrolled] = useState(defaultValue)
    const currentValue = isControlled ? value : uncontrolled
    const [previousValue, setPreviousValue] = useState(currentValue)
    const currentValueRef = useRef(currentValue)
    // Values reported through onChange: when the controlled prop echoes one
    // of them back, x is already there (or animating there with the drag's
    // velocity) — re-animating would fight the gesture and kill momentum.
    const lastInternalValueRef = useRef(currentValue)

    const x = useMotionValue(-(currentValue - 1) * STEP_WIDTH)

    const shouldAnimate = previousValue !== currentValue
    if (shouldAnimate) {
        setPreviousValue(currentValue)
    }

    // Keep ref in sync for event handlers
    useEffect(() => {
        currentValueRef.current = currentValue
    }, [currentValue])

    const setValueWithHaptic = useCallback(
        (newValue) => {
            const clamped = clamp(newValue, max)
            if (enableHaptic && clamped !== currentValueRef.current) {
                WebApp.HapticFeedback.selectionChanged()
            }
            lastInternalValueRef.current = clamped
            if (!isControlled) setUncontrolled(clamped)
            onChange?.(clamped)
        },
        [max, enableHaptic, isControlled, onChange]
    )

    const animateToValue = useCallback(
        (targetValue, config = SPRING.GENTLE) => {
            if (disabled) return
            animate(x, -(targetValue - 1) * STEP_WIDTH, config)
            setValueWithHaptic(targetValue)
        },
        [disabled, x, setValueWithHaptic]
    )

    const handleDrag = useCallback(() => {
        if (disabled) return
        const newValue = getValueFromX(x.get(), max)
        if (newValue === currentValueRef.current) return
        setValueWithHaptic(newValue)
    }, [disabled, x, max, setValueWithHaptic])

    const handleDragEnd = useCallback(
        (_, info) => {
            if (disabled) return

            const currentX = x.get()
            const velocity = info.velocity.x
            const projection = currentX + velocity * VELOCITY_FACTOR
            const targetValue = getValueFromX(projection, max)
            const targetX = -(targetValue - 1) * STEP_WIDTH

            animate(x, targetX, { ...SPRING.SNAP, velocity })
            setValueWithHaptic(targetValue)
        },
        [disabled, x, max, setValueWithHaptic]
    )

    // Sync x position when the controlled value changes externally
    useEffect(() => {
        if (!isControlled || value === undefined) return
        if (value === lastInternalValueRef.current) return
        lastInternalValueRef.current = value
        animate(x, -(clamp(value, max) - 1) * STEP_WIDTH, SPRING.GENTLE)
    }, [value, isControlled, max, x])

    const dragConstraints = useMemo(
        () => ({ left: -(max - 1) * STEP_WIDTH, right: 0 }),
        [max]
    )

    const ticks = useMemo(
        () => Array.from({ length: max - MIN + 1 }, (_, i) => MIN + i),
        [max]
    )

    return {
        currentValue,
        shouldAnimate,
        x,
        handleDrag,
        handleDragEnd,
        animateToValue,
        dragConstraints,
        ticks,
        min: MIN,
    }
}

export default useWheelSnap
