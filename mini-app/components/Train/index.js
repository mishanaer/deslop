import PropTypes from "prop-types"

import { cn } from "../../utils/cn"
import * as styles from "./Train.module.css"

const dividerClasses = {
    space: styles.space,
    dot: styles.dot,
}

function Train({ divider = "space", children, className, ...props }) {
    return (
        <div
            className={cn(
                styles.root,
                dividerClasses[divider],
                className
            )}
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
