import { useMediaQuery } from "./useMediaQuery"

// Breakpoint at which the shell switches from a single-column stack to the
// iPad-style split layout (persistent sidebar + detail pane).
export const SPLIT_VIEW_QUERY = "(min-width: 900px)"

// Returns true when the viewport is wide enough for split-view.
export function useSplitView() {
    return useMediaQuery(SPLIT_VIEW_QUERY)
}

export default useSplitView
