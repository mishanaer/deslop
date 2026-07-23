import { forwardRef } from "react"
import PropTypes from "prop-types"

import Text from "../../../Text"
import ClearIcon from "@deslop/primitives/icons/circle-close.svg?react"
import * as styles from "./EditableCell.module.css"

const EditableCell = forwardRef(
    ({ label, value, onChange, onClear, ...rest }, ref) => {
        const handleChange = (e) => {
            onChange(e.target.value)
        }

        return (
            <Text
                variant="body"
                weight="regular"
                className={[styles.root, !value && styles.empty]
                    .filter(Boolean)
                    .join(" ")}
            >
                <input
                    aria-label={label}
                    onChange={handleChange}
                    type="text"
                    className={`${styles.input} ${
                        onClear ? styles.inputWithClearButton : ""
                    }`}
                    placeholder={label}
                    value={value}
                    readOnly={!onChange}
                    ref={ref}
                    {...rest}
                />
                {onClear && (
                    <button
                        type="button"
                        className={[styles.icon, styles.clearButtonIcon]
                            .filter(Boolean)
                            .join(" ")}
                        onClick={onClear}
                        aria-label={`Clear ${label}`}
                    >
                        <ClearIcon />
                    </button>
                )}
            </Text>
        )
    }
)

EditableCell.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
}

export default EditableCell
