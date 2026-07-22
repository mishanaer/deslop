import PropTypes from "prop-types"
import useBottomButton from "./useBottomButton"

const SecondaryButton = (props) => {
    useBottomButton({ type: "secondary", ...props })
    return null
}

SecondaryButton.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    progress: PropTypes.bool,
    color: PropTypes.string,
    textColor: PropTypes.string,
    hasShineEffect: PropTypes.bool,
    position: PropTypes.oneOf(["left", "right", "top", "bottom"]),
    iconCustomEmojiId: PropTypes.string,
}

export default SecondaryButton
