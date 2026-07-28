import { useEffect, useLayoutEffect } from "react"

/** Uses layout timing in the browser without emitting SSR warnings. */
export const useBrowserLayoutEffect =
    typeof window === "undefined" ? useEffect : useLayoutEffect

export default useBrowserLayoutEffect
