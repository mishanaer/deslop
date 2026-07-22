import { useRef, useState } from "react"
import PropTypes from "prop-types"
import { useResizeObserver } from "../../hooks/useResizeObserver"
import SplitViewContext from "./context"

import * as styles from "./SplitView.module.css"

// Generic, presentational two-pane layout (iPad-style master/detail).
// Purely structural: pass any nodes as Sidebar / Detail so prototypes can
// reuse it with their own master content and local state or routing.
const SplitView = ({ children }) => (
    <div className={styles.root}>{children}</div>
)

const Sidebar = ({ children }) => (
    <aside className={styles.sidebar}>
        <div className={styles.sidebarScroll}>{children}</div>
    </aside>
)

// The active <Page> reports its background through context so the whole pane
// (full height, incl. the bottom-inset area) takes the page color, not just
// the content. Falls back to the secondary color from CSS until a Page mounts.
const Detail = ({ children }) => {
    const [background, setBackground] = useState(null)
    // Expose the pane's pixel width as --split-pane-width so pane-relative
    // content (e.g. the Navigation header menu) can size against the pane
    // instead of the viewport. A px value avoids the percentage-in-custom-
    // property resolution gotcha. Portalled overlays (e.g. DropdownMenu) clamp
    // to paneRef's rect so they don't spill over the sidebar.
    const [paneWidth, setPaneWidth] = useState(null)
    const paneRef = useRef(null)
    useResizeObserver(paneRef, (entry) => setPaneWidth(entry.contentRect.width))

    const style = {}
    if (background) {
        style.background = background
        // Pane-scoped page color for fade gradients (AppBar/TabBar), shadowing
        // the body-level value the shell chrome Page sets.
        style["--page-background"] = background
    }
    if (paneWidth != null) style["--split-pane-width"] = `${paneWidth}px`

    return (
        <SplitViewContext.Provider
            value={{
                inDetailPane: true,
                setPaneBackground: setBackground,
                paneRef,
            }}
        >
            <main ref={paneRef} className={styles.detail} style={style}>
                {children}
            </main>
        </SplitViewContext.Provider>
    )
}

SplitView.propTypes = {
    children: PropTypes.node,
}
Sidebar.propTypes = {
    children: PropTypes.node,
}
Detail.propTypes = {
    children: PropTypes.node,
}

SplitView.Sidebar = Sidebar
SplitView.Detail = Detail

export default SplitView
