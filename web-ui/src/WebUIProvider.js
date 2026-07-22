import PropTypes from "prop-types"

import MotionProvider from "./components/MotionProvider"
import { SnackbarProvider } from "./components/Snackbar"
import AppearanceProvider from "./hooks/AppearanceProvider"
import DeviceProvider from "./hooks/DeviceProvider"

export const WebUIProvider = ({ children }) => (
    <MotionProvider>
        <DeviceProvider>
            <AppearanceProvider>
                <SnackbarProvider>{children}</SnackbarProvider>
            </AppearanceProvider>
        </DeviceProvider>
    </MotionProvider>
)

WebUIProvider.propTypes = {
    children: PropTypes.node,
}

export default WebUIProvider
