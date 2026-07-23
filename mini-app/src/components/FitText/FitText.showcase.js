import { useState } from "react"
import PropTypes from "prop-types"

import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import SegmentedControl from "../SegmentedControl"
import Text from "../Text"
import FitText from "."

import { BackButton } from "../../lib/twa"

const PHRASES = [
    "Send",
    "Confirm and send",
    "Confirm and send to external wallet",
    "Confirm and send 1234.56 TON to the external wallet",
]

const WIDTHS = ["100%", "70%", "45%"]
const MIN_SCALES = ["0.4", "0.6", "0.8"]

const Stage = ({ width, children }) => (
    <div
        style={{
            display: "flex",
            justifyContent: "center",
            padding: "24px var(--side-padding)",
        }}
    >
        <div
            style={{
                width,
                padding: "16px 0",
                borderRadius: 12,
                boxShadow:
                    "inset 0 0 0 1px var(--tg-theme-section-separator-color)",
            }}
        >
            {children}
        </div>
    </div>
)

Stage.propTypes = {
    width: PropTypes.string,
    children: PropTypes.node,
}

const FitTextShowcase = () => {
    const [phraseIdx, setPhraseIdx] = useState(2)
    const [widthIdx, setWidthIdx] = useState(0)
    const [minScaleIdx, setMinScaleIdx] = useState(0)

    return (
        <>
            <BackButton />
            <Page>
                <SectionList>
                    <SectionList.Item header="Scales down to fit — never wraps">
                        <Stage width={WIDTHS[widthIdx]}>
                            <FitText
                                minScale={parseFloat(MIN_SCALES[minScaleIdx])}
                            >
                                <Text variant="title1" weight="bold">
                                    {PHRASES[phraseIdx]}
                                </Text>
                            </FitText>
                        </Stage>
                        <Cell
                            onClick={() =>
                                setPhraseIdx((i) => (i + 1) % PHRASES.length)
                            }
                        >
                            <Cell.Text type="Accent" title="Next phrase" />
                        </Cell>
                    </SectionList.Item>

                    <SectionList.Item header="Container width — refits via ResizeObserver">
                        <div style={{ padding: "12px var(--side-padding)" }}>
                            <SegmentedControl
                                segments={WIDTHS}
                                defaultIndex={widthIdx}
                                onChange={setWidthIdx}
                            />
                        </div>
                    </SectionList.Item>

                    <SectionList.Item
                        header="Min scale — below it the text clips"
                    >
                        <div style={{ padding: "12px var(--side-padding)" }}>
                            <SegmentedControl
                                segments={MIN_SCALES}
                                defaultIndex={minScaleIdx}
                                onChange={setMinScaleIdx}
                            />
                        </div>
                    </SectionList.Item>
                </SectionList>
            </Page>
        </>
    )
}

export default FitTextShowcase
