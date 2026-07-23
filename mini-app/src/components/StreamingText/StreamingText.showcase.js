import { useState } from "react"

import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import SegmentedControl from "../SegmentedControl"
import Text from "../Text"
import StreamingText from "."

import { BackButton } from "../../lib/twa"

const SAMPLE = `🔹 Toncoin has attracted a community-driven user base of over 35 million, fostering an ecosystem that encourages active participation and engagement.

📉 In the last 24 hours, Toncoin’s price moved –5.67% to $0.0024 and trading volume moved +13.79% to $50.93m.`

const SPEEDS = ["slow", "normal", "fast"]
const MODES = ["word", "char"]

const StreamingTextShowcase = () => {
    const [speedIdx, setSpeedIdx] = useState(2)
    const [modeIdx, setModeIdx] = useState(0)
    const [replayKey, setReplayKey] = useState(0)

    const speed = SPEEDS[speedIdx]
    const mode = MODES[modeIdx]

    return (
        <>
            <BackButton />
            <Page>
                <SectionList>
                    <SectionList.Item header="Preview">
                        <div
                            style={{
                                padding: "16px var(--side-padding)",
                            }}
                        >
                            <Text variant="body" weight="regular">
                                <StreamingText
                                    speed={speed}
                                    mode={mode}
                                    replayKey={`${replayKey}-${speed}-${mode}`}
                                >
                                    {SAMPLE}
                                </StreamingText>
                            </Text>
                        </div>
                    </SectionList.Item>

                    <SectionList.Item>
                        <Cell onClick={() => setReplayKey((k) => k + 1)}>
                            <Cell.Text type="Accent" title="Replay" />
                        </Cell>
                    </SectionList.Item>

                    <SectionList.Item header="Stagger">
                        <div
                            style={{
                                padding: "12px var(--side-padding)",
                            }}
                        >
                            <SegmentedControl
                                segments={SPEEDS}
                                defaultIndex={speedIdx}
                                onChange={setSpeedIdx}
                            />
                        </div>
                    </SectionList.Item>

                    <SectionList.Item header="Reveal by">
                        <div
                            style={{
                                padding: "12px var(--side-padding)",
                            }}
                        >
                            <SegmentedControl
                                segments={MODES}
                                defaultIndex={modeIdx}
                                onChange={setModeIdx}
                            />
                        </div>
                    </SectionList.Item>
                </SectionList>
            </Page>
        </>
    )
}

export default StreamingTextShowcase
