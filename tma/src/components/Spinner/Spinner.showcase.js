import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import Spinner from "../Spinner"

import { BackButton } from "../../lib/twa"

const SpinnerShowcase = () => (
    <>
        <BackButton />
        <Page>
            <SectionList>
                <SectionList.Item header="Size">
                    <Cell start={<Spinner size={16} />}>
                        <Cell.Text title="Small (16px)" />
                    </Cell>
                    <Cell start={<Spinner />}>
                        <Cell.Text title="Default (24px)" />
                    </Cell>
                    <Cell start={<Spinner size={32} />}>
                        <Cell.Text title="Medium (32px)" />
                    </Cell>
                    <Cell start={<Spinner size={48} />}>
                        <Cell.Text title="Large (48px)" />
                    </Cell>
                </SectionList.Item>

                <SectionList.Item header="Centered">
                    <div style={{ height: 120 }}>
                        <Spinner centered />
                    </div>
                </SectionList.Item>

                <SectionList.Item header="Centered Large">
                    <div style={{ height: 120 }}>
                        <Spinner centered size={48} />
                    </div>
                </SectionList.Item>
            </SectionList>
        </Page>
    </>
)

export default SpinnerShowcase
