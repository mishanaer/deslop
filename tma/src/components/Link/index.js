import { forwardRef } from "react"
import PropTypes from "prop-types"
import { Link } from "wouter"

const TransitionLink = forwardRef(
    ({ to, onClick, children, ...props }, ref) => {
        const handleClick = (event) => {
            if (onClick) {
                onClick(event)
            }

            if (event.defaultPrevented) {
                return
            }
        }

        return (
            <Link ref={ref} href={to} onClick={handleClick} {...props}>
                {children}
            </Link>
        )
    }
)

TransitionLink.displayName = "TransitionLink"

TransitionLink.propTypes = {
    to: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    children: PropTypes.node,
}

export default TransitionLink
