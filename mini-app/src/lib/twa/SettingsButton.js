import { useEffect } from "react"
import PropTypes from "prop-types"
import WebApp from "./webApp"

const settingsButton = WebApp.SettingsButton

let isButtonShown = false

const SettingsButton = ({ onClick }) => {
    useEffect(() => {
        settingsButton.show()
        isButtonShown = true
        return () => {
            isButtonShown = false
            setTimeout(() => {
                if (!isButtonShown) {
                    settingsButton.hide()
                }
            }, 10)
        }
    }, [])

    useEffect(() => {
        if (onClick) {
            settingsButton.onClick(onClick)
            return () => {
                settingsButton.offClick(onClick)
            }
        }
    }, [onClick])

    return null
}

SettingsButton.propTypes = {
    onClick: PropTypes.func,
}

export default SettingsButton
