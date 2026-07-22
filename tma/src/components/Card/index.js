import PropTypes from "prop-types"

import { cn } from "@utils/cn"

function Card({ children, className, ...props }) {
    return (
        <div
            className={cn(
                "[&:last-child]:[--cell-separator-height:0px]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

Card.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
}
export default Card
