import { useState } from "react"

import Page from "@components/Page"
import SectionList from "@components/SectionList"
import Cell from "@components/Cells"
import ImageAvatar from "@components/ImageAvatar"
import InitialsAvatar from "@components/InitialsAvatar"
import Text from "@components/Text"
import Skeleton from "@components/Skeleton"

import { getAssetIcon } from "@utils/AssetsMap"
import { BackButton } from "@lib/twa"

const SkeletonExample = () => {
    const [loading, setLoading] = useState(true)

    return (
        <>
            <BackButton />
            <Page>
                <SectionList>
                    <SectionList.Item>
                        <Cell.Switch value={loading} onChange={setLoading}>
                            <Cell.Text title="Loading" />
                        </Cell.Switch>
                    </SectionList.Item>

                    <SectionList.Item
                        header="Cells"
                        footer="One Skeleton provider redacts every Text and avatar inside"
                    >
                        <Skeleton active={loading}>
                            <Cell
                                start={
                                    <ImageAvatar src={getAssetIcon("TON")} />
                                }
                                end={
                                    <Cell.End label="1,247.51" caption="$3.21" />
                                }
                            >
                                <Cell.Text title="Toncoin" description="TON" />
                            </Cell>
                            <Cell
                                start={
                                    <InitialsAvatar
                                        userId={3}
                                        name="Andrew Rogozov"
                                    />
                                }
                                end={<Cell.End label="12:30" />}
                            >
                                <Cell.Text
                                    title="Andrew Rogozov"
                                    description="Last seen recently"
                                />
                            </Cell>
                        </Skeleton>
                    </SectionList.Item>

                    <SectionList.Item
                        header="Text"
                        footer="Width comes from placeholder children, an explicit ch value, or a default when there is no content yet; paragraphs are composed from stacked single-line bars"
                    >
                        <Cell>
                            <Text variant="body" skeleton={loading}>
                                Placeholder children define the layout
                            </Text>
                        </Cell>
                        <Cell>
                            <Text variant="body" skeleton={loading}>
                                {loading ? undefined : "No placeholder needed"}
                            </Text>
                        </Cell>
                        <Cell>
                            <Text variant="body" skeleton={loading && 16}>
                                {loading ? null : "Fixed width of 16ch"}
                            </Text>
                        </Cell>
                        <Cell>
                            <div>
                                <Text variant="body" skeleton={loading && 34}>
                                    {loading
                                        ? null
                                        : "A paragraph placeholder is built"}
                                </Text>
                                <Text variant="body" skeleton={loading && 30}>
                                    {loading
                                        ? null
                                        : "from a few stacked lines with"}
                                </Text>
                                <Text variant="body" skeleton={loading && 18}>
                                    {loading ? null : "varying widths."}
                                </Text>
                            </div>
                        </Cell>
                    </SectionList.Item>
                </SectionList>
            </Page>
        </>
    )
}

export default SkeletonExample
