import { useContext } from "react"
import { AppearanceContext } from "./AppearanceProvider"

export function useAppearance() {
    return useContext(AppearanceContext)
}

export function useColorScheme(forceColorScheme) {
    const { colorScheme } = useAppearance()
    return forceColorScheme || colorScheme
}
