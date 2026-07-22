import PropTypes from "prop-types"

import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import ImageAvatar from "../ImageAvatar"
import Skeleton from "../Skeleton"
import Text from "../Text"

import * as styles from "./Tabs.skeleton.module.scss"

// Mock labels of varied length so the redacted tab strip reads as real
// segments rather than a run of equal bars.
const SECTIONS = [
    { header: "Trading", tabs: ["All", "Gainers", "New"] },
    { header: "Scrollable", tabs: ["Layer 1", "DeFi", "Meme", "AI"] },
]

// Varied token rows reused cyclically for the placeholder content below
// each strip.
const MOCK_ROWS = [
    { name: "Toncoin", sub: "TON", value: "5.42" },
    { name: "Bitcoin", sub: "BTC", value: "64,120" },
    { name: "Ethereum", sub: "ETH", value: "3,180" },
    { name: "Solana", sub: "SOL", value: "142.60" },
]

const TabStrip = ({ tabs }) => (
    <div className={styles.strip}>
        {tabs.map((label, index) => (
            <Text
                key={index}
                variant="subheadline2"
                weight="semibold"
            >
                {label}
            </Text>
        ))}
    </div>
)

TabStrip.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
}

const TabsSkeleton = () => (
    <Page>
        <SectionList>
            {SECTIONS.map((section) => (
                <SectionList.Item key={section.header} header={section.header}>
                    <Skeleton active>
                        <TabStrip tabs={section.tabs} />
                        {MOCK_ROWS.map((row, index) => (
                            <Cell
                                key={index}
                                start={<ImageAvatar />}
                                end={
                                    <Cell.Text
                                        title={row.value}
                                        description={row.sub}
                                    />
                                }
                            >
                                <Cell.Text
                                    title={row.name}
                                    description={row.sub}
                                    bold
                                />
                            </Cell>
                        ))}
                    </Skeleton>
                </SectionList.Item>
            ))}
        </SectionList>
    </Page>
)

export default TabsSkeleton
