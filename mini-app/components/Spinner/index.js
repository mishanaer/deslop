import PropTypes from "prop-types"

import { IconLoader as SpinnerIcon } from "../../../primitives/material-symbols-react"

import * as styles from "./Spinner.module.css"

const Spinner = ({ centered, className, size, ...rest }) => {
    const combinedClassName = [styles.spinner, className]
        .filter(Boolean)
        .join(" ")

    const icon = (
        <SpinnerIcon {...rest} className={combinedClassName} size={size ?? 24} />
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
