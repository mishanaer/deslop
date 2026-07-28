import { useState } from "react"
import PropTypes from "prop-types"

import { cn } from "../../utils/cn"
import * as styles from "./Image.module.css"

const isInCache = ({ src, srcSet }) => {
    if (!src && !srcSet) return false

    if (typeof window === "undefined") return false

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
            className={cn(styles.root, isLoaded && styles.loaded, className)}
            {...restProps}
        />
    )
}

Image.propTypes = {
    className: PropTypes.string,
    onLoad: PropTypes.func,
}

export default Image
