import Page from "../Page"
import SectionList from "../SectionList"
import Text from "../Text"
import Skeleton from "../Skeleton"

import * as styles from "./FitText.skeleton.module.scss"

// Holds the first showcase region while the chunk loads: a redacted title bar
// in the same stage box the live FitText occupies.
const FitTextSkeleton = () => (
    <Page>
        <SectionList>
            <SectionList.Item header="Scales down to fit — never wraps">
                <div className={styles.stage}>
                    <div className={styles.frame}>
                        <Skeleton active>
                            <Text variant="title1" weight="bold">
                                Confirm and send to external wallet
                            </Text>
                        </Skeleton>
                    </div>
                </div>
            </SectionList.Item>
        </SectionList>
    </Page>
)

export default FitTextSkeleton
