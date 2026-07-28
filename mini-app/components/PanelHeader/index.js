import { useContext } from "react"
import PropTypes from "prop-types"

import { GlassContainer } from "../GlassEffect"
import Text from "../Text"
import { useSkin } from "../../hooks/DeviceProvider"

import HeaderButton, { HEADER_BUTTON_VARIANTS } from "./HeaderButton"
import { ModalChromeContext } from "./context"
import * as styles from "./PanelHeader.module.css"

// The modal "шапка": a glass navigation bar with left/right actions and a
// centered title. 64px tall standalone, 70px inside a ModalView (via
// ModalChromeContext). Material stays a flat app bar; glass and side actions
// are iOS-only. data-modal-drag makes the whole bar a swipe-to-dismiss handle.
const PanelHeader = ({
    left,
    onLeft,
    leftVariant,
    leftAriaLabel,
    leftTitle,
    right,
    onRight,
    rightVariant,
    rightAriaLabel,
    rightTitle,
    overlay = false,
    titleGlass = false,
    children,
}) => {
    const { isApple } = useSkin()
    const inModal = useContext(ModalChromeContext)

    // Over-content state: buttons default to the overlay glass and the title
    // goes white. Per-button variants still override.
    const baseVariant = overlay ? "overlay" : "regular"

    const title = (
        <Text variant="body" weight="semibold">
            {children}
        </Text>
    )

    return (
        <div
            className={`${styles.root} ${inModal ? styles.inModal : ""}`}
            data-modal-drag=""
        >
            <div className={styles.side}>
                {left != null && (
                    <HeaderButton
                        onClick={onLeft}
                        variant={leftVariant ?? baseVariant}
                        ariaLabel={leftAriaLabel}
                        title={leftTitle}
                    >
                        {left}
                    </HeaderButton>
                )}
            </div>
            <div className={`${styles.side} ${styles.trailing}`}>
                {right != null && (
                    <HeaderButton
                        onClick={onRight}
                        variant={rightVariant ?? baseVariant}
                        ariaLabel={rightAriaLabel}
                        title={rightTitle}
                    >
                        {right}
                    </HeaderButton>
                )}
            </div>
            <div
                className={`${styles.middle} ${
                    overlay ? styles.middleOverlay : ""
                }`}
            >
                {isApple && titleGlass ? (
                    <div className={styles.titlePill}>
                        <GlassContainer />
                        <span className={styles.titleContent}>{title}</span>
                    </div>
                ) : (
                    title
                )}
            </div>
        </div>
    )
}

PanelHeader.propTypes = {
    left: PropTypes.node,
    onLeft: PropTypes.func,
    leftVariant: PropTypes.oneOf(HEADER_BUTTON_VARIANTS),
    leftAriaLabel: PropTypes.string,
    leftTitle: PropTypes.string,
    right: PropTypes.node,
    onRight: PropTypes.func,
    rightVariant: PropTypes.oneOf(HEADER_BUTTON_VARIANTS),
    rightAriaLabel: PropTypes.string,
    rightTitle: PropTypes.string,
    overlay: PropTypes.bool,
    titleGlass: PropTypes.bool,
    children: PropTypes.node,
}

export default PanelHeader
