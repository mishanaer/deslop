import { useRef } from "react"
import PropTypes from "prop-types"
import { useSmoothCorners } from "@lisse/react"
import { componentRadiusPixels, radiusPixels } from "@deslop/primitives/layout"
import * as styles from "./SectionList.module.css"
import SectionHeader from "../../components/SectionHeader"
import { useSkin } from "../../hooks/DeviceProvider"

// Radii mirror SectionList.module.css: Apple rounds the inner .container
// (26px, header sits above it); Material rounds the whole .card (16px).
const APPLE_RADIUS = componentRadiusPixels.section
const MATERIAL_RADIUS = radiusPixels["16"]
const SMOOTHING = 0.6 // Figma iOS squircle smoothing

/**
 * Grouped list container with squircled section corners. Wrap rows in
 * `SectionList.Item`, which adds an optional header and a footer description.
 * @example
 * <SectionList>
 *   <SectionList.Item header="General" description="Applies to all wallets">
 *     <Cell><Cell.Text title="Currency" /></Cell>
 *   </SectionList.Item>
 * </SectionList>
 */
const SectionList = ({ children, ...props }) => {
    return (
        <section className={styles.root} {...props}>
            {children}
        </section>
    )
}

const SectionListItem = ({ children, header, description, ...props }) => {
    const { isApple } = useSkin()
    const cardRef = useRef(null)
    const containerRef = useRef(null)

    // Squircle the element that carries the section background. The hook is
    // keyed on the ref, so a skin switch restores the old element's clip-path
    // and re-applies to the new target. clip-path only, no SVG effects.
    useSmoothCorners(
        isApple ? containerRef : cardRef,
        {
            radius: isApple ? APPLE_RADIUS : MATERIAL_RADIUS,
            smoothing: SMOOTHING,
        },
        { autoEffects: false }
    )

    return (
        <section {...props}>
            <div ref={cardRef} className={styles.card}>
                {header && <SectionHeader title={header} />}
                <div ref={containerRef} className={styles.container}>
                    {children}
                </div>
            </div>
            {description && <SectionHeader type="Footer" title={description} />}
        </section>
    )
}

SectionListItem.propTypes = {
    children: PropTypes.node,
    header: PropTypes.string,
    description: PropTypes.string,
}

SectionList.Item = SectionListItem

SectionList.propTypes = {
    children: PropTypes.node,
}
export default SectionList
