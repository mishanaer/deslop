import Page from "../Page"
import SectionList from "../SectionList"
import SegmentedControl from "../SegmentedControl"

import { BackButton } from "../../lib/twa"

const SegmentedControlShowcase = () => (
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

export default SegmentedControlShowcase
