import PropTypes from "prop-types"
import { useState, useEffect } from "react"
import * as m from "motion/react-m"
import WebApp from "../../../../../lib/twa"

import { useColorScheme } from "../../../../../hooks/useColorScheme"
import * as styles from "./NavigationPanel.module.css"
import QRCodeIcon from "@deslop/primitives/icons/qr.svg?react"
import DropdownControl from "./DropdownControl"
import { getMiniAppColor } from "../../../../../theme/colors"

export default function NavigationPanel({
    avatarUrl,
    activeSegment,
    onSegmentChange,
}) {
    const [view, setView] = useState("collapsed")
    const colorScheme = useColorScheme(activeSegment === 1 ? "dark" : null)

    const handleToggle = () => {
        const newView = view === "collapsed" ? "expanded" : "collapsed"
        setView(newView)
    }

    useEffect(() => {
        const cw_color = getMiniAppColor("surface")
        const tw_color = getMiniAppColor("story-background")

        const headerColor = activeSegment === 1 ? tw_color : cw_color

        if (view === "expanded") {
            WebApp.setHeaderColor(getMiniAppColor("background"))
        } else {
            WebApp.setHeaderColor(headerColor)
        }
    }, [view, activeSegment])

    return (
        <div
            className={styles.navPanel}
            data-color-scheme={colorScheme}
            style={{
                backgroundColor:
                    activeSegment === 1
                        ? "var(--mini-app-story-background)"
                        : "var(--tg-theme-section-bg-color)",
            }}
        >
            <m.div
                className={styles.overlay}
                initial={false}
                animate={{
                    opacity: view === "expanded" ? 1 : 0,
                    pointerEvents: view === "expanded" ? "auto" : "none",
                }}
                transition={{
                    duration: 0.3,
                }}
                onClick={handleToggle}
            />
            <div className={`${styles.bounds} ${styles.transparent}`}>
                <div
                    className={styles.avatar}
                    style={{ backgroundImage: `url(${avatarUrl})` }}
                ></div>
            </div>
            <div className={styles.dropdownWrapper}>
                <DropdownControl
                    view={view}
                    activeSegment={activeSegment}
                    onSegmentChange={onSegmentChange}
                    onToggle={handleToggle}
                />
            </div>
            <div className={styles.bounds}>
                <QRCodeIcon />
            </div>
        </div>
    )
}

NavigationPanel.propTypes = {
    avatarUrl: PropTypes.string,
    activeSegment: PropTypes.number,
    onSegmentChange: PropTypes.func,
}
