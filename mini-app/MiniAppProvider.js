import { useRef } from "react"
import PropTypes from "prop-types"

import MotionProvider from "./components/MotionProvider"
import PortalRootContext from "./components/Portal/context"
import { SnackbarProvider } from "./components/Snackbar"
import AppearanceProvider from "./hooks/AppearanceProvider"
import { useAppearance } from "./hooks/useColorScheme"
import DeviceProvider, { useSkin } from "./hooks/DeviceProvider"

const MiniAppSurface = ({ children }) => {
    const rootRef = useRef(null)
    const { colorScheme } = useAppearance()
    const { skin } = useSkin()

    return (
        <PortalRootContext.Provider value={rootRef}>
            <div
                ref={rootRef}
                className={skin}
                data-mini-app
                data-color-scheme={colorScheme}
            >
                <SnackbarProvider>{children}</SnackbarProvider>
            </div>
        </PortalRootContext.Provider>
    )
}

MiniAppSurface.propTypes = {
    children: PropTypes.node,
}

export const MiniAppProvider = ({
    children,
    defaultColorScheme,
    onColorSchemeChange,
}) => (
    <MotionProvider>
        <DeviceProvider>
            <AppearanceProvider
                defaultColorScheme={defaultColorScheme}
                onColorSchemeChange={onColorSchemeChange}
            >
                <MiniAppSurface>{children}</MiniAppSurface>
            </AppearanceProvider>
        </DeviceProvider>
    </MotionProvider>
)

MiniAppProvider.propTypes = {
    children: PropTypes.node,
    defaultColorScheme: PropTypes.oneOf(["light", "dark"]),
    onColorSchemeChange: PropTypes.func,
}

export default MiniAppProvider
