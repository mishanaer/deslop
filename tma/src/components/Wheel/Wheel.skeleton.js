import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import Skeleton, { SkeletonBlock } from "../Skeleton"

import * as styles from "./Wheel.skeleton.module.css"

const SECTIONS = [
    "Uncontrolled Wheel",
    "Controlled Wheel",
    "Custom Formatter",
    "Disabled Wheel",
]

// `styles.block` carries the shared shimmer fill; the second class its shape.
const block = (shape) => (
    <SkeletonBlock className={`${styles.block} ${shape}`} />
)

// Mirrors one Wheel: the Min/Max header buttons, the large current value and
// the 140px tick strip with its centered indicator.
const WheelBlock = () => (
    <div className={styles.wheelWrapper}>
        <div className={styles.wheel}>
            <div className={styles.header}>
                {block(styles.button)}
                {block(styles.button)}
            </div>
            {block(styles.value)}
            <div className={styles.container}>{block(styles.indicator)}</div>
        </div>
    </div>
)

// Placeholder for the Wheel screen: one section per showcased wheel so the
// scroll height is reserved, each with its redacted label cell and wheel block.
const WheelSkeleton = () => (
    <Page>
        <SectionList>
            {SECTIONS.map((title) => (
                <SectionList.Item key={title}>
                    <Skeleton active>
                        <Cell>
                            <Cell.Text title={title} />
                        </Cell>
                    </Skeleton>
                    <WheelBlock />
                </SectionList.Item>
            ))}
        </SectionList>
    </Page>
)

export default WheelSkeleton
