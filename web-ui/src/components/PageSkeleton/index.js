import PropTypes from "prop-types"

import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import ImageAvatar from "../ImageAvatar"
import Skeleton from "../Skeleton"

// Varied mock widths so the placeholder reads as a real cell list rather
// than a stack of identical bars. Reused cyclically for any row count.
const MOCK_ROWS = [
    { title: "Toncoin", sub: "TON", value: "1,024.50" },
    { title: "Bitcoin", sub: "BTC", value: "64,120" },
    { title: "Ethereum", sub: "ETH", value: "3,180" },
    { title: "Solana", sub: "SOL", value: "142.60" },
    { title: "Notcoin", sub: "NOT", value: "0.0091" },
    { title: "Tether", sub: "USDT", value: "1.00" },
    { title: "Dogecoin", sub: "DOGE", value: "0.121" },
    { title: "Polygon", sub: "MATIC", value: "0.72" },
]

// Generic page-load skeleton used as the router's Suspense fallback. Screens
// with a distinct shape can pass their own via config; most of the catalog is
// cell lists, so the defaults fit without tuning.
const PageSkeleton = ({ rows = 7, media = true, trailing = true }) => (
    <Page>
        <SectionList>
            <SectionList.Item>
                <Skeleton active>
                    {Array.from({ length: rows }).map((_, index) => {
                        const mock = MOCK_ROWS[index % MOCK_ROWS.length]
                        return (
                            <Cell
                                key={index}
                                start={media ? <ImageAvatar /> : undefined}
                                end={
                                    trailing ? (
                                        <Cell.Text title={mock.value} />
                                    ) : undefined
                                }
                            >
                                <Cell.Text
                                    title={mock.title}
                                    description={mock.sub}
                                    bold
                                />
                            </Cell>
                        )
                    })}
                </Skeleton>
            </SectionList.Item>
        </SectionList>
    </Page>
)

PageSkeleton.propTypes = {
    rows: PropTypes.number,
    media: PropTypes.bool,
    trailing: PropTypes.bool,
}

export default PageSkeleton
