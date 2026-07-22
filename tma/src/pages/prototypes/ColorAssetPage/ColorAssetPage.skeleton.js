import Page from "../../../components/Page"
import ImageAvatar from "../../../components/ImageAvatar"
import Text from "../../../components/Text"
import Skeleton from "../../../components/Skeleton"

import * as styles from "./ColorAssetPage.module.scss"

// Neutral hero placeholders shown while the screen chunk loads. Mirrors the
// AssetSection layout (big avatar + name/price/ticker) so the swap into the
// real, color-filled cards reads as content arriving rather than a new screen.
const HERO_COUNT = 2

const HeroSkeleton = () => (
    <section className={styles.root}>
        <Skeleton active>
            <div className={styles.body}>
                <ImageAvatar size={72} />
                <div className={styles.data}>
                    <Text variant="title3" weight="semibold">
                        Ethereum
                    </Text>
                    <Text variant="title2" weight="semibold">
                        3,180
                    </Text>
                    <Text variant="subheadline1" weight="regular">
                        ETH
                    </Text>
                </div>
            </div>
        </Skeleton>
    </section>
)

const ColorAssetPageSkeleton = () => (
    <Page>
        <div className={styles.list}>
            {Array.from({ length: HERO_COUNT }).map((_, index) => (
                <HeroSkeleton key={index} />
            ))}
        </div>
    </Page>
)

export default ColorAssetPageSkeleton
