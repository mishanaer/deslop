import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import ImageAvatar from "../ImageAvatar"
import Text from "../Text"
import Skeleton from "../Skeleton"

import * as styles from "./TabBar.skeleton.module.css"

// Mirrors the settings rows above the bar; varied trailing values keep the
// placeholder from reading as identical stripes.
const SETTING_ROWS = [
    { title: "Number of tabs", value: "4" },
    { title: "Active index", value: "0" },
]

// The screen's defining feature is the persistent bottom bar, so the
// skeleton renders it as a redacted pill of icon + label slots.
const TAB_SLOTS = ["Wallet", "Trade", "History", "Search"]

const TabBarSkeleton = () => (
    <Page>
        <SectionList>
            <SectionList.Item>
                <Skeleton active>
                    {SETTING_ROWS.map((row, index) => (
                        <Cell key={index} end={<Cell.Text title={row.value} />}>
                            <Cell.Text title={row.title} />
                        </Cell>
                    ))}
                </Skeleton>
            </SectionList.Item>
        </SectionList>

        <div className={styles.bar}>
            <Skeleton active>
                {TAB_SLOTS.map((label, index) => (
                    <div key={index} className={styles.slot}>
                        <ImageAvatar size={28} />
                        <Text variant="caption2" weight="medium">
                            {label}
                        </Text>
                    </div>
                ))}
            </Skeleton>
        </div>
    </Page>
)

export default TabBarSkeleton
