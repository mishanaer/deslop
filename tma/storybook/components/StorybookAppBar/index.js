import MoonIcon from "@deslop/primitives/icons/moon.svg?react"
import SunIcon from "@deslop/primitives/icons/sun.svg?react"

import AppBar from "../../../src/components/AppBar"
import { useSplitViewContext } from "../../../src/components/SplitView/context"
import { useAppearance } from "../../../src/hooks/useColorScheme"

const StorybookAppBar = (props) => {
    const { inDetailPane } = useSplitViewContext()
    const { colorScheme, toggleColorScheme } = useAppearance()
    const isDark = colorScheme === "dark"
    const label = isDark ? "Switch to light theme" : "Switch to dark theme"
    const ThemeIcon = isDark ? SunIcon : MoonIcon

    return (
        <AppBar
            {...props}
            {...(!inDetailPane && {
                right: <ThemeIcon aria-hidden="true" focusable="false" />,
                onRight: toggleColorScheme,
                rightAriaLabel: label,
                rightTitle: label,
            })}
        />
    )
}

export default StorybookAppBar
