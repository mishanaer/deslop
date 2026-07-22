import * as m from "motion/react-m"
import WebApp, { BackButton } from "../../lib/twa"

import Page from "../Page"
import TextField from "../TextField"
import GlassContainer from "../GlassEffect"
import GradientBackground from "../GradientBackground"
import { useSplitViewContext } from "../SplitView/context"

import patternSvg from "../../images/pattern.svg"
import { useColorScheme } from "../../hooks/useColorScheme"
import { useViewportHeight } from "./useViewportHeight"
import { usePreventScroll } from "./usePreventScroll"
import * as styles from "./TextField.showcase.module.css"
import { accentColors, avatarGradients } from "@deslop/primitives/tokens"
import { getUiColor } from "@deslop/primitives/colors"

function InputPage() {
    const viewportHeight = useViewportHeight()
    const colorScheme = useColorScheme()
    const { inDetailPane } = useSplitViewContext()

    // Используем стабильную начальную высоту для фона
    const stableHeight =
        WebApp.viewportHeight || window.innerHeight || window.screen.height

    // The split-view pane scrolls itself; don't lock the global body there.
    usePreventScroll(!inDetailPane)

    const greenGradient = avatarGradients.find(({ name }) => name === "Green")
    const pinkGradient = avatarGradients.find(({ name }) => name === "Pink")
    const purple = accentColors.find(({ name }) => name === "Purple")
    const indigo = accentColors.find(({ name }) => name === "Indigo")
    const gradientColors = [
        greenGradient.top,
        greenGradient.top,
        greenGradient.bottom,
        greenGradient.bottom,
    ]
    const gradientColorsDark = [
        pinkGradient.top,
        pinkGradient.bottom,
        purple.dark,
        indigo.dark,
    ]

    // Цвет header в зависимости от темы
    const headerColor =
        colorScheme === "dark"
            ? getUiColor("static-black").replace("#", "")
            : greenGradient.bottom.replace("#", "")

    return (
        <Page headerColor={headerColor}>
            <GradientBackground
                colors={gradientColors}
                colorsDark={gradientColorsDark}
                patternUrl={patternSvg}
                patternIntensity={0.5}
                className={styles.background}
                style={{ height: `${stableHeight}px` }}
                rotation={0}
                intensity={1}
            />
            <m.div
                className={styles.container}
                initial={{ height: viewportHeight }}
                animate={{ height: viewportHeight }}
                transition={{
                    type: "spring",
                    bounce: 0,
                    damping: 35,
                    stiffness: 500,
                    delay: 0.2,
                }}
            >
                <BackButton />
                <div className={styles.input}>
                    <GlassContainer style={{ borderRadius: "36px" }}>
                        <TextField label="Message" />
                    </GlassContainer>
                </div>
            </m.div>
        </Page>
    )
}

export default InputPage
