import Page from "../Page"
import SectionList from "../SectionList"
import Text from "../Text"
import Train from "../Train"
import Skeleton from "../Skeleton"

import * as styles from "./Train.skeleton.module.scss"

// Reuses the real Train so the row layout and dividers (space / dot) match the
// loaded state; the Skeleton provider redacts each Text item into a bar sized
// to its mock label. Section headers stay solid as known chrome.
const TrainSkeleton = () => (
    <Page>
        <SectionList>
            <SectionList.Item header="Space Divider">
                <div className={styles.row}>
                    <Skeleton active>
                        <Train divider="space">
                            <Text variant="body" weight="regular">
                                First
                            </Text>
                            <Text variant="body" weight="regular">
                                Second
                            </Text>
                            <Text variant="body" weight="regular">
                                Third
                            </Text>
                        </Train>
                    </Skeleton>
                </div>
            </SectionList.Item>

            <SectionList.Item header="Dot Divider">
                <div className={styles.row}>
                    <Skeleton active>
                        <Train divider="dot">
                            <Text variant="subheadline2" weight="regular">
                                Label
                            </Text>
                            <Text variant="subheadline2" weight="regular">
                                Value
                            </Text>
                            <Text variant="subheadline2" weight="regular">
                                Extra
                            </Text>
                        </Train>
                    </Skeleton>
                </div>
            </SectionList.Item>
        </SectionList>
    </Page>
)

export default TrainSkeleton
