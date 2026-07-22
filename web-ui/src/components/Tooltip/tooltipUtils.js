import { useCallback } from "react"

import { calculatePosition, samePosition } from "./tooltipPosition"
import { useAnchoredPosition } from "../../hooks/useAnchoredPosition"

export { useClickOutside } from "../../hooks/useClickOutside"

const INITIAL_POSITION = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    placement: "bottom",
    shape: "full",
    tailOffsetX: 0,
    tailOffsetY: 0,
    tailProtrusion: 0,
    originX: "50%",
    originY: "0%",
}

export const useTooltipPosition = (
    isOpen,
    triggerRef,
    tooltipRef,
    tailVBreadth,
    tailHBreadth,
    tailProtrusion,
    preferredPlacement
) => {
    const calculate = useCallback(
        (triggerRect, contentSize) =>
            calculatePosition(
                triggerRect,
                contentSize,
                tailVBreadth,
                tailHBreadth,
                tailProtrusion,
                preferredPlacement
            ),
        [tailVBreadth, tailHBreadth, tailProtrusion, preferredPlacement]
    )

    return useAnchoredPosition({
        isOpen,
        triggerRef,
        contentRef: tooltipRef,
        initialPosition: INITIAL_POSITION,
        calculate,
        equals: samePosition,
    })
}
