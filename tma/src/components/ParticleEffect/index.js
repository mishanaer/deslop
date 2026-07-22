import { useRef } from "react"
import PropTypes from "prop-types"

import { useParticles } from "./useParticles"

import * as styles from "./ParticleEffect.module.css"

/**
 * ParticleEffect - covers its children with an animated particle cloud, ported
 * from the WebGL2 transform-feedback system at github.com/dkaraush/particles.
 * Drop-in replacement for the previous `spoiled` <Spoiler />: same
 * hidden / onClick / className API.
 *
 * @param {React.ReactNode} children - Content to hide behind the particles
 * @param {boolean} hidden - When true, the content is covered by the cloud
 * @param {function} onClick - Click handler (typically toggles `hidden`)
 * @param {string} className - Extra classes for the wrapper
 * @param {string} color - Particle color (any CSS color). Defaults to the
 *   computed text color of the content, so the cloud reads as hidden text
 * @param {number} radius - Particle radius in CSS px (scaled by DPR)
 * @param {number} padding - CSS headroom around the content on every side.
 *   Particle motion scales with the canvas size, so more headroom lets the cloud
 *   billow softer (like the demo) instead of hugging the glyph silhouette. The
 *   canvas overflows the content box and paints over neighbours. Defaults to ~1x
 *   the content height
 * @param {number} maskDilation - Fattens the glyph mask (stroke width = this x
 *   font size) so strokes and gaps merge and the text reads less. 0 = exact
 *   glyph shape (legible), higher = more hidden. Defaults to 0.3
 */
export default function ParticleEffect({
    children,
    hidden = false,
    onClick,
    className,
    color,
    radius,
    padding,
    maskDilation,
    ...rest
}) {
    const wrapperRef = useRef(null)
    const contentRef = useRef(null)
    const canvasRef = useRef(null)

    const { supported, revealOriginRef } = useParticles({
        canvasRef,
        contentRef,
        hidden,
        color,
        radius,
        padding,
        maskDilation,
    })

    const handleClick = (event) => {
        const wrapper = wrapperRef.current
        if (wrapper) {
            const rect = wrapper.getBoundingClientRect()
            revealOriginRef.current = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            }
        }
        onClick?.(event)
    }

    const rootClassName = [
        styles.root,
        hidden && styles.hidden,
        !supported && styles.fallback,
        className,
    ]
        .filter(Boolean)
        .join(" ")

    return (
        <span
            ref={wrapperRef}
            className={rootClassName}
            onClick={handleClick}
            {...rest}
        >
            <span ref={contentRef} className={styles.content} aria-hidden={hidden}>
                {children}
            </span>
            <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        </span>
    )
}

ParticleEffect.propTypes = {
    children: PropTypes.node,
    hidden: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
    color: PropTypes.string,
    radius: PropTypes.number,
    padding: PropTypes.number,
    maskDilation: PropTypes.number,
}
