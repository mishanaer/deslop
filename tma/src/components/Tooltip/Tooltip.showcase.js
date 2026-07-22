import { useState } from "react"

import Page from "../Page"
import Tooltip from "../Tooltip"
import SegmentedControl from "../SegmentedControl"

import { BackButton } from "../../lib/twa"

import * as styles from "./Tooltip.showcase.module.scss"

const ANCHORS = [
    { key: "tl", top: "0%", left: "0%" },
    { key: "tc", top: "0%", left: "50%" },
    { key: "tr", top: "0%", left: "100%" },
    { key: "lc", top: "50%", left: "0%" },
    { key: "rc", top: "50%", left: "100%" },
    { key: "bl", top: "100%", left: "0%" },
    { key: "bc", top: "100%", left: "50%" },
    { key: "br", top: "100%", left: "100%" },
]

const TYPE_SEGMENTS = ["Regular", "Compact"]
const BADGE_SEGMENTS = ["With Badge", "No Badge"]

const TooltipShowcase = () => {
    const [typeIndex, setTypeIndex] = useState(0)
    const [badgeIndex, setBadgeIndex] = useState(0)

    const type = typeIndex === 0 ? "regular" : "compact"
    const showBadge = badgeIndex === 0

    return (
        <>
            <BackButton />
            <Page>
                <div className={styles.page}>
                    <div className={styles.controls}>
                        <SegmentedControl
                            segments={TYPE_SEGMENTS}
                            onChange={setTypeIndex}
                        />
                        <SegmentedControl
                            segments={BADGE_SEGMENTS}
                            onChange={setBadgeIndex}
                        />
                    </div>
                    <div className={styles.rect}>
                        {ANCHORS.map(({ key, top, left }) => (
                            <div
                                key={key}
                                className={styles.anchor}
                                style={{ top, left }}
                            >
                                <Tooltip
                                    content="Text Sample."
                                    type={type}
                                    badge={showBadge ? "NEW" : undefined}
                                >
                                    <span className={styles.dot} />
                                </Tooltip>
                            </div>
                        ))}
                    </div>
                </div>
            </Page>
        </>
    )
}

export default TooltipShowcase
