import Page from "../Page"
import SectionList from "../SectionList"
import Text from "../Text"
import Skeleton from "../Skeleton"

import * as styles from "./ParticleEffect.skeleton.module.css"

// Restrained stand-in for the particle reveal effect: centered title bars
// sitting in the same region as the animated numbers. It does not fake the
// dissolve animation — just holds the shape while the chunk loads.
const REGIONS = [
    { header: "Tap to reveal / hide", value: "$1,234.56" },
    { header: "Live number (Calligraph, like BalanceCard)", value: "30.06" },
]

const ParticleEffectSkeleton = () => (
    <Page>
        <SectionList>
            {REGIONS.map(({ header, value }) => (
                <SectionList.Item key={header} header={header}>
                    <div className={styles.stage}>
                        <Skeleton active>
                            <Text variant="title1" weight="bold">
                                {value}
                            </Text>
                        </Skeleton>
                    </div>
                </SectionList.Item>
            ))}
        </SectionList>
    </Page>
)

export default ParticleEffectSkeleton
