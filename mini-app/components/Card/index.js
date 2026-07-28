import PropTypes from "prop-types"

import { cn } from "../../utils/cn"
import * as styles from "./Card.module.css"

function Card({ children, className, ...props }) {
    return (
        <div
            className={cn(styles.root, className)}
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
