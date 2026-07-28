import { useContext, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import PropTypes from "prop-types"
import PortalRootContext from "./context"

/**
 * SSR- and hydration-safe portal. Server render and the first client render
 * both return null; portal content is mounted only after the client effect.
 */
const Portal = ({ children, container }) => {
    const [isMounted, setIsMounted] = useState(false)
    const portalRoot = useContext(PortalRootContext)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted || typeof document === "undefined") return null

    const target =
        typeof container === "function"
            ? container()
            : (container ?? portalRoot?.current ?? document.body)

    return target ? createPortal(children, target) : null
}

Portal.propTypes = {
    children: PropTypes.node,
    container: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
}

export default Portal
