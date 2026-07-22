import Page from "../Page"
import SectionList from "../SectionList"
import Text from "../Text"
import Train from "../Train"

import { BackButton } from "../../lib/twa"

const TrainShowcase = () => (
    <>
        <BackButton />
        <Page>
            <SectionList>
                <SectionList.Item header="Space Divider">
                    <div style={{ padding: "12px var(--side-padding)" }}>
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
                    </div>
                </SectionList.Item>

                <SectionList.Item header="Dot Divider">
                    <div style={{ padding: "12px var(--side-padding)" }}>
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
                    </div>
                </SectionList.Item>
            </SectionList>
        </Page>
    </>
)

export default TrainShowcase
