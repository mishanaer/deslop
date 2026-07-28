import { useEffect } from "react"
import PropTypes from "prop-types"
import { useHashLocation } from "wouter/use-hash-location"
import WebApp from "./webApp"

const BackButton = ({ onClick }) => {
    const [, navigate] = useHashLocation()

    useEffect(() => {
        const handler = onClick ?? (() => navigate("/"))
        WebApp.BackButton.onClick(handler)
        WebApp.BackButton.show()
        return () => {
            WebApp.BackButton.offClick(handler)
            WebApp.BackButton.hide()
        }
    }, [onClick, navigate])

    return null
}

BackButton.propTypes = {
    onClick: PropTypes.func,
}

export default BackButton
