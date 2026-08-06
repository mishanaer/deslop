import PropTypes from "prop-types"
import { useState, useEffect } from "react"
import * as m from "motion/react-m"
import WebApp from "@lib/twa"

import { useColorScheme } from "@hooks/useColorScheme"
import * as styles from "./NavigationPanel.module.css"
import { IconQrCode as QRCodeIcon } from "@primitives/material-symbols-react"
import DropdownControl from "./DropdownControl"
import { getResolvedColorToken } from "@theme/colors"

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
        const cw_color = getResolvedColorToken("--surface")
        const tw_color = getResolvedColorToken("--black")

        const headerColor = activeSegment === 1 ? tw_color : cw_color

        if (view === "expanded") {
            WebApp.setHeaderColor(getResolvedColorToken("--background"))
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
                        ? "var(--black)"
                        : "var(--surface)",
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
