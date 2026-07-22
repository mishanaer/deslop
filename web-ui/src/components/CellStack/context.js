import { createContext, useContext } from "react"

// Exposes the stack's expanded state to nested cards (CellStack.Morph).
const CellStackContext = createContext(false)

export const useCellStack = () => useContext(CellStackContext)

export default CellStackContext
