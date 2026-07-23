import { useState } from "react"
import PropTypes from "prop-types"
import WebApp from "../../lib/twa"
import * as styles from "./Switch.module.css"

/**
 * iOS/Material toggle. Controlled when `value` is passed, otherwise
 * uncontrolled from `defaultValue`. Stops click propagation, so it's safe
 * inside a tappable Cell. onChange receives the next boolean.
 * @param {boolean} [props.value] Controlled state.
 * @param {boolean} [props.defaultValue=false] Initial state when uncontrolled.
 * @param {(next: boolean) => void} [props.onChange]
 * @example
 * <Switch defaultValue onChange={setEnabled} />
 */
function Switch({
    value,
    defaultValue = false,
    onChange,
    disabled = false,
    className,
}) {
    const isControlled = value !== undefined
    const [uncontrolled, setUncontrolled] = useState(defaultValue)
    const checked = isControlled ? value : uncontrolled

    const emitChange = (next) => {
        if (onChange) onChange(next)
    }

    const toggle = () => {
        WebApp.HapticFeedback.selectionChanged()

        if (isControlled) {
            emitChange(!checked)
            return
        }

        setUncontrolled((prev) => {
            const next = !prev
            emitChange(next)
            return next
        })
    }

    const handleClick = (e) => {
        e.stopPropagation()
        if (disabled) return
        toggle()
    }

    const cx = className ? `${styles.root} ${className}` : styles.root

    return (
        <div
            className={cx}
            data-state={checked}
            data-disabled={disabled || undefined}
            onClick={handleClick}
            role="switch"
            aria-checked={checked}
            aria-disabled={disabled || undefined}
        ></div>
    )
}

Switch.propTypes = {
    value: PropTypes.bool,
    defaultValue: PropTypes.bool,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string,
}
export default Switch
