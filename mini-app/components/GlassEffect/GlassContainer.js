import PropTypes from "prop-types"
import * as styles from "./GlassContainer.module.css"
import GlassBorder from "./GlassBorder"

/**
 * Frosted-glass surface (background + shadow + a single GlassBorder). With
 * children it wraps them; with none it renders overlay layers meant to fill a
 * positioned parent. Do NOT wrap a scaling element — put backdrop-filter on the
 * scaled node itself (Safari drops the filter mid-animation).
 * @example
 * <GlassContainer className={styles.bar}>{children}</GlassContainer>
 */
const GlassContainer = ({ children, className = "", style = {}, ...rest }) => {
    // If no children, render as overlay only
    if (!children) {
        return (
            <>
                <div className={styles.glassBackground} aria-hidden="true" />
                <div className={styles.glassShadow} aria-hidden="true" />
                <GlassBorder />
            </>
        )
    }

    // With children, render as wrapper
    return (
        <div className={`${styles.root} ${className}`} style={style} {...rest}>
            <div className={styles.glassBackground} aria-hidden="true" />
            <div className={styles.glassShadow} aria-hidden="true" />
            <GlassBorder />
            {children}
        </div>
    )
}

GlassContainer.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
}

export default GlassContainer
