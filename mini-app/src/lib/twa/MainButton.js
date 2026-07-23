import PropTypes from "prop-types"
import useBottomButton from "./useBottomButton"

const MainButton = (props) => {
    useBottomButton({ type: "main", ...props })
    return null
}

MainButton.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    progress: PropTypes.bool,
    color: PropTypes.string,
    textColor: PropTypes.string,
    hasShineEffect: PropTypes.bool,
    iconCustomEmojiId: PropTypes.string,
}

export default MainButton
