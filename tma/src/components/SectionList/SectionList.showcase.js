import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"

import { BackButton } from "../../lib/twa"

const SectionListShowcase = () => (
    <>
        <BackButton />
        <Page>
            <SectionList>
                <SectionList.Item header="With Header">
                    <Cell>
                        <Cell.Text title="First Item" />
                    </Cell>
                    <Cell>
                        <Cell.Text title="Second Item" />
                    </Cell>
                </SectionList.Item>

                <SectionList.Item
                    header="With Footer"
                    description="This is a footer description that provides additional context for the section above."
                >
                    <Cell>
                        <Cell.Text title="Item One" />
                    </Cell>
                    <Cell>
                        <Cell.Text title="Item Two" />
                    </Cell>
                </SectionList.Item>

                <SectionList.Item
                    header="Header & Footer"
                    description="Footer text goes here."
                >
                    <Cell>
                        <Cell.Text
                            title="With Description"
                            description="Subtitle"
                        />
                    </Cell>
                    <Cell>
                        <Cell.Text title="Bold" bold />
                    </Cell>
                </SectionList.Item>

                <SectionList.Item>
                    <Cell>
                        <Cell.Text title="No Header, No Footer" />
                    </Cell>
                </SectionList.Item>
            </SectionList>
        </Page>
    </>
)

export default SectionListShowcase
