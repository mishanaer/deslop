import { useEffect, useRef, useState } from "react"

import * as styles from "./useTapHighlight.module.scss"

export const supportsTouch =
    typeof window !== "undefined" && "ontouchstart" in window

// Duration the fade-out state stays applied — kept in sync with the CSS fade-out
// animation so the highlight resets only once it has finished fading.
const FADE_OUT_MS = 250

// Down/up/cancel use touch events on purpose: on Android onPointerUp often
// fails to fire, sticking the highlight and crediting the tap to the wrong
// element. Movement is the one thing read from the pointer event. The real
// scroll-cancel on iOS is touchcancel, fired when a scroll takes the gesture.
export function useTapHighlight({
    onTap,
    onTapOut,
    mode = "overlay",
    disabled,
} = {}) {
    const commonStyle = styles[mode]
    const [tapped, setTapped] = useState(false)
    const [tappedClassNames, setTappedClassNames] = useState([commonStyle])
    const timeoutRef = useRef()

    const fadeOut = () => {
        setTapped(false)
        setTappedClassNames([commonStyle, styles.fadeOut])
        onTapOut?.()
        timeoutRef.current = window.setTimeout(() => {
            setTappedClassNames([commonStyle])
        }, FADE_OUT_MS)
    }

    const fadeIn = (data) => {
        clearTimeout(timeoutRef.current)
        setTapped(true)
        setTappedClassNames([commonStyle, styles.fadeIn])
        onTap?.(data)
    }

    useEffect(() => () => clearTimeout(timeoutRef.current), [])

    const handlers = supportsTouch
        ? {
              onTouchStart: (e) => {
                  if (disabled) return
                  if (e.touches.length === 1) {
                      fadeIn({
                          target: e.currentTarget,
                          clientX: e.touches[0].clientX,
                          clientY: e.touches[0].clientY,
                      })
                  } else {
                      fadeOut()
                  }
              },
              onTouchEnd: () => {
                  if (disabled) return
                  if (tapped) fadeOut()
              },
              onPointerMove: (e) => {
                  if (
                      tapped &&
                      e.pointerType === "touch" &&
                      (e.movementY !== 0 || e.movementX !== 0)
                  ) {
                      fadeOut()
                  }
              },
              onTouchCancel: () => {
                  if (tapped) fadeOut()
              },
          }
        : {
              onMouseLeave: () => {
                  if (tapped) fadeOut()
              },
              onMouseDown: (e) => {
                  if (disabled) return
                  fadeIn({
                      target: e.currentTarget,
                      clientX: e.clientX,
                      clientY: e.clientY,
                  })
              },
              onMouseUp: () => {
                  if (disabled) return
                  if (tapped) fadeOut()
              },
              onContextMenu: () => {
                  if (tapped) fadeOut()
              },
          }

    return [tapped, handlers, tappedClassNames]
}
