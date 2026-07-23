import { forwardRef } from "react"
import PropTypes from "prop-types"

import { useSkin } from "../../hooks/DeviceProvider"
import {
    useSkeletonContext,
    useRedactionClassName,
    waveRef,
} from "../Skeleton"
import { Image } from "../Image"
import * as styles from "./ImageAvatar.module.css"

const ImageAvatar = forwardRef(
    ({ size = 40, className, style, src, shape = "circle" }, ref) => {
        const { isMaterial } = useSkin()
        const redacted = Boolean(useSkeletonContext())
        const redactionClassName = useRedactionClassName(redacted)
        if (isMaterial) size = 42

        return (
            <div
                ref={(node) => {
                    if (redacted) waveRef(node)
                    if (typeof ref === "function") {
                        ref(node)
                    } else if (ref) {
                        ref.current = node
                    }
                }}
                className={`
                    ${shape === "circle" ? styles.shapeCircle : ""}
                    ${shape === "rounded" ? styles.shapeRounded : ""}
                    ${redactionClassName}
                    ${className || ""}`}
                style={{
                    width: size,
                    height: size,
                    ...style,
                }}
            >
                <Image
                    src={src}
                    className={`${styles.img} ${redacted ? styles.imgRedacted : ""}`}
                />
            </div>
        )
    }
)

ImageAvatar.propTypes = {
    size: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
    src: PropTypes.string,
    shape: PropTypes.oneOf(["circle", "rounded"]),
}
export default ImageAvatar
