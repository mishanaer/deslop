import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import * as m from "motion/react-m"
import { useResizeObserver } from "../../hooks/useResizeObserver"
import * as styles from "./TabBar.module.css"
import Tab from "./components/Tab"
import { useIndicatorDrag } from "./useIndicatorDrag"
import GradientMask from "./components/GradientMask"

const TabBarOverlay = ({
    tabsLength,
    activeIndex,
    onChange,
}) => {
    const { overlayRef, animate, transition, handlers } = useIndicatorDrag({
        tabsLength,
        activeIndex,
        spring: { type: "spring", stiffness: 800, damping: 50 },
        onSnapToNew: onChange,
    })

    return (
        <>
            <m.div
                className={styles.clipPathContainer}
                ref={overlayRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, ...animate }}
                transition={{
                    default: { duration: 0.2 },
                    clipPath: transition.clipPath,
                }}
            />
            <div className={styles.dragLayer} {...handlers} />
        </>
    )
}

const TabBar = ({ tabs, onChange, defaultIndex = 0 }) => {
    const [activeIndex, setActiveIndex] = useState(defaultIndex)

    useEffect(() => {
        setActiveIndex(defaultIndex)
    }, [defaultIndex])

    useEffect(() => {
        setActiveIndex((prev) => Math.min(prev, tabs.length - 1))
    }, [tabs.length])

    const handleSegmentClick = (index) => {
        if (index !== activeIndex) {
            setActiveIndex(index)
            onChange?.(index)
        }
    }

    const rootRef = useRef(null)

    const [rootWidth, setRootWidth] = useState(0)

    useResizeObserver(rootRef, (entry) => {
        setRootWidth(entry.contentRect.width)
    })

    const isThreeTabs = tabs.length === 3
    const marginX = isThreeTabs ? 54 : 21
    const rootStyle = {
        left: marginX,
        right: marginX,
        width: `calc(100% - ${marginX * 2}px)`,
    }

    const maskInsets = {
        top: 21,
        bottom: 21,
        left: marginX,
        right: marginX,
    }

    return (
        <m.div
            ref={rootRef}
            className={styles.root}
            whileTap={{ scale: 1.02 }}
            transition={{
                scale: { type: "spring", stiffness: 800, damping: 40 },
            }}
            style={rootStyle}
            layout
        >
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        isActive={index === activeIndex}
                        onClick={() => handleSegmentClick(index)}
                        {...tab}
                    />
                ))}
            </div>
            <TabBarOverlay
                tabsLength={tabs.length}
                activeIndex={activeIndex}
                onChange={handleSegmentClick}
            />

            <GradientMask
                width={rootWidth}
                height={64}
                insets={maskInsets}
            />
        </m.div>
    )
}

TabBar.propTypes = {
    tabs: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    defaultIndex: PropTypes.number,
}

TabBarOverlay.propTypes = {
    tabsLength: PropTypes.number.isRequired,
    activeIndex: PropTypes.number,
    onChange: PropTypes.func,
}

export default TabBar
