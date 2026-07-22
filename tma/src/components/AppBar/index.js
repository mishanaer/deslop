import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import { useHashLocation } from "wouter/use-hash-location"

import PanelHeader from "../PanelHeader"
import { useSplitViewContext } from "../SplitView/context"
import { isTelegram } from "../../lib/twa"
import ChevronLeftIcon from "@deslop/primitives/icons/chevron-left.svg?react"

import * as styles from "./AppBar.module.css"

const findScroller = (node) => {
    let el = node?.parentElement
    while (el) {
        const overflowY = getComputedStyle(el).overflowY
        if (overflowY === "auto" || overflowY === "scroll") return el
        el = el.parentElement
    }
    return null
}

// Browser-only page header (renders null inside Telegram, where native chrome
// handles it). The back button is dropped in a SplitView detail pane, where the
// persistent sidebar already navigates.
const AppBar = ({
    title,
    header = true,
    back = true,
    right,
    onRight,
    rightVariant,
    rightAriaLabel,
    rightTitle,
}) => {
    const [, navigate] = useHashLocation()
    const { inDetailPane } = useSplitViewContext()
    const [scrolled, setScrolled] = useState(false)
    const barRef = useRef(null)
    const enabled = header !== false && !isTelegram()
    const showBack = back && !inDetailPane

    useEffect(() => {
        if (!enabled) return
        const scroller = findScroller(barRef.current)
        if (!scroller) return
        let raf = 0
        const onScroll = () => {
            if (raf) return
            raf = requestAnimationFrame(() => {
                raf = 0
                setScrolled(scroller.scrollTop > 2)
            })
        }
        onScroll()
        scroller.addEventListener("scroll", onScroll, { passive: true })
        return () => {
            scroller.removeEventListener("scroll", onScroll)
            if (raf) cancelAnimationFrame(raf)
        }
    }, [enabled])

    if (!enabled) return null

    return (
        <div
            ref={barRef}
            className={`${styles.bar} ${scrolled ? styles.scrolled : ""}`}
        >
            <PanelHeader
                {...(showBack && {
                    left: <ChevronLeftIcon />,
                    onLeft: () => navigate("/"),
                    leftAriaLabel: "Back",
                    leftTitle: "Back",
                })}
                right={right}
                onRight={onRight}
                rightVariant={rightVariant}
                rightAriaLabel={rightAriaLabel}
                rightTitle={rightTitle}
            >
                {title}
            </PanelHeader>
        </div>
    )
}

AppBar.propTypes = {
    title: PropTypes.string,
    header: PropTypes.bool,
    back: PropTypes.bool,
    right: PropTypes.node,
    onRight: PropTypes.func,
    rightVariant: PropTypes.string,
    rightAriaLabel: PropTypes.string,
    rightTitle: PropTypes.string,
}

export default AppBar
