import { useEffect } from "react"
import PropTypes from "prop-types"
import WebApp from "../../lib/twa"
import { useSplitViewContext } from "../SplitView/context"
import { useColorScheme } from "../../hooks/useColorScheme"
import { getResolvedColorToken } from "../../theme/colors"

const { setHeaderColor, setBackgroundColor } = WebApp

/**
 * Screen wrapper that syncs the TWA header/background colors and the
 * --page-background var (drives AppBar/TabBar fades). Renders children as-is.
 * @param {"primary"|"secondary"} [props.mode] Which --tg-theme bg to use.
 * @param {string} [props.headerColorToken] Primitive or Mini App color token.
 * @param {string} [props.backgroundColorToken] Primitive or Mini App color token.
 * @param {boolean} [props.expandOnMount]  Call WebApp.expand() on mount.
 * @example
 * <Page mode="primary" expandOnMount>{content}</Page>
 */
const Page = ({
    children,
    mode = "secondary",
    headerColorToken,
    backgroundColorToken,
    expandOnMount,
}) => {
    const { inDetailPane, setPaneBackground } = useSplitViewContext()
    useColorScheme()

    const colorTokenMapping = {
        primary: "--mini-app-background",
        secondary: "--mini-app-background-secondary",
    }

    const resolvedHeaderToken = headerColorToken ?? colorTokenMapping[mode]
    const resolvedBackgroundToken =
        backgroundColorToken ?? colorTokenMapping[mode]
    const tgHeaderColor = getResolvedColorToken(resolvedHeaderToken)
    const tgBackgroundColor = getResolvedColorToken(resolvedBackgroundToken)
    const CSSBackgroundColor = `var(${resolvedBackgroundToken})`

    useEffect(() => {
        if (expandOnMount) {
            WebApp.expand()
        }
    }, [expandOnMount])

    useEffect(() => {
        // In a SplitView detail pane the shell owns the TWA chrome and the pane
        // background comes from CSS, so don't fight over header/background colors.
        if (inDetailPane) return
        if (WebApp.initData) {
            setBackgroundColor(tgBackgroundColor)
            setHeaderColor(tgHeaderColor)
        } else {
            document.body.style.backgroundColor = CSSBackgroundColor
        }
        // Page-color fade gradients (AppBar top, TabBar bottom) follow the
        // actual page background, whatever the mode.
        document.body.style.setProperty("--page-background", CSSBackgroundColor)
    }, [tgBackgroundColor, tgHeaderColor, CSSBackgroundColor, inDetailPane])

    // In a detail pane, report the page color to the shell so the whole pane
    // takes it (full height, including the bottom-inset area), not just content.
    useEffect(() => {
        if (!inDetailPane || !setPaneBackground) return
        setPaneBackground(CSSBackgroundColor)
    }, [inDetailPane, setPaneBackground, CSSBackgroundColor])

    return <>{children}</>
}

Page.propTypes = {
    children: PropTypes.node,
    mode: PropTypes.oneOf(["primary", "secondary"]),
    headerColorToken: PropTypes.string,
    backgroundColorToken: PropTypes.string,
    expandOnMount: PropTypes.bool,
}
export default Page
