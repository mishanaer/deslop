import { createContext } from "react"

// True for a PanelHeader rendered inside a ModalView, so it adopts the taller
// in-modal height. Owned by the chrome (this side); ModalView imports it only
// to provide the value.
export const ModalChromeContext = createContext(false)
