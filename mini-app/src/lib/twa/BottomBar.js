import { useEffect } from "react"
import PropTypes from "prop-types"
import WebApp from "./webApp"
import { getMiniAppColor } from "../../theme/colors"

const BottomBar = ({ color }) => {
    useEffect(() => {
        WebApp.setBottomBarColor(color)
        return () => {
            WebApp.setBottomBarColor(getMiniAppColor("elevation"))
        }
    }, [color])

    return null
}

BottomBar.propTypes = {
    color: PropTypes.string.isRequired,
}

export default BottomBar
