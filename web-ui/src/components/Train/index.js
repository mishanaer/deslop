import PropTypes from "prop-types"
import * as styles from "./Train.module.scss"

function Train({ divider = "space", children, className, ...props }) {
    return (
        <div
            className={`${styles.root} ${styles[divider]} ${className || ""}`}
            {...props}
        >
            {children}
        </div>
    )
}

Train.propTypes = {
    divider: PropTypes.oneOf(["space", "dot"]),
    children: PropTypes.node,
    className: PropTypes.string,
}

export default Train
