import { useLayoutEffect, useState } from "react"
import {
    getScreenState,
    setScreenState,
    currentScreenPath,
} from "../utils/screenState"

// Content behind lazy routes and async data mounts after the scroller does,
// so the saved offset may not be reachable straight away.
const RESTORE_DEADLINE_MS = 1000

// Keeps a scroll container's position in the screen state registry and puts
// it back when the same screen mounts again. Saving rides the scroll event
// itself (a Map write per frame), so there is nothing to flush on unmount.
// Restoring retries on animation frames while the content grows, until the
// offset is reachable, the user takes over, or the deadline passes — then it
// applies once and lets the browser clamp.
//
// `enabled` must go false the moment the screen starts exiting (pass
// useIsPresent() under AnimatePresence): popLayout re-parents the exiting
// element, the browser resets its scroll to 0, and the resulting scroll
// event would overwrite the saved offset. Dropping the listener in the
// same commit wins that race — scroll events dispatch after it.
export default function useScrollRestoration(ref, subKey = "scroll", { enabled = true } = {}) {
    const [path] = useState(currentScreenPath)

    useLayoutEffect(() => {
        const el = ref.current
        if (!el || !enabled) return undefined

        const save = () =>
            setScreenState(path, subKey, {
                top: el.scrollTop,
                left: el.scrollLeft,
            })
        el.addEventListener("scroll", save, { passive: true })

        let frame = 0
        const stop = () => cancelAnimationFrame(frame)

        const saved = getScreenState(path, subKey)
        if (saved && (saved.top > 0 || saved.left > 0)) {
            const reachable = () =>
                el.scrollHeight - el.clientHeight >= saved.top &&
                el.scrollWidth - el.clientWidth >= saved.left
            const apply = () => {
                el.scrollTop = saved.top
                el.scrollLeft = saved.left
            }
            const deadline = performance.now() + RESTORE_DEADLINE_MS
            const attempt = () => {
                if (reachable() || performance.now() > deadline) {
                    apply()
                    return
                }
                frame = requestAnimationFrame(attempt)
            }
            attempt()
            // The user taking over beats a pending restore.
            el.addEventListener("pointerdown", stop, { passive: true })
            el.addEventListener("wheel", stop, { passive: true })
        }

        return () => {
            stop()
            el.removeEventListener("scroll", save)
            el.removeEventListener("pointerdown", stop)
            el.removeEventListener("wheel", stop)
        }
    }, [ref, path, subKey, enabled])
}
