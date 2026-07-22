import { useEffect } from "react"
import PropTypes from "prop-types"
import WebApp from "../../lib/twa"
import { useSplitViewContext } from "../SplitView/context"

const { setHeaderColor, setBackgroundColor } = WebApp

/**
 * Screen wrapper that syncs the TWA header/background colors and the
 * --page-background var (drives AppBar/TabBar fades). Renders children as-is.
 * @param {"primary"|"secondary"} [props.mode] Which --tg-theme bg to use.
 * @param {string} [props.headerColor]     Hex without '#', overrides mode.
 * @param {string} [props.backgroundColor] Hex without '#', overrides mode.
 * @param {boolean} [props.expandOnMount]  Call WebApp.expand() on mount.
 * @example
 * <Page mode="primary" expandOnMount>{content}</Page>
 */
const Page = ({
    children,
    mode = "secondary",
    headerColor,
    backgroundColor,
    expandOnMount,
}) => {
    const { inDetailPane, setPaneBackground } = useSplitViewContext()

    const tgColorMapping = {
        primary: "bg_color",
        secondary: "secondary_bg_color",
    }

    const CSSColorMapping = {
        primary: "--tg-theme-bg-color",
        secondary: "--tg-theme-secondary-bg-color",
    }

    const tgHeaderColor = headerColor ? `#${headerColor}` : tgColorMapping[mode]
    const tgBackgroundColor = backgroundColor
        ? `#${backgroundColor}`
        : tgColorMapping[mode]
    const CSSBackgroundColor = backgroundColor
        ? `#${backgroundColor}`
        : `var(${CSSColorMapping[mode]})`

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
    headerColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    expandOnMount: PropTypes.bool,
}
export default Page
