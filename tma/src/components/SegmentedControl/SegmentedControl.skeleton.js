import PropTypes from "prop-types"

import Page from "../Page"
import SectionList from "../SectionList"
import Text from "../Text"
import Skeleton from "../Skeleton"

import * as styles from "./SegmentedControl.skeleton.module.css"

// A single static segmented bar. Not the real SegmentedControl (that carries
// click handlers + selection state); this is an inert look-alike whose labels
// redact into shimmer bars under the Skeleton provider. First segment shows
// the resting indicator, matching the real control's default selection.
const SegmentBar = ({ segments }) => (
    <div className={styles.group}>
        <Skeleton active>
            <div className={styles.track}>
                {segments.map((label, index) => (
                    <div
                        key={index}
                        className={`${styles.segment} ${
                            index === 0 ? styles.active : ""
                        }`}
                    >
                        <Text variant="footnote" weight="semibold">
                            {label}
                        </Text>
                    </div>
                ))}
            </div>
        </Skeleton>
    </div>
)

SegmentBar.propTypes = {
    segments: PropTypes.arrayOf(PropTypes.string).isRequired,
}

// Suspense fallback for the Segmented Control showcase. It mirrors the single
// product style so the lazy chunk swaps in without layout shift.
const SegmentedControlSkeleton = () => (
    <Page>
        <SectionList>
            <SectionList.Item header="Segmented Control">
                <SegmentBar segments={["Day", "Week", "Month"]} />
            </SectionList.Item>
        </SectionList>
    </Page>
)

export default SegmentedControlSkeleton
