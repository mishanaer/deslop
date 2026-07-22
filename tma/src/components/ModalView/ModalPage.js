import { Children, isValidElement } from "react"
import PropTypes from "prop-types"

// Declarative page marker: ModalView pulls the children out via parsePages and
// renders them itself, so this component body only runs if a Page is mounted
// outside a ModalView by mistake.
const ModalPage = ({ children }) => children

ModalPage.isModalPage = true

ModalPage.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.node,
}

// Returns [{ id, element }] when every child is a ModalView.Page (tray mode),
// or null for plain single-panel content. Mixing pages with loose children is
// a usage error and falls back to plain mode.
export function parsePages(children) {
    const items = Children.toArray(children)
    const pages = items.filter(
        (child) => isValidElement(child) && child.type?.isModalPage
    )
    if (!pages.length) return null
    if (pages.length !== items.length) {
        console.warn(
            "ModalView: mix of ModalView.Page and other children; falling back to plain mode"
        )
        return null
    }
    return pages.map((child) => ({
        id: child.props.id,
        element: child.props.children,
    }))
}

export default ModalPage
