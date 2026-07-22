import { forwardRef } from "react"
import PropTypes from "prop-types"

import Text from "../../Text"
import TextArea from "../TextArea"
import ClearIcon from "@deslop/primitives/icons/circle-close.svg?react"
import SearchIcon from "@deslop/primitives/icons/search.svg?react"
import * as styles from "./AppleTextField.module.scss"

const BackgroundColor = {
    tertiaryFill: "var(--tertiary-fill-background)",
    section: "var(--tg-theme-section-bg-color)",
}

export const AppleTextField = forwardRef(
    (
        {
            type = "text",
            className,
            label,
            onClear,
            onChange = () => {},
            value,
            backgroundColor = "tertiaryFill",
            ...rest
        },
        ref
    ) => {
        const handleChange = (e) => {
            onChange(e.target.value)
        }

        return (
            <Text
                variant="body"
                weight="regular"
                className={[
                    styles.root,
                    className,
                    (type === "text" || type === "password") && styles.text,
                    type === "search" && styles.search,
                    !value && styles.empty,
                ]
                    .filter(Boolean)
                    .join(" ")}
                style={{ "--input-bg-color": BackgroundColor[backgroundColor] }}
            >
                {rest.multiline ? (
                    <TextArea
                        {...rest}
                        aria-label={label}
                        onChange={handleChange}
                        className={styles.input}
                        value={value}
                        placeholder={label}
                        ref={ref}
                    />
                ) : (
                    <input
                        {...rest}
                        aria-label={label}
                        onChange={handleChange}
                        type={
                            type === "password"
                                ? "password"
                                : type === "search"
                                  ? "search"
                                  : "text"
                        }
                        className={styles.input}
                        placeholder={label}
                        value={value}
                        ref={ref}
                    />
                )}
                {type === "search" && (
                    <SearchIcon
                        className={[styles.icon, styles.searchIcon]
                            .filter(Boolean)
                            .join(" ")}
                    />
                )}

                {onClear && (
                    <button
                        type="button"
                        className={[styles.icon, styles.clearButtonIcon]
                            .filter(Boolean)
                            .join(" ")}
                        onClick={onClear}
                    >
                        <ClearIcon />
                    </button>
                )}
            </Text>
        )
    }
)

AppleTextField.propTypes = {
    type: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,
    onClear: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.string,
    backgroundColor: PropTypes.string,
}

export default AppleTextField
