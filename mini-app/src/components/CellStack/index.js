import { useRef, useState, Children } from "react"
import PropTypes from "prop-types"
import * as m from "motion/react-m"
import { useSmoothCorners } from "@lisse/react"
import { componentRadiusPixels, radiusPixels } from "@deslop/primitives/layout"

import { useSkin } from "../../hooks/DeviceProvider"
import { SPRING } from "../../utils/animations"

import CellStackContext from "./context"
import Morph from "./Morph"
import * as styles from "./CellStack.module.css"

// Section-grade corners (see SectionList): squircled from JS, border-radius
// in CSS as the fallback.
const APPLE_RADIUS = componentRadiusPixels.section
const MATERIAL_RADIUS = radiusPixels["16"]
const SMOOTHING = 0.6 // Figma iOS squircle smoothing

const FILL_TRANSITION = { ease: "linear", duration: 0.15 }

// Collapsed-stack look per card depth behind the front card (front = 0): each
// card peeks out from under the previous one and fades with depth; cards past
// the second edge disappear. Collapsed geometry itself comes from the grid in
// CSS, so these are the only stack numbers.
const PEEK = 13
const SCALE_STEP = 0.09
const FADE_STEP = 0.1
const FILL_OPACITY = { 1: 0.28, 2: 0.68 }

const getStackVariant = ({ depth, expanded }) => {
    if (expanded || depth < 1) return { y: 0, scale: 1, opacity: 1 }
    return {
        y: depth * PEEK,
        scale: 1 - depth * SCALE_STEP,
        opacity: depth > 2 ? 0 : 1 - depth * FADE_STEP,
    }
}

const StackCard = ({ children, depth, expanded, spring, isApple, total }) => {
    const ref = useRef(null)
    useSmoothCorners(
        ref,
        {
            radius: isApple ? APPLE_RADIUS : MATERIAL_RADIUS,
            smoothing: SMOOTHING,
        },
        { autoEffects: false }
    )

    const behind = depth >= 1

    return (
        <m.div
            ref={ref}
            layout
            className={styles.card}
            style={{ zIndex: total - depth }}
            animate={getStackVariant({ depth, expanded })}
            transition={spring}
        >
            {behind ? (
                <>
                    <m.div
                        className={styles.fill}
                        animate={{
                            opacity: expanded ? 0 : (FILL_OPACITY[depth] ?? 0),
                        }}
                        transition={FILL_TRANSITION}
                    />
                    <m.div
                        className={styles.content}
                        animate={{ opacity: expanded ? 1 : 0 }}
                        transition={FILL_TRANSITION}
                    >
                        {children}
                    </m.div>
                </>
            ) : (
                children
            )}
        </m.div>
    )
}

StackCard.propTypes = {
    children: PropTypes.node.isRequired,
    depth: PropTypes.number.isRequired,
    expanded: PropTypes.bool.isRequired,
    spring: PropTypes.object.isRequired,
    isApple: PropTypes.bool.isRequired,
    total: PropTypes.number.isRequired,
}

/**
 * Clickable group of cells that drops into a list where a section would go.
 * Collapsed, every card after the first tucks behind it as a peeking stack;
 * tapping toggles between the stack and a plain column. The first child is the
 * front card — usually a `CellStack.Morph` so its content morphs too.
 * @param {boolean} [props.defaultExpanded=false] Start expanded.
 * @example
 * <CellStack>
 *   <CellStack.Morph>{frontCard}</CellStack.Morph>
 *   <Cell>{...}</Cell>
 * </CellStack>
 */
function CellStack({ children, defaultExpanded = false }) {
    const { isApple } = useSkin()
    const [expanded, setExpanded] = useState(defaultExpanded)
    const spring = isApple ? SPRING.APPLE : SPRING.MATERIAL
    const cards = Children.toArray(children)

    return (
        <CellStackContext.Provider value={expanded}>
            <div
                className={styles.root}
                data-expanded={expanded}
                onClick={() => setExpanded((value) => !value)}
            >
                {cards.map((card, depth) => (
                    <StackCard
                        key={card.key ?? depth}
                        depth={depth}
                        expanded={expanded}
                        spring={spring}
                        isApple={isApple}
                        total={cards.length}
                    >
                        {card}
                    </StackCard>
                ))}
            </div>
        </CellStackContext.Provider>
    )
}

CellStack.propTypes = {
    children: PropTypes.node.isRequired,
    defaultExpanded: PropTypes.bool,
}

CellStack.Morph = Morph

export default CellStack
