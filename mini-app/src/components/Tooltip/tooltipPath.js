import { componentRadiusPixels } from "@deslop/primitives/layout"

export const TAIL_WIDTH_VERTICAL = 32
export const TAIL_WIDTH_HORIZONTAL = 24
export const TAIL_HEIGHT_REGULAR = 9
export const TAIL_HEIGHT_COMPACT = 7
const BORDER_RADIUS = componentRadiusPixels["tooltip-surface"]

const computeCorners = (shape, placement, w, h, ox, oy, b) => {
    const R = BORDER_RADIUS
    const r = [R, R, R, R] // [TL, TR, BL, BR]
    if (shape !== "full") {
        const idx = {
            "bottom:half-start": 0,
            "bottom:half-end": 1,
            "top:half-start": 2,
            "top:half-end": 3,
            "right:half-start": 0,
            "right:half-end": 2,
            "left:half-start": 1,
            "left:half-end": 3,
        }[`${placement}:${shape}`]
        r[idx] = 0
        return r
    }
    if (placement === "bottom") {
        r[0] = Math.min(R, ox)
        r[1] = Math.min(R, w - (ox + b))
    } else if (placement === "top") {
        r[2] = Math.min(R, ox)
        r[3] = Math.min(R, w - (ox + b))
    } else if (placement === "right") {
        r[0] = Math.min(R, oy)
        r[2] = Math.min(R, h - (oy + b))
    } else {
        r[1] = Math.min(R, oy)
        r[3] = Math.min(R, h - (oy + b))
    }
    return r
}

export const buildClipPath = ({
    width: w,
    height: h,
    tailOffsetX,
    tailOffsetY,
    tailBreadth: b,
    tailProtrusion: tp,
    placement,
    shape,
}) => {
    const [rTL, rTR, rBL, rBR] = computeCorners(
        shape,
        placement,
        w,
        h,
        tailOffsetX,
        tailOffsetY,
        b
    )
    const halfB = shape === "full" ? b : Math.round(b * 0.85)
    const ar = Math.min(2, Math.max(1, Math.floor(halfB / 10)))
    const tailControls = (origin) => [
        origin,
        origin + b / 4,
        origin + (b * 3) / 8,
        origin + b / 2,
        origin + (b * 5) / 8,
        origin + (b * 3) / 4,
        origin + b,
    ]
    if (placement === "bottom") {
        const bt = tp
        if (shape === "full") {
            const [x0, x1, x2, x3, x4, x5, x6] = tailControls(tailOffsetX)
            return (
                `path("M ${rTL} ${bt} L ${x0} ${bt}` +
                ` C ${x1} ${bt} ${x2} 0 ${x3} 0` +
                ` C ${x4} 0 ${x5} ${bt} ${x6} ${bt}` +
                ` L ${w - rTR} ${bt}` +
                ` Q ${w} ${bt} ${w} ${bt + rTR}` +
                ` L ${w} ${h - rBR}` +
                ` Q ${w} ${h} ${w - rBR} ${h}` +
                ` L ${rBL} ${h}` +
                ` Q 0 ${h} 0 ${h - rBL}` +
                ` L 0 ${bt + rTL}` +
                ` Q 0 ${bt} ${rTL} ${bt} Z")`
            )
        }
        if (shape === "half-end") {
            return (
                `path("M ${rTL} ${bt} L ${w - halfB / 2} ${bt}` +
                ` C ${w - halfB / 4} ${bt} ${w - halfB / 8 - ar} 0 ${w - ar} 0` +
                ` Q ${w} 0 ${w} ${ar}` +
                ` L ${w} ${h - rBR}` +
                ` Q ${w} ${h} ${w - rBR} ${h}` +
                ` L ${rBL} ${h}` +
                ` Q 0 ${h} 0 ${h - rBL}` +
                ` L 0 ${bt + rTL}` +
                ` Q 0 ${bt} ${rTL} ${bt} Z")`
            )
        }
        return (
            `path("M ${ar} 0` +
            ` C ${halfB / 8 + ar} 0 ${halfB / 4} ${bt} ${halfB / 2} ${bt}` +
            ` L ${w - rTR} ${bt}` +
            ` Q ${w} ${bt} ${w} ${bt + rTR}` +
            ` L ${w} ${h - rBR}` +
            ` Q ${w} ${h} ${w - rBR} ${h}` +
            ` L ${rBL} ${h}` +
            ` Q 0 ${h} 0 ${h - rBL}` +
            ` L 0 ${ar}` +
            ` Q 0 0 ${ar} 0 Z")`
        )
    }

    if (placement === "top") {
        const bb = h - tp
        if (shape === "full") {
            const [x0, x1, x2, x3, x4, x5, x6] = tailControls(tailOffsetX)
            return (
                `path("M ${rTL} 0 L ${w - rTR} 0` +
                ` Q ${w} 0 ${w} ${rTR}` +
                ` L ${w} ${bb - rBR}` +
                ` Q ${w} ${bb} ${w - rBR} ${bb}` +
                ` L ${x6} ${bb}` +
                ` C ${x5} ${bb} ${x4} ${h} ${x3} ${h}` +
                ` C ${x2} ${h} ${x1} ${bb} ${x0} ${bb}` +
                ` L ${rBL} ${bb}` +
                ` Q 0 ${bb} 0 ${bb - rBL}` +
                ` L 0 ${rTL}` +
                ` Q 0 0 ${rTL} 0 Z")`
            )
        }
        if (shape === "half-end") {
            return (
                `path("M ${rTL} 0 L ${w - rTR} 0` +
                ` Q ${w} 0 ${w} ${rTR}` +
                ` L ${w} ${h - ar}` +
                ` Q ${w} ${h} ${w - ar} ${h}` +
                ` C ${w - halfB / 8 - ar} ${h} ${w - halfB / 4} ${bb} ${w - halfB / 2} ${bb}` +
                ` L ${rBL} ${bb}` +
                ` Q 0 ${bb} 0 ${bb - rBL}` +
                ` L 0 ${rTL}` +
                ` Q 0 0 ${rTL} 0 Z")`
            )
        }
        return (
            `path("M ${rTL} 0 L ${w - rTR} 0` +
            ` Q ${w} 0 ${w} ${rTR}` +
            ` L ${w} ${bb - rBR}` +
            ` Q ${w} ${bb} ${w - rBR} ${bb}` +
            ` L ${halfB / 2} ${bb}` +
            ` C ${halfB / 4} ${bb} ${halfB / 8 + ar} ${h} ${ar} ${h}` +
            ` Q 0 ${h} 0 ${h - ar}` +
            ` L 0 ${rTL}` +
            ` Q 0 0 ${rTL} 0 Z")`
        )
    }

    if (placement === "right") {
        const bl = tp
        if (shape === "full") {
            const [y0, y1, y2, y3, y4, y5, y6] = tailControls(tailOffsetY)
            return (
                `path("M ${bl + rTL} 0 L ${w - rTR} 0` +
                ` Q ${w} 0 ${w} ${rTR}` +
                ` L ${w} ${h - rBR}` +
                ` Q ${w} ${h} ${w - rBR} ${h}` +
                ` L ${bl + rBL} ${h}` +
                ` Q ${bl} ${h} ${bl} ${h - rBL}` +
                ` L ${bl} ${y6}` +
                ` C ${bl} ${y5} 0 ${y4} 0 ${y3}` +
                ` C 0 ${y2} ${bl} ${y1} ${bl} ${y0}` +
                ` L ${bl} ${rTL}` +
                ` Q ${bl} 0 ${bl + rTL} 0 Z")`
            )
        }
        if (shape === "half-end") {
            return (
                `path("M ${bl + rTL} 0 L ${w - rTR} 0` +
                ` Q ${w} 0 ${w} ${rTR}` +
                ` L ${w} ${h - rBR}` +
                ` Q ${w} ${h} ${w - rBR} ${h}` +
                ` L ${ar} ${h}` +
                ` Q 0 ${h} 0 ${h - ar}` +
                ` C 0 ${h - ar - halfB / 8} ${bl} ${h - halfB / 4} ${bl} ${h - halfB / 2}` +
                ` L ${bl} ${rTL}` +
                ` Q ${bl} 0 ${bl + rTL} 0 Z")`
            )
        }
        return (
            `path("M ${ar} 0 L ${w - rTR} 0` +
            ` Q ${w} 0 ${w} ${rTR}` +
            ` L ${w} ${h - rBR}` +
            ` Q ${w} ${h} ${w - rBR} ${h}` +
            ` L ${bl + rBL} ${h}` +
            ` Q ${bl} ${h} ${bl} ${h - rBL}` +
            ` L ${bl} ${halfB / 2}` +
            ` C ${bl} ${halfB / 4} 0 ${halfB / 8 + ar} 0 ${ar}` +
            ` Q 0 0 ${ar} 0 Z")`
        )
    }

    const br = w - tp
    if (shape === "full") {
        const [y0, y1, y2, y3, y4, y5, y6] = tailControls(tailOffsetY)
        return (
            `path("M ${rTL} 0 L ${br - rTR} 0` +
            ` Q ${br} 0 ${br} ${rTR}` +
            ` L ${br} ${y0}` +
            ` C ${br} ${y1} ${w} ${y2} ${w} ${y3}` +
            ` C ${w} ${y4} ${br} ${y5} ${br} ${y6}` +
            ` L ${br} ${h - rBR}` +
            ` Q ${br} ${h} ${br - rBR} ${h}` +
            ` L ${rBL} ${h}` +
            ` Q 0 ${h} 0 ${h - rBL}` +
            ` L 0 ${rTL}` +
            ` Q 0 0 ${rTL} 0 Z")`
        )
    }
    if (shape === "half-end") {
        return (
            `path("M ${rTL} 0 L ${br - rTR} 0` +
            ` Q ${br} 0 ${br} ${rTR}` +
            ` L ${br} ${h - halfB / 2}` +
            ` C ${br} ${h - halfB / 4} ${w} ${h - halfB / 8 - ar} ${w} ${h - ar}` +
            ` Q ${w} ${h} ${w - ar} ${h}` +
            ` L ${rBL} ${h}` +
            ` Q 0 ${h} 0 ${h - rBL}` +
            ` L 0 ${rTL}` +
            ` Q 0 0 ${rTL} 0 Z")`
        )
    }
    return (
        `path("M ${rTL} 0 L ${w - ar} 0` +
        ` Q ${w} 0 ${w} ${ar}` +
        ` C ${w} ${ar + halfB / 8} ${br} ${halfB / 4} ${br} ${halfB / 2}` +
        ` L ${br} ${h - rBR}` +
        ` Q ${br} ${h} ${br - rBR} ${h}` +
        ` L ${rBL} ${h}` +
        ` Q 0 ${h} 0 ${h - rBL}` +
        ` L 0 ${rTL}` +
        ` Q 0 0 ${rTL} 0 Z")`
    )
}
