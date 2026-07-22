import { useEffect } from "react"
import PropTypes from "prop-types"
import WebApp from "./webApp"

const defaultColor = WebApp.themeParams.bottom_bar_bg_color

const BottomBar = ({ color }) => {
    useEffect(() => {
        WebApp.setBottomBarColor(color)
        return () => {
            WebApp.setBottomBarColor(defaultColor)
        }
    }, [color])

    return null
}

BottomBar.propTypes = {
    color: PropTypes.string.isRequired,
}

export default BottomBar
