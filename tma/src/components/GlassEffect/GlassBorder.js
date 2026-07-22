import PropTypes from "prop-types"
import * as styles from "./GlassBorder.module.css"

/**
 * The single hairline rim a glass surface carries. Default is a bright
 * overlay-blend edge. Pass `muted` on a backdrop-filtered surface: the filter
 * isolates descendant blending, turning the overlay into a stark white ring on
 * dark themes, so `muted` swaps to a low-alpha normal blend that approximates
 * the same look.
 * @param {boolean} [props.muted] Blend-free rim for backdrop-filtered surfaces.
 * @example
 * <GlassBorder />              // default bright rim on a non-filtered surface
 * <GlassBorder muted />        // inside an element that owns a backdrop-filter
 */
const GlassBorder = ({ className = "", muted = false }) => {
    return (
        <div
            className={`${styles.glassBorder} ${
                muted ? styles.muted : ""
            } ${className}`}
            aria-hidden="true"
        />
    )
}

GlassBorder.propTypes = {
    className: PropTypes.string,
    muted: PropTypes.bool,
}

export default GlassBorder
