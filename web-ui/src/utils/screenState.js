// Session-scoped registry of per-screen UI state (scroll offsets, active
// tabs), keyed by location path. Screens read it back on mount, so returning
// to a path — whether via history back or by navigating to it again (the TWA
// BackButton fallback pushes "/" instead of popping) — restores the view the
// user left. Deliberately not persisted: a fresh app start begins clean.

const MAX_SCREENS = 50

// path -> Map(subKey -> value). Insertion order doubles as recency for the
// LRU eviction below.
const screens = new Map()

const touch = (path) => {
    const state = screens.get(path)
    if (state) {
        screens.delete(path)
        screens.set(path, state)
    }
    return state
}

export const getScreenState = (path, subKey) => touch(path)?.get(subKey)

export const setScreenState = (path, subKey, value) => {
    let state = touch(path)
    if (!state) {
        state = new Map()
        screens.set(path, state)
        if (screens.size > MAX_SCREENS) {
            screens.delete(screens.keys().next().value)
        }
    }
    state.set(subKey, value)
}

// Mirrors wouter's currentHashLocation (use-hash-location.js). Reading the
// hash directly instead of subscribing via useHashLocation keeps consumers
// free of hashchange re-renders and pins the value to mount time — during
// exit animations AnimatePresence keeps the old screen alive while the
// location already points at the next one.
export const currentScreenPath = () =>
    "/" + window.location.hash.replace(/^#?\/?/, "")
