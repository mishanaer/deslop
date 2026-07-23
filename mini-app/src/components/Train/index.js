import PropTypes from "prop-types"

import { cn } from "@utils/cn"

const dividerClasses = {
    space: "gap-8",
    dot: "gap-0 [&>*:not(:first-child)::before]:mx-[3px] [&>*:not(:first-child)::before]:inline-block [&>*:not(:first-child)::before]:content-['·']",
}

function Train({ divider = "space", children, className, ...props }) {
    return (
        <div
            className={cn(
                "flex items-center",
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
