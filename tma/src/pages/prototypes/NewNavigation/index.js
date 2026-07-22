import { useState, useEffect, useMemo, useRef } from "react"
import * as m from "motion/react-m"
import { AnimatePresence } from "motion/react"
import WebApp, { BackButton } from "../../../lib/twa"
import Page from "../../../components/Page"

import NavigationPanel from "./components/NavigationPanel"
import { useAvatarUrl } from "./hooks/useAvatarUrl"
import { useSegmentNavigation } from "./hooks/useSegmentNavigation"

import TabBar from "../../../components/TabBar"
import { useSkin } from "../../../hooks/DeviceProvider"
import { getTabsConfig, pageVariants } from "./navigationConfig"

import * as styles from "./NewNavigation.module.css"

function NewNavigation() {
    const { isApple, skin } = useSkin()
    const { activeSegment, handleSegmentChange: originalHandleSegmentChange } =
        useSegmentNavigation()
    const avatarUrl = useAvatarUrl()

    const tabsConfig = useMemo(() => getTabsConfig(skin), [skin])
    const currentPrefix = activeSegment === 0 ? "wallet" : "ton"
    const [prevPrefix, setPrevPrefix] = useState(currentPrefix)
    const segmentResetRef = useRef(null)

    const handleSegmentChange = (index) => {
        if (segmentResetRef.current) {
            clearTimeout(segmentResetRef.current)
            segmentResetRef.current = null
        }

        setPrevPrefix(currentPrefix)
        originalHandleSegmentChange(index)

        const nextPrefix = index === 0 ? "wallet" : "ton"
        segmentResetRef.current = setTimeout(() => {
            setPrevPrefix(nextPrefix)
            segmentResetRef.current = null
        }, 500)
    }

    // Tab State
    const [tabIndices, setTabIndices] = useState({ wallet: 0, ton: 0 })
    const [prevIndices, setPrevIndices] = useState({ wallet: 0, ton: 0 })

    const activeTabs = activeSegment === 0 ? tabsConfig.wallet : tabsConfig.ton
    const activeIndex = activeSegment === 0 ? tabIndices.wallet : tabIndices.ton
    const previousIndex =
        activeSegment === 0 ? prevIndices.wallet : prevIndices.ton

    const currentView = activeTabs[activeIndex]?.view || null
    const currentKey = `${currentPrefix}-${activeIndex}`
    const isSegmentSwitch = prevPrefix !== currentPrefix
    const isFirstTab = activeIndex === 0
    const direction = previousIndex < activeIndex ? 1 : -1

    useEffect(() => {
        return () => {
            if (segmentResetRef.current) {
                clearTimeout(segmentResetRef.current)
            }
        }
    }, [])

    const handleTabChange = (index) => {
        const key = activeSegment === 0 ? "wallet" : "ton"
        setPrevIndices((prev) => ({ ...prev, [key]: tabIndices[key] }))
        setTabIndices((prev) => ({ ...prev, [key]: index }))
    }

    // Prevent vertical swipes
    useEffect(() => {
        WebApp.disableVerticalSwipes()
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = ""
            // Restore swipes on unmount too: in split-view the prototype can be
            // left via the sidebar without ever hitting the BackButton.
            WebApp.enableVerticalSwipes()
        }
    }, [])

    const animationCustom = useMemo(
        () => ({
            isSegmentSwitch,
            direction,
            isApple,
        }),
        [isSegmentSwitch, direction, isApple]
    )

    return (
        <Page headerColor={WebApp.themeParams.section_bg_color?.slice(1)}>
            <BackButton />

            <div className={styles.container}>
                <AnimatePresence
                    mode="popLayout"
                    initial={false}
                    custom={animationCustom}
                    inherit={false}
                >
                    <m.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        custom={animationCustom}
                        key={currentKey}
                        className={styles.view}
                    >
                        <div className={styles.viewBody}>
                            {isFirstTab && (
                                <div className={styles.navigationWrapper}>
                                    <NavigationPanel
                                        avatarUrl={avatarUrl}
                                        activeSegment={activeSegment}
                                        onSegmentChange={handleSegmentChange}
                                    />
                                </div>
                            )}
                            {currentView}
                        </div>
                    </m.div>
                </AnimatePresence>
            </div>

            <div className={styles.tabBarWrapper}>
                <div className={styles.tabBarHit}>
                    <TabBar
                        tabs={activeTabs}
                        onChange={handleTabChange}
                        defaultIndex={activeIndex}
                    />
                </div>
            </div>
        </Page>
    )
}

export default NewNavigation
