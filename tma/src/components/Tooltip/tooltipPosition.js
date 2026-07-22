import { clamp } from "../../utils/number"

export const GAP = 8
export const VIEWPORT_PADDING = 8

export const samePosition = (a, b) =>
    a.top === b.top &&
    a.left === b.left &&
    a.width === b.width &&
    a.height === b.height &&
    a.placement === b.placement &&
    a.shape === b.shape &&
    a.tailOffsetX === b.tailOffsetX &&
    a.tailOffsetY === b.tailOffsetY &&
    a.tailProtrusion === b.tailProtrusion &&
    a.originX === b.originX &&
    a.originY === b.originY

const pickBest = (keys, spaces) =>
    keys.reduce(
        (best, k) => (best === null || spaces[k] > spaces[best] ? k : best),
        null
    )

const choosePlacement = (spaces, fits, preferred) => {
    if (["top", "bottom", "left", "right"].includes(preferred)) {
        return preferred
    }

    const hAsym = fits.left !== fits.right
    const maxV = Math.max(spaces.top, spaces.bottom)
    const minV = Math.min(spaces.top, spaces.bottom)
    // Trigger sits between the vertical edges, not pinned near one.
    const vBalanced = maxV > 0 && (maxV - minV) / maxV < 0.4

    // Flip sideways only for genuinely edge-anchored triggers.
    if (hAsym && vBalanced) return fits.left ? "left" : "right"

    if (fits.bottom && fits.top) {
        return spaces.bottom >= spaces.top ? "bottom" : "top"
    }
    if (fits.bottom) return "bottom"
    if (fits.top) return "top"

    if (fits.right && fits.left) {
        return spaces.right >= spaces.left ? "right" : "left"
    }
    if (fits.right) return "right"
    if (fits.left) return "left"

    return pickBest(["bottom", "top", "right", "left"], spaces)
}

export const calculatePosition = (
    triggerRect,
    bodySize,
    tailVBreadth,
    tailHBreadth,
    tailProtrusion,
    preferredPlacement
) => {
    const { innerHeight, innerWidth } = window
    const spaces = {
        top: triggerRect.top,
        bottom: innerHeight - triggerRect.bottom,
        left: triggerRect.left,
        right: innerWidth - triggerRect.right,
    }
    const neededV = bodySize.height + tailProtrusion + GAP + VIEWPORT_PADDING
    const neededH = bodySize.width + tailProtrusion + GAP + VIEWPORT_PADDING
    const fits = {
        top: spaces.top >= neededV,
        bottom: spaces.bottom >= neededV,
        left: spaces.left >= neededH,
        right: spaces.right >= neededH,
    }

    const placement = choosePlacement(spaces, fits, preferredPlacement)
    const isHorizontal = placement === "left" || placement === "right"
    const tailBreadth = isHorizontal ? tailHBreadth : tailVBreadth
    const halfTailProtrusion = Math.round(tailProtrusion * 0.8)

    if (isHorizontal) {
        const shellHeight = bodySize.height
        const triggerCenterY = triggerRect.top + triggerRect.height / 2
        const topMax = Math.max(
            VIEWPORT_PADDING,
            innerHeight - shellHeight - VIEWPORT_PADDING
        )

        let top = clamp(
            triggerCenterY - shellHeight / 2,
            VIEWPORT_PADDING,
            topMax
        )
        let apexY = triggerCenterY - top
        let shape = "full"
        if (apexY < tailBreadth / 2) {
            shape = "half-start"
            top = clamp(triggerCenterY, VIEWPORT_PADDING, topMax)
            apexY = 0
        } else if (apexY > shellHeight - tailBreadth / 2) {
            shape = "half-end"
            top = clamp(triggerCenterY - shellHeight, VIEWPORT_PADDING, topMax)
            apexY = shellHeight
        }
        const effectiveTp =
            shape === "full" ? tailProtrusion : halfTailProtrusion
        const shellWidth = bodySize.width + effectiveTp
        const left =
            placement === "left"
                ? triggerRect.left - GAP - shellWidth
                : triggerRect.right + GAP
        const tailOffsetY = shape === "full" ? apexY - tailBreadth / 2 : 0

        return {
            top: Math.round(top),
            left: Math.round(left),
            width: Math.round(shellWidth),
            height: Math.round(shellHeight),
            placement,
            shape,
            tailOffsetX: 0,
            tailOffsetY: Math.round(tailOffsetY),
            tailProtrusion: effectiveTp,
            originX: placement === "left" ? "100%" : "0%",
            originY: `${clamp((apexY / shellHeight) * 100, 0, 100)}%`,
        }
    }

    const shellWidth = bodySize.width
    const triggerCenterX = triggerRect.left + triggerRect.width / 2
    const leftMax = Math.max(
        VIEWPORT_PADDING,
        innerWidth - shellWidth - VIEWPORT_PADDING
    )

    let left = clamp(triggerCenterX - shellWidth / 2, VIEWPORT_PADDING, leftMax)
    let apexX = triggerCenterX - left
    let shape = "full"
    if (apexX < tailBreadth / 2) {
        shape = "half-start"
        left = clamp(triggerCenterX, VIEWPORT_PADDING, leftMax)
        apexX = 0
    } else if (apexX > shellWidth - tailBreadth / 2) {
        shape = "half-end"
        left = clamp(triggerCenterX - shellWidth, VIEWPORT_PADDING, leftMax)
        apexX = shellWidth
    }
    const effectiveTp = shape === "full" ? tailProtrusion : halfTailProtrusion
    const shellHeight = bodySize.height + effectiveTp
    const top =
        placement === "top"
            ? triggerRect.top - GAP - shellHeight
            : triggerRect.bottom + GAP
    const tailOffsetX = shape === "full" ? apexX - tailBreadth / 2 : 0

    return {
        top: Math.round(top),
        left: Math.round(left),
        width: Math.round(shellWidth),
        height: Math.round(shellHeight),
        placement,
        shape,
        tailOffsetX: Math.round(tailOffsetX),
        tailOffsetY: 0,
        tailProtrusion: effectiveTp,
        originX: `${clamp((apexX / shellWidth) * 100, 0, 100)}%`,
        originY: placement === "top" ? "100%" : "0%",
    }
}
