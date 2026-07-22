import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import Skeleton, { SkeletonBlock } from "../Skeleton"

import * as styles from "./Collapsible.skeleton.module.scss"

// Both collapsibles start closed, so the loaded screen's initial shape is just
// the two toggle rows: a labelled row with a pill-shaped switch placeholder per
// section. Collapsed content stays hidden, so the swap is seamless.
const SECTIONS = [
    { header: "Default", label: "Toggle content" },
    { header: "Slow Animation", label: "Toggle with slow reveal" },
]

const CollapsibleSkeleton = () => (
    <Page>
        <SectionList>
            {SECTIONS.map(({ header, label }) => (
                <SectionList.Item key={header} header={header}>
                    <Skeleton active>
                        <Cell
                            end={
                                <SkeletonBlock
                                    as="span"
                                    className={styles.switchTrack}
                                />
                            }
                        >
                            <Cell.Text title={label} />
                        </Cell>
                    </Skeleton>
                </SectionList.Item>
            ))}
        </SectionList>
    </Page>
)

export default CollapsibleSkeleton
