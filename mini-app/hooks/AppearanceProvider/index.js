import PropTypes from "prop-types"
import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import WebApp from "../../lib/twa"

export const AppearanceContext = createContext({
    colorScheme: "light",
    setColorScheme: () => {},
    toggleColorScheme: () => {},
})

const COLOR_SCHEMES = ["light", "dark"]
const isColorScheme = (value) => COLOR_SCHEMES.includes(value)

const getTelegramColorScheme = () => {
    if (typeof window === "undefined" || typeof document === "undefined") {
        return null
    }

    const value = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--tg-color-scheme")
        .trim()

    return isColorScheme(value) ? value : null
}

const getSystemColorScheme = () => {
    if (typeof window === "undefined" || !window.matchMedia) return "light"
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
}

const getAutomaticColorScheme = () =>
    getTelegramColorScheme() ?? getSystemColorScheme()

const AppearanceProvider = ({
    children,
    defaultColorScheme,
    onColorSchemeChange,
}) => {
    const [automaticColorScheme, setAutomaticColorScheme] = useState(
        getAutomaticColorScheme
    )
    const [selectedColorScheme, setSelectedColorScheme] = useState(() =>
        isColorScheme(defaultColorScheme) ? defaultColorScheme : null
    )
    const colorScheme = selectedColorScheme ?? automaticColorScheme

    const setColorScheme = useCallback(
        (nextColorScheme) => {
            const nextValue =
                typeof nextColorScheme === "function"
                    ? nextColorScheme(colorScheme)
                    : nextColorScheme

            if (!isColorScheme(nextValue)) return

            setSelectedColorScheme(nextValue)
            onColorSchemeChange?.(nextValue)
        },
        [colorScheme, onColorSchemeChange]
    )

    const toggleColorScheme = useCallback(() => {
        setColorScheme(colorScheme === "dark" ? "light" : "dark")
    }, [colorScheme, setColorScheme])

    useEffect(() => {
        const updateThemeFromTelegram = () => {
            const tgColorScheme = getTelegramColorScheme()
            if (tgColorScheme) {
                setAutomaticColorScheme(tgColorScheme)
                return
            }

            setAutomaticColorScheme(getSystemColorScheme())
        }

        const handleSystemThemeChange = (e) => {
            if (!getTelegramColorScheme()) {
                setAutomaticColorScheme(e.matches ? "dark" : "light")
            }
        }

        updateThemeFromTelegram()

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        WebApp.onEvent("themeChanged", updateThemeFromTelegram)
        mediaQuery.addEventListener("change", handleSystemThemeChange)

        return () => {
            WebApp.offEvent("themeChanged", updateThemeFromTelegram)
            mediaQuery.removeEventListener("change", handleSystemThemeChange)
        }
    }, [])

    const value = useMemo(
        () => ({ colorScheme, setColorScheme, toggleColorScheme }),
        [colorScheme, setColorScheme, toggleColorScheme]
    )

    return (
        <AppearanceContext.Provider value={value}>
            {children}
        </AppearanceContext.Provider>
    )
}

AppearanceProvider.propTypes = {
    children: PropTypes.node,
    defaultColorScheme: PropTypes.oneOf(COLOR_SCHEMES),
    onColorSchemeChange: PropTypes.func,
}

export default AppearanceProvider
