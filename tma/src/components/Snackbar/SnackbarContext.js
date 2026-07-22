import { createContext, useContext, useRef, useState } from "react"
import PropTypes from "prop-types"
import SnackbarHost from "./SnackbarHost"

const SnackbarContext = createContext(null)

/**
 * Access the imperative snackbar API. Requires a `<SnackbarProvider>` ancestor
 * (mount it once near the app root). `show` returns an id you can later pass to
 * `dismiss`.
 * @returns {{ show: (options: object) => number, dismiss: (id: number) => void }}
 * @example
 * const snackbar = useSnackbar()
 * snackbar.show({
 *   position: "bottom",         // "top" | "bottom"
 *   icon: <ExclamationIcon />,
 *   title: "Saved as draft",
 *   description: "Swipe to dismiss.",
 *   action: { label: "Undo" },  // or link: { label: "View" }
 *   duration: 0,                // 0 = persistent
 * })
 */
export const useSnackbar = () => {
    const value = useContext(SnackbarContext)
    if (!value) {
        throw new Error("useSnackbar must be used inside <SnackbarProvider>")
    }
    return value
}

export const SnackbarProvider = ({ children }) => {
    const [snackbars, setSnackbars] = useState([])
    const idRef = useRef(0)

    const dismiss = (id) => {
        setSnackbars((curr) => curr.filter((s) => s.id !== id))
    }

    const show = (options) => {
        idRef.current += 1
        const id = idRef.current
        setSnackbars((curr) => [...curr, { id, ...options }])
        return id
    }

    return (
        <SnackbarContext.Provider value={{ show, dismiss }}>
            {children}
            <SnackbarHost snackbars={snackbars} onDismiss={dismiss} />
        </SnackbarContext.Provider>
    )
}

SnackbarProvider.propTypes = {
    children: PropTypes.node,
}
