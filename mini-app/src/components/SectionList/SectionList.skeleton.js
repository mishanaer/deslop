import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import Skeleton from "../Skeleton"

// Loading placeholder for the SectionList showcase. Section headers and footer
// descriptions are fixed chrome, so they render as solid text (the header and
// description props sit outside SectionList.Item children); only the cell rows
// are wrapped in Skeleton and redacted into shimmer bars. Varied title lengths
// keep the bars from reading as an identical stack.
const SectionListSkeleton = () => (
    <Page>
        <SectionList>
            <SectionList.Item header="With Header">
                <Skeleton active>
                    <Cell>
                        <Cell.Text title="First item" />
                    </Cell>
                    <Cell>
                        <Cell.Text title="Second list item" />
                    </Cell>
                </Skeleton>
            </SectionList.Item>

            <SectionList.Item
                header="With Footer"
                description="This is a footer description that provides additional context for the section above."
            >
                <Skeleton active>
                    <Cell>
                        <Cell.Text title="Item one" />
                    </Cell>
                    <Cell>
                        <Cell.Text title="Item two shown here" />
                    </Cell>
                </Skeleton>
            </SectionList.Item>

            <SectionList.Item
                header="Header & Footer"
                description="Footer text goes here."
            >
                <Skeleton active>
                    <Cell>
                        <Cell.Text title="With description" description="Subtitle" />
                    </Cell>
                    <Cell>
                        <Cell.Text title="Bold row" bold />
                    </Cell>
                </Skeleton>
            </SectionList.Item>

            <SectionList.Item>
                <Skeleton active>
                    <Cell>
                        <Cell.Text title="No header, no footer" />
                    </Cell>
                </Skeleton>
            </SectionList.Item>
        </SectionList>
    </Page>
)

export default SectionListSkeleton
