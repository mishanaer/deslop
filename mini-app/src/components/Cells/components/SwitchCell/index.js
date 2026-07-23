import { useState } from "react"
import PropTypes from "prop-types"
import WebApp from "../../../../lib/twa"
import Cell from "../../index"
import Switch from "../../../Switch"

const SwitchCell = ({
    start,
    children,
    value,
    defaultValue = false,
    onChange,
    disabled = false,
    ...props
}) => {
    const isControlled = value !== undefined
    const [uncontrolled, setUncontrolled] = useState(defaultValue)
    const checked = isControlled ? value : uncontrolled

    const emitChange = (next) => {
        if (onChange) onChange(next)
    }

    const handleChange = (next) => {
        if (!isControlled) setUncontrolled(next)
        emitChange(next)
    }

    const handleClick = () => {
        if (disabled) return
        WebApp.HapticFeedback.selectionChanged()
        if (isControlled) {
            handleChange(!checked)
            return
        }

        setUncontrolled((prev) => {
            const next = !prev
            emitChange(next)
            return next
        })
    }

    return (
        <Cell
            start={start}
            end={
                <Cell.Part type="Switch">
                    <Switch
                        value={checked}
                        onChange={handleChange}
                        disabled={disabled}
                    />
                </Cell.Part>
            }
            onClick={handleClick}
            {...props}
        >
            {children}
        </Cell>
    )
}

SwitchCell.propTypes = {
    start: PropTypes.node,
    children: PropTypes.node,
    value: PropTypes.bool,
    defaultValue: PropTypes.bool,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
}

export default SwitchCell
