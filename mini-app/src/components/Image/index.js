import { useState } from "react"
import PropTypes from "prop-types"

import { cn } from "@utils/cn"

const isInCache = ({ src, srcSet }) => {
    if (!src && !srcSet) return false

    const img = new window.Image()
    if (src) img.src = src
    if (srcSet) img.srcset = srcSet

    const { complete } = img

    // immediately set src/srcset to empty strings to avoid actually loading the image
    img.src = ""
    img.srcset = ""

    return complete
}

export const Image = ({ className, onLoad, ...restProps }) => {
    const [isLoaded, setIsLoaded] = useState(() => isInCache(restProps))

    return (
        <img
            onLoad={(event) => {
                setIsLoaded(true)
                onLoad?.(event)
            }}
            className={cn(
                "rounded-[inherit] opacity-0 transition-opacity duration-250 ease-[cubic-bezier(0.23,1,0.32,1)]",
                isLoaded && "opacity-100",
                className
            )}
            {...restProps}
        />
    )
}

Image.propTypes = {
    className: PropTypes.string,
    onLoad: PropTypes.func,
}

export default Image
