import { useState } from "react"

import { RegularButton } from "../../../components/Button"

import WebApp, { BackButton } from "../../../lib/twa"
import { getTmaColor } from "../../../theme/colors"

import * as styles from "./ColorChanging.module.css"

function ColorChanging() {
    const [isSecondaryColor, setIsSecondaryColor] = useState(true)

    const switchColors = () => {
        if (WebApp.initData) {
            if (isSecondaryColor) {
                WebApp.setHeaderColor(getTmaColor("story-background"))
                WebApp.setBackgroundColor(getTmaColor("story-background"))
            } else {
                WebApp.setHeaderColor("secondary_bg_color")
                WebApp.setBackgroundColor("secondary_bg_color")
            }
            setIsSecondaryColor((prev) => !prev)
            WebApp.HapticFeedback.impactOccurred("light")
        } else {
            if (isSecondaryColor) {
                document.body.style.backgroundColor = getTmaColor(
                    "story-background"
                )
            } else {
                document.body.style.backgroundColor =
                    "var(--tg-theme-secondary-bg-color)"
            }
            setIsSecondaryColor((prev) => !prev)
        }
    }

    return (
        <>
            <BackButton />
            <div className={styles.root}>
                <RegularButton
                    variant="filled"
                    label="Change Color"
                    onClick={switchColors}
                />
            </div>
        </>
    )
}

export default ColorChanging
