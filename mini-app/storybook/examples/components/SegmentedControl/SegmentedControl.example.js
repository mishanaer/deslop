import Page from "@components/Page"
import SectionList from "@components/SectionList"
import SegmentedControl from "@components/SegmentedControl"

import { BackButton } from "@lib/twa"

const SegmentedControlExample = () => (
    <>
        <BackButton />
        <Page>
            <SectionList>
                <SectionList.Item header="Segmented Control">
                    <div
                        style={{
                            padding: "var(--ui-space-12) var(--ui-layout-content-inset)",
                        }}
                    >
                        <SegmentedControl segments={["Day", "Week", "Month"]} />
                    </div>
                </SectionList.Item>
            </SectionList>
        </Page>
    </>
)

export default SegmentedControlExample
