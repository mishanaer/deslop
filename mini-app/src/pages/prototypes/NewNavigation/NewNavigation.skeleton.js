import Page from "../../../components/Page"
import SectionList from "../../../components/SectionList"
import Cell from "../../../components/Cells"
import ImageAvatar from "../../../components/ImageAvatar"
import Text from "../../../components/Text"
import Skeleton, { SkeletonBlock } from "../../../components/Skeleton"

import ActionButtons from "../Wallet/components/ActionButtons"

import * as styles from "./NewNavigation.skeleton.module.css"

// Mirrors the first visible view (Wallet tab): the top navigation panel
// (avatar + wallet-name pill + QR), a big balance, the action-button row, an
// asset list and the floating tab bar.
const ASSET_ROWS = [
    { title: "Toncoin", sub: "TON", value: "1,024.50" },
    { title: "Bitcoin", sub: "BTC", value: "64,120" },
    { title: "Notcoin", sub: "NOT", value: "0.0091" },
    { title: "Ethereum", sub: "ETH", value: "3,180" },
]

const TAB_COUNT = 4

const NavigationSkeleton = () => (
    <Page mode="primary">
        <Skeleton active>
            <div className={styles.navPanel}>
                <SkeletonBlock className={styles.avatar} />
                <SkeletonBlock className={styles.namePill} />
                <SkeletonBlock className={styles.qr} />
            </div>

            <div className={styles.balance}>
                <Text variant="subheadline2">Balance</Text>
                <SkeletonBlock className={styles.amount} />
                <Text variant="subheadline2">+0.82 0.11% Today</Text>
            </div>

            <ActionButtons />

            <SectionList>
                <SectionList.Item>
                    {ASSET_ROWS.map((row, index) => (
                        <Cell
                            key={index}
                            start={<ImageAvatar />}
                            end={<Cell.Text title={row.value} />}
                        >
                            <Cell.Text
                                title={row.title}
                                description={row.sub}
                                bold
                            />
                        </Cell>
                    ))}
                </SectionList.Item>
            </SectionList>

            <div className={styles.tabBar}>
                {Array.from({ length: TAB_COUNT }).map((_, index) => (
                    <div key={index} className={styles.tab}>
                        <SkeletonBlock className={styles.icon} />
                        <SkeletonBlock className={styles.label} />
                    </div>
                ))}
            </div>
        </Skeleton>
    </Page>
)

export default NavigationSkeleton
