import PropTypes from "prop-types"
import Text from "../../../Text"
import * as styles from "./CellPart.module.scss"

export const CellPart = ({
    type,
    className,
    children,
    value,
    onChange,
    inputRef,
    id,
    name = "color",
    showValue = true,
}) => {
    if (type === "Picker") {
        return (
            <div className={styles.picker}>
                <Text variant="body" weight="regular">
                    {children}
                </Text>
            </div>
        )
    }

    if (type === "ColorPicker") {
        const inputId = id || name
        return (
            <div className={styles.colorpicker}>
                <input
                    ref={inputRef}
                    type="color"
                    value={value}
                    onChange={onChange}
                    name={name}
                    id={inputId}
                />
                {showValue && (
                    <label htmlFor={inputId}>
                        <Text variant="body" weight="regular">
                            {value}
                        </Text>
                    </label>
                )}
            </div>
        )
    }

    return (
        <div
            className={[styles[type.toLowerCase()], styles[className]]
                .filter(Boolean)
                .join(" ")}
        >
            {children}
        </div>
    )
}

CellPart.propTypes = {
    type: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    value: PropTypes.string,
    onChange: PropTypes.func,
    inputRef: PropTypes.object,
    id: PropTypes.string,
    name: PropTypes.string,
    showValue: PropTypes.bool,
}

export default CellPart
