import { useState } from "react"

import { RegularButton } from "@components/Button"

import WebApp, { BackButton } from "@lib/twa"
import { getResolvedColorToken } from "@theme/colors"

import * as styles from "./ColorChanging.module.css"

function ColorChanging() {
    const [isSecondaryColor, setIsSecondaryColor] = useState(true)

    const switchColors = () => {
        if (WebApp.initData) {
            if (isSecondaryColor) {
                WebApp.setHeaderColor(getResolvedColorToken("--black"))
                WebApp.setBackgroundColor(getResolvedColorToken("--black"))
            } else {
                WebApp.setHeaderColor("secondary_bg_color")
                WebApp.setBackgroundColor("secondary_bg_color")
            }
            setIsSecondaryColor((prev) => !prev)
            WebApp.HapticFeedback.impactOccurred("light")
        } else {
            if (isSecondaryColor) {
                document.body.style.backgroundColor = getResolvedColorToken(
                    "--black"
                )
            } else {
                document.body.style.backgroundColor =
                    "var(--background)"
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
