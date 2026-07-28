import { clamp } from "../../utils/number"
import { useAnchoredPosition } from "../../hooks/useAnchoredPosition"

export { useClickOutside } from "../../hooks/useClickOutside"

export const DROPDOWN_WIDTH = 250
export const GAP = 1
export const VIEWPORT_PADDING = 8

const INITIAL_POSITION = {
    top: 0,
    left: 0,
    openUpwards: false,
    originX: "100%",
    originY: "0%",
}

// Bounds to clamp the menu within: the SplitView pane's rect when open inside
// one, the full viewport otherwise.
export const getViewportBounds = () => ({
    left: 0,
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
})

const calculatePosition = (buttonRect, dropdownSize, bounds) => {
    const spaceBelow = bounds.bottom - buttonRect.bottom
    const spaceAbove = buttonRect.top - bounds.top

    const openUpwards =
        spaceBelow < dropdownSize.height && spaceAbove > spaceBelow

    const minLeft = bounds.left + VIEWPORT_PADDING
    const minTop = bounds.top + VIEWPORT_PADDING

    const buttonCenterX = buttonRect.left + buttonRect.width / 2
    const rawLeft = buttonCenterX - dropdownSize.width / 2
    const left = clamp(
        rawLeft,
        minLeft,
        Math.max(minLeft, bounds.right - dropdownSize.width - VIEWPORT_PADDING)
    )

    const rawTop = openUpwards
        ? buttonRect.top - dropdownSize.height - GAP
        : buttonRect.bottom + GAP
    const top = clamp(
        rawTop,
        minTop,
        Math.max(minTop, bounds.bottom - dropdownSize.height - VIEWPORT_PADDING)
    )

    const originXPx = clamp(buttonCenterX - left, 0, dropdownSize.width)
    const originX = `${(originXPx / dropdownSize.width) * 100}%`
    const originY = openUpwards ? "100%" : "0%"

    return { top, left, openUpwards, originX, originY }
}

export const useDropdownPosition = (
    isOpen,
    buttonRef,
    dropdownRef,
    getBounds = getViewportBounds
) =>
    useAnchoredPosition({
        isOpen,
        triggerRef: buttonRef,
        contentRef: dropdownRef,
        initialPosition: INITIAL_POSITION,
        calculate: (rect, size) => calculatePosition(rect, size, getBounds()),
    })
