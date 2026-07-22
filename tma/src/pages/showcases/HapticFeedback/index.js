import { useState } from "react"

import Page from "../../../components/Page"
import SectionList from "../../../components/SectionList"
import Cell from "../../../components/Cells"
import Picker from "../../../components/Picker"
import { RegularButton } from "../../../components/Button"

import WebApp, { BackButton } from "../../../lib/twa"

import * as styles from "./HapticFeedback.module.css"

const haptics = [
    {
        label: "Impact · Light",
        play: () => WebApp.HapticFeedback.impactOccurred("light"),
    },
    {
        label: "Impact · Medium",
        play: () => WebApp.HapticFeedback.impactOccurred("medium"),
    },
    {
        label: "Impact · Heavy",
        play: () => WebApp.HapticFeedback.impactOccurred("heavy"),
    },
    {
        label: "Impact · Rigid",
        play: () => WebApp.HapticFeedback.impactOccurred("rigid"),
    },
    {
        label: "Impact · Soft",
        play: () => WebApp.HapticFeedback.impactOccurred("soft"),
    },
    {
        label: "Notification · Success",
        play: () => WebApp.HapticFeedback.notificationOccurred("success"),
    },
    {
        label: "Notification · Warning",
        play: () => WebApp.HapticFeedback.notificationOccurred("warning"),
    },
    {
        label: "Notification · Error",
        play: () => WebApp.HapticFeedback.notificationOccurred("error"),
    },
    {
        label: "Selection",
        play: () => WebApp.HapticFeedback.selectionChanged(),
    },
]

const labels = haptics.map((h) => h.label)

const HapticFeedbackShowcase = () => {
    const [index, setIndex] = useState(0)

    const playSelected = () => haptics[index].play()

    const handlePickerIndex = (next) => {
        setIndex(next)
        haptics[next].play()
    }

    return (
        <>
            <BackButton />
            <Page>
                <SectionList>
                    <SectionList.Item header="Haptic Feedback">
                        <Cell
                            end={
                                <Cell.Part type="Picker">
                                    {labels[index]}
                                </Cell.Part>
                            }
                        >
                            <Cell.Text title="Type" />
                        </Cell>
                        <Picker
                            items={labels}
                            onPickerIndex={handlePickerIndex}
                        />
                    </SectionList.Item>

                    <SectionList.Item>
                        <div className={styles.action}>
                            <RegularButton
                                variant="filled"
                                label="Replay"
                                onClick={playSelected}
                            />
                        </div>
                    </SectionList.Item>
                </SectionList>
            </Page>
        </>
    )
}

export default HapticFeedbackShowcase
