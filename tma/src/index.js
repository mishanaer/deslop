import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App"
import AppearanceProvider from "./hooks/AppearanceProvider"
import DeviceProvider from "./hooks/DeviceProvider"
import MotionProvider from "./components/MotionProvider"
import { SnackbarProvider } from "./components/Snackbar"

const STORYBOOK_COLOR_SCHEME_KEY = "deslop.storybook.color-scheme"
const COLOR_SCHEMES = ["light", "dark"]

const getStoredColorScheme = () => {
    try {
        const value = window.localStorage.getItem(STORYBOOK_COLOR_SCHEME_KEY)
        return COLOR_SCHEMES.includes(value) ? value : undefined
    } catch {
        return undefined
    }
}

const storeColorScheme = (colorScheme) => {
    try {
        window.localStorage.setItem(STORYBOOK_COLOR_SCHEME_KEY, colorScheme)
    } catch {
        // Storage may be unavailable in private or embedded browser contexts.
    }
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <MotionProvider>
            <DeviceProvider>
                <AppearanceProvider
                    defaultColorScheme={getStoredColorScheme()}
                    onColorSchemeChange={storeColorScheme}
                >
                    <SnackbarProvider>
                        <App />
                    </SnackbarProvider>
                </AppearanceProvider>
            </DeviceProvider>
        </MotionProvider>
    </StrictMode>
)
