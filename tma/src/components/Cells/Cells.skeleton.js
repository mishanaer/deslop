import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import ImageAvatar from "../ImageAvatar"
import InitialsAvatar from "../InitialsAvatar"
import Skeleton, { SkeletonBlock } from "../Skeleton"

import * as styles from "./Cells.skeleton.module.css"

// Loading placeholder for the Cell showcase. It mirrors the showcase's section
// layout (Text / Start / End / Switch / Editable / Triple / Combined) so the
// swap to real content is seamless. Section headers are fixed chrome and stay
// solid; every row is wrapped in Skeleton, which auto-redacts each Cell.Text
// and avatar into a shimmer bar. Varied mock strings give the bars real rhythm.
// A switch has no text to redact, so it is a pill-shaped SkeletonBlock.
const switchTrack = <SkeletonBlock as="span" className={styles.switchTrack} />

const CellsSkeleton = () => (
    <Page>
        <SectionList>
            <SectionList.Item header="Text">
                <Skeleton active>
                    <Cell>
                        <Cell.Text title="Title only" />
                    </Cell>
                    <Cell>
                        <Cell.Text
                            title="Title with subtitle"
                            description="Description text"
                        />
                    </Cell>
                    <Cell>
                        <Cell.Text title="Bold title" bold />
                    </Cell>
                </Skeleton>
            </SectionList.Item>

            <SectionList.Item header="Start">
                <Skeleton active>
                    <Cell start={<ImageAvatar />}>
                        <Cell.Text title="Toncoin" description="100 TON" bold />
                    </Cell>
                    <Cell start={<ImageAvatar />}>
                        <Cell.Text title="Bitcoin" description="0.001 BTC" bold />
                    </Cell>
                    <Cell start={<InitialsAvatar userId={1} name="Ilya Grishin" />}>
                        <Cell.Text title="Ilya Grishin" description="Contact" bold />
                    </Cell>
                </Skeleton>
            </SectionList.Item>

            <SectionList.Item header="End">
                <Skeleton active>
                    <Cell end={<Cell.Part type="Chevron" />}>
                        <Cell.Text title="Chevron" />
                    </Cell>
                    <Cell end={<Cell.Text title="$150.00" description="Received" />}>
                        <Cell.Text title="Transfer" description="Today" bold />
                    </Cell>
                    <Cell end={<Cell.Text title="English" />}>
                        <Cell.Text title="Language" />
                    </Cell>
                </Skeleton>
            </SectionList.Item>

            <SectionList.Item header="Switch">
                <Skeleton active>
                    <Cell end={switchTrack}>
                        <Cell.Text title="Enabled" />
                    </Cell>
                    <Cell end={switchTrack}>
                        <Cell.Text title="Disabled option" />
                    </Cell>
                </Skeleton>
            </SectionList.Item>

            <SectionList.Item header="Editable">
                <Skeleton active>
                    <Cell>
                        <Cell.Text title="Enter text here" />
                    </Cell>
                    <Cell>
                        <Cell.Text title="Read-only value" />
                    </Cell>
                </Skeleton>
            </SectionList.Item>

            <SectionList.Item header="Triple">
                <Skeleton active>
                    <Cell
                        start={<InitialsAvatar userId={3} name="Thomas Andersson" />}
                        end={<Cell.End label="+2.46" />}
                    >
                        <Cell.Text
                            title="Thomas Andersson"
                            description="Incoming transfer"
                            caption="Mar 22 at 23:39"
                            bold
                        />
                    </Cell>
                    <Cell
                        start={<ImageAvatar />}
                        end={<Cell.End label="-100 TON" caption="$32.33" />}
                    >
                        <Cell.Text
                            title="Outgoing transfer"
                            description="To Alice"
                            caption="Yesterday at 14:02"
                            bold
                        />
                    </Cell>
                </Skeleton>
            </SectionList.Item>

            <SectionList.Item header="Combined">
                <Skeleton active>
                    <Cell start={<ImageAvatar />} end={<Cell.Part type="Chevron" />}>
                        <Cell.Text title="Toncoin" description="100 TON" bold />
                    </Cell>
                    <Cell
                        start={<InitialsAvatar userId={2} name="Alice" />}
                        end={<Cell.Text title="$50.00" description="Pending" />}
                    >
                        <Cell.Text title="Alice" description="Transfer" bold />
                    </Cell>
                </Skeleton>
            </SectionList.Item>
        </SectionList>
    </Page>
)

export default CellsSkeleton
