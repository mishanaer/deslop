import PropTypes from "prop-types"
import Text from "../index"
import * as styles from "./Badge.module.css"

const Badge = ({
    variant = "filled",
    textVariant = "body",
    circled = false,
    squared = false,
    style,
    className,
    children,
    ...textProps
}) => {
    const dynamicProps = {
        ...(circled && { "data-circled": true }),
        ...(squared && { "data-squared": true }),
    }

    const backgroundColor = style?.background || style?.backgroundColor || null

    let badgeStyle = style

    if (variant === "filled") {
        badgeStyle = {
            ...style,
            "--badge-background":
                backgroundColor || "var(--tg-theme-button-color)",
            ...(style?.color && { "--badge-text-color": style.color }),
        }
    } else if (variant === "tinted") {
        const tintedBackground =
            style.color || backgroundColor || "var(--tg-theme-button-color)"

        badgeStyle = {
            ...style,
            "--badge-background": tintedBackground,
            ...(style?.color && { "--badge-text-color": style.color }),
        }
    }

    return (
        <Text
            variant={textVariant}
            className={`${styles.badge} ${styles[variant]} ${className || ""}`}
            style={badgeStyle}
            {...dynamicProps}
            {...textProps}
        >
            {children}
        </Text>
    )
}

Badge.propTypes = {
    variant: PropTypes.oneOf(["filled", "tinted", "gray", "media", "outlined"]),
    textVariant: PropTypes.string,
    circled: PropTypes.bool,
    squared: PropTypes.bool,
    children: PropTypes.node,
    style: PropTypes.object,
    className: PropTypes.string,
}

export default Badge
