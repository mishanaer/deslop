import { createContext, useContext } from "react"

export const ModalNavContext = createContext(null)

export function useModalNav() {
    const nav = useContext(ModalNavContext)
    if (!nav) {
        throw new Error(
            "useModalNav must be used inside a ModalView with ModalView.Page children"
        )
    }
    return nav
}
