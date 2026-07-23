import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import Skeleton, { SkeletonBlock } from "../Skeleton"

import * as styles from "./Switch.skeleton.module.css"

// A switch has no text to redact, so it is drawn as a pill-shaped shimmer via
// the shared SkeletonBlock (non-interactive by design).
const track = <SkeletonBlock as="span" className={styles.switchTrack} />

// Varied label widths so the stacked toggle rows do not read as identical bars.
const SECTIONS = [
    { header: "States", labels: ["Controlled option", "Uncontrolled"] },
    { header: "Disabled", labels: ["Disabled on", "Disabled toggle off"] },
]

const SwitchSkeleton = () => (
    <Page>
        <SectionList>
            {SECTIONS.map(({ header, labels }) => (
                <SectionList.Item key={header} header={header}>
                    <Skeleton active>
                        {labels.map((label) => (
                            <Cell key={label} end={track}>
                                <Cell.Text title={label} />
                            </Cell>
                        ))}
                    </Skeleton>
                </SectionList.Item>
            ))}

            <SectionList.Item header="Standalone">
                <div className={styles.standaloneRow}>
                    {track}
                    {track}
                    {track}
                </div>
            </SectionList.Item>
        </SectionList>
    </Page>
)

export default SwitchSkeleton
