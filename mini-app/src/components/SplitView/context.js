import { createContext, useContext } from "react"

// Lets nested components know they render inside a SplitView detail pane.
// Used by <Page> to yield TWA header/background chrome to the shell in split mode.
const SplitViewContext = createContext({ inDetailPane: false })

export const useSplitViewContext = () => useContext(SplitViewContext)

export default SplitViewContext
