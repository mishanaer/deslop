import { useState } from "react"
import PropTypes from "prop-types"
import { Calligraph } from "calligraph"

import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import SegmentedControl from "../SegmentedControl"
import Text from "../Text"

import { generateRandomBalance } from "../../utils/number"
import { BackButton } from "../../lib/twa"

const ANIMATIONS = ["smooth", "snappy", "bouncy"]

const PHRASES = [
    "Send",
    "Sending…",
    "Sent",
    "Receive",
    "Swap tokens",
    "Connected",
]

const Stage = ({ children }) => (
    <div
        style={{
            display: "flex",
            justifyContent: "center",
            padding: "24px var(--side-padding)",
        }}
    >
        <Text variant="title1" weight="bold">
            {children}
        </Text>
    </div>
)

Stage.propTypes = {
    children: PropTypes.node,
}

const CalligraphShowcase = () => {
    const [animIdx, setAnimIdx] = useState(0)
    const [phraseIdx, setPhraseIdx] = useState(0)
    const [balance, setBalance] = useState("1234.56")

    const animation = ANIMATIONS[animIdx]

    const step = (delta) =>
        setBalance((prev) => {
            const next = Math.max(0, parseFloat(prev) + delta)
            return next.toFixed(2)
        })

    return (
        <>
            <BackButton />
            <Page>
                <SectionList>
                    <SectionList.Item header="Text — shared characters slide, the rest fade">
                        <Stage>
                            <Calligraph
                                variant="text"
                                animation={animation}
                                trend={1}
                            >
                                {PHRASES[phraseIdx]}
                            </Calligraph>
                        </Stage>
                        <Cell
                            onClick={() =>
                                setPhraseIdx((i) => (i + 1) % PHRASES.length)
                            }
                        >
                            <Cell.Text type="Accent" title="Next phrase" />
                        </Cell>
                    </SectionList.Item>

                    <SectionList.Item header="Number — rolling vertical digits">
                        <Stage>
                            <Calligraph variant="number" animation={animation}>
                                {balance}
                            </Calligraph>
                        </Stage>
                        <Cell onClick={() => step(10)}>
                            <Cell.Text type="Accent" title="Increase" />
                        </Cell>
                        <Cell onClick={() => step(-10)}>
                            <Cell.Text type="Accent" title="Decrease" />
                        </Cell>
                        <Cell
                            onClick={() =>
                                setBalance(generateRandomBalance())
                            }
                        >
                            <Cell.Text type="Accent" title="Randomize" />
                        </Cell>
                    </SectionList.Item>

                    <SectionList.Item header="Slots — slot-machine digit spin">
                        <Stage>
                            <Calligraph
                                variant="slots"
                                animation={animation}
                                style={{ overflow: "hidden" }}
                            >
                                {balance}
                            </Calligraph>
                        </Stage>
                    </SectionList.Item>

                    <SectionList.Item header="Animation preset">
                        <div style={{ padding: "12px var(--side-padding)" }}>
                            <SegmentedControl
                                segments={ANIMATIONS}
                                defaultIndex={animIdx}
                                onChange={setAnimIdx}
                            />
                        </div>
                    </SectionList.Item>
                </SectionList>
            </Page>
        </>
    )
}

export default CalligraphShowcase
