import PropTypes from "prop-types"

import SpinnerIcon from "@deslop/primitives/icons/loader.svg?react"

import * as styles from "./Spinner.module.css"

const Spinner = ({ centered, className, size, ...rest }) => {
    const combinedClassName = [styles.spinner, className]
        .filter(Boolean)
        .join(" ")

    const sizeStyle = size ? { width: size, height: size } : undefined

    const icon = (
        <SpinnerIcon {...rest} className={combinedClassName} style={sizeStyle} />
    )

    if (centered) {
        return <div className={styles.centered}>{icon}</div>
    }

    return icon
}

Spinner.propTypes = {
    centered: PropTypes.bool,
    className: PropTypes.string,
    size: PropTypes.number,
}
export default Spinner
