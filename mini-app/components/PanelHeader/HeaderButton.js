import PropTypes from "prop-types"
import * as m from "motion/react-m"

import { GlassBorder } from "../GlassEffect"
import Text from "../Text"

import * as styles from "./HeaderButton.module.css"

export const HEADER_BUTTON_VARIANTS = [
    "regular",
    "secondary",
    "accent",
    "overlay",
]

// A glass action in the panel header: a text label (auto-sized pill) or an
// icon (44x44 square). Glass lives on the element itself so the tap scale
// can't make Safari drop the backdrop-filter mid-animation; the rim lives
// inside it, so it must stay blend-free (GlassBorder's muted variant).
const HeaderButton = ({
    children,
    onClick,
    variant = "regular",
    ariaLabel,
    title,
}) => {
    const isText = typeof children === "string"
    const hasRim = variant === "regular" || variant === "overlay"

    return (
        <m.button
            type="button"
            className={`${styles.button} ${styles[variant]} ${
                isText ? styles.label : styles.icon
            }`}
            onClick={onClick}
            aria-label={ariaLabel}
            title={title}
            whileTap={{ scale: 1.1 }}
            transition={{
                scale: { type: "spring", stiffness: 800, damping: 40 },
            }}
        >
            {hasRim && <GlassBorder muted />}
            <span className={styles.content}>
                {isText ? (
                    <Text variant="body" weight="medium">
                        {children}
                    </Text>
                ) : (
                    children
                )}
            </span>
        </m.button>
    )
}

HeaderButton.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(HEADER_BUTTON_VARIANTS),
    ariaLabel: PropTypes.string,
    title: PropTypes.string,
}

export default HeaderButton
