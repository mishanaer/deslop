import { useEffect } from "react"

const FOCUSABLE_SELECTOR = [
    "a[href]:not([disabled])",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled]):not([type='hidden'])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
].join(",")

const getFocusable = (container) => {
    if (!container) return []
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
    )
}

export function useFocusTrap(ref, isActive) {
    useEffect(() => {
        if (!isActive) return
        const node = ref.current
        if (!node) return

        const previouslyFocused = document.activeElement

        if (!node.hasAttribute("tabindex")) {
            node.setAttribute("tabindex", "-1")
        }

        const focusables = getFocusable(node)
        const initialTarget = focusables[0] || node
        initialTarget.focus({ preventScroll: true })

        const handleKeyDown = (e) => {
            if (e.key !== "Tab") return
            const items = getFocusable(node)
            if (!items.length) {
                e.preventDefault()
                return
            }
            const first = items[0]
            const last = items[items.length - 1]
            const active = document.activeElement
            if (e.shiftKey) {
                if (active === first || !node.contains(active)) {
                    e.preventDefault()
                    last.focus()
                }
            } else if (active === last || !node.contains(active)) {
                e.preventDefault()
                first.focus()
            }
        }

        node.addEventListener("keydown", handleKeyDown)
        return () => {
            node.removeEventListener("keydown", handleKeyDown)
            if (
                previouslyFocused &&
                typeof previouslyFocused.focus === "function"
            ) {
                previouslyFocused.focus({ preventScroll: true })
            }
        }
    }, [ref, isActive])
}
