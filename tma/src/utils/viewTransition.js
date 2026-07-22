import "./viewTransition.scss"

export const VIEW_TRANSITION_DURATION = 200

let isAnyTransitionRunning = false

export const isViewTransitionSupported = () => {
    return typeof document !== "undefined" && "startViewTransition" in document
}

export const performViewTransition = async (updateCallback) => {
    if (!isViewTransitionSupported()) {
        updateCallback()
        return Promise.resolve()
    }

    if (isAnyTransitionRunning) {
        updateCallback()
        return Promise.resolve()
    }

    isAnyTransitionRunning = true

    try {
        const transition = document.startViewTransition(updateCallback)
        await transition.finished
        return transition
    } catch (error) {
        if (error.name !== "AbortError") {
            console.warn("View transition failed:", error)
        }
        updateCallback()
    } finally {
        isAnyTransitionRunning = false
    }
}

export const initializeViewTransitions = () => {
    if (typeof window !== "undefined") {
        window.pageTransitionDuration = VIEW_TRANSITION_DURATION / 1000
    }
}

export const cleanupViewTransitions = () => {}
