import { forwardRef, useEffect, useRef } from "react"
import PropTypes from "prop-types"

import * as styles from "./TextArea.module.scss"

export const TextArea = forwardRef((props, ref) => {
    const { value, className, ...rest } = props || {}
    const localRef = useRef(null)

    useEffect(() => {
        if (localRef.current) {
            localRef.current.style.height = "0px" // reset to recalc
            const scrollHeight = localRef.current.scrollHeight
            localRef.current.style.height = scrollHeight + "px"
        }
    }, [value])

    const handleRef = (el) => {
        localRef.current = el
        if (!ref) return
        if (typeof ref === "function") ref(el)
        else
            try {
                ref.current = el
            } catch {
                /* ignore */
            }
    }

    const combinedClassName = className
        ? styles.textarea + " " + className
        : styles.textarea

    return (
        <textarea
            {...rest}
            className={combinedClassName}
            ref={handleRef}
            value={value}
            rows={1}
        />
    )
})

TextArea.propTypes = {
    value: PropTypes.string,
    className: PropTypes.string,
}

export default TextArea
