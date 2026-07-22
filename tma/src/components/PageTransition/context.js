import { createContext, useContext } from "react"

// Each PageScroll publishes the location it was mounted for. Route content
// inside must match against THIS location, not the live one: AnimatePresence
// keeps the exiting screen mounted during the crossfade, and its live-location
// <Switch> would otherwise re-render to the NEW route inside the dying
// wrapper — an instant content swap pinned to the top, killing the exit fade.
export const FrozenLocationContext = createContext(null)

export const useFrozenLocation = () => useContext(FrozenLocationContext)
