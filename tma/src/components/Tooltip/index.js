import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import { createPortal } from "react-dom"
import * as m from "motion/react-m"
import { AnimatePresence } from "motion/react"

import { POPOVER_VARIANTS } from "../../utils/animations"
import TooltipBody from "./TooltipBody"
import { useClickOutside, useTooltipPosition } from "./tooltipUtils"
import { useHoverToggle } from "./useHoverToggle"
import {
    TAIL_WIDTH_VERTICAL,
    TAIL_WIDTH_HORIZONTAL,
    TAIL_HEIGHT_REGULAR,
    TAIL_HEIGHT_COMPACT,
    buildClipPath,
} from "./tooltipPath"

import * as styles from "./Tooltip.module.scss"

/**
 * Hover/tap tooltip rendered in a portal with edge-aware placement and a
 * pointing tail. `children` is the trigger; opens on hover or tap, closes on
 * outside click / Esc.
 * @param {import("react").ReactNode} props.content Tooltip body (required).
 * @param {string} [props.badge]
 * @param {"regular"|"compact"} [props.type="regular"]
 * @param {"auto"|"top"|"bottom"|"left"|"right"} [props.placement="auto"]
 * @example
 * <Tooltip content="Copied to clipboard" placement="top">
 *   <InfoIcon />
 * </Tooltip>
 */
const Tooltip = ({
    content,
    badge,
    type = "regular",
    placement = "auto",
    children,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const triggerRef = useRef(null)
    const tooltipRef = useRef(null)
    const animatedTooltipRef = useRef(null)

    const compact = type === "compact"
    const tailHeight = compact ? TAIL_HEIGHT_COMPACT : TAIL_HEIGHT_REGULAR

    const { position, isPositioned, resetPosition } = useTooltipPosition(
        isOpen,
        triggerRef,
        tooltipRef,
        TAIL_WIDTH_VERTICAL,
        TAIL_WIDTH_HORIZONTAL,
        tailHeight,
        placement
    )

    const openTooltip = () => {
        setIsOpen(true)
        resetPosition()
    }

    const closeTooltip = () => {
        setIsOpen(false)
        resetPosition()
    }

    const { onPointerEnter, onPointerLeave, clearOpenTimer, clearCloseTimer } =
        useHoverToggle({ onOpen: openTooltip, onClose: closeTooltip })

    const toggleTooltip = () => {
        clearOpenTimer()
        clearCloseTimer()
        setIsOpen((prev) => !prev)
        resetPosition()
    }

    useClickOutside(
        isOpen,
        closeTooltip,
        triggerRef,
        tooltipRef,
        animatedTooltipRef
    )

    useEffect(() => {
        if (!isOpen) return
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                e.preventDefault()
                closeTooltip()
                triggerRef.current?.focus()
            }
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, closeTooltip])

    const handleTriggerKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            toggleTooltip()
        }
    }

    const isHorizontal =
        position.placement === "left" || position.placement === "right"
    const tailBreadth = isHorizontal
        ? TAIL_WIDTH_HORIZONTAL
        : TAIL_WIDTH_VERTICAL

    const shellStyle = isPositioned
        ? {
              position: "fixed",
              top: position.top,
              left: position.left,
              transformOrigin: `${position.originX} ${position.originY}`,
              zIndex: 1000,
              paddingTop:
                  position.placement === "bottom" ? position.tailProtrusion : 0,
              paddingBottom:
                  position.placement === "top" ? position.tailProtrusion : 0,
              paddingLeft:
                  position.placement === "right" ? position.tailProtrusion : 0,
              paddingRight:
                  position.placement === "left" ? position.tailProtrusion : 0,
              clipPath: buildClipPath({
                  width: position.width,
                  height: position.height,
                  tailOffsetX: position.tailOffsetX,
                  tailOffsetY: position.tailOffsetY,
                  tailBreadth,
                  tailProtrusion: position.tailProtrusion,
                  placement: position.placement,
                  shape: position.shape,
              }),
          }
        : null

    return (
        <span className={styles.container}>
            <span
                className={styles.trigger}
                onClick={toggleTooltip}
                onKeyDown={handleTriggerKeyDown}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
                ref={triggerRef}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
            >
                {children}
            </span>
            {createPortal(
                <>
                    {isOpen && !isPositioned && (
                        <div
                            ref={tooltipRef}
                            className={styles.shell}
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                visibility: "hidden",
                                zIndex: 1000,
                            }}
                        >
                            <TooltipBody
                                content={content}
                                badge={badge}
                                compact={compact}
                            />
                        </div>
                    )}
                    <AnimatePresence>
                        {isOpen && isPositioned && (
                            <m.div
                                ref={animatedTooltipRef}
                                role="tooltip"
                                className={styles.shell}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={POPOVER_VARIANTS}
                                onPointerEnter={onPointerEnter}
                                onPointerLeave={onPointerLeave}
                                style={shellStyle}
                            >
                                <TooltipBody
                                    content={content}
                                    badge={badge}
                                    compact={compact}
                                />
                            </m.div>
                        )}
                    </AnimatePresence>
                </>,
                document.body
            )}
        </span>
    )
}

Tooltip.propTypes = {
    content: PropTypes.node.isRequired,
    badge: PropTypes.string,
    type: PropTypes.oneOf(["regular", "compact"]),
    placement: PropTypes.oneOf(["auto", "top", "bottom", "left", "right"]),
    children: PropTypes.node.isRequired,
}

export default Tooltip
