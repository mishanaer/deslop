import Page from "../../../components/Page"
import SectionList from "../../../components/SectionList"
import Cell from "../../../components/Cells"
import Text from "../../../components/Text"
import Skeleton from "../../../components/Skeleton"
import { getUiColor } from "@deslop/primitives/colors"

// Mirrors the single settings section: a color row plus three toggle rows.
// Titles redact to bars sized by their mock strings; trailing controls become
// simple redacted shapes rather than working pickers or switches.
const ROWS = [
    { title: "Header Color", value: getUiColor("background-secondary") },
    { title: "Back Button", toggle: true },
    { title: "Fullscreen", toggle: true },
    { title: "Settings Button", toggle: true },
]

const NavigationBarSkeleton = () => (
    <Page>
        <SectionList>
            <SectionList.Item header="Navigation Bar">
                <Skeleton active>
                    {ROWS.map(({ title, value, toggle }) => (
                        <Cell
                            key={title}
                            end={
                                toggle ? (
                                    <Text variant="body" skeleton={5} />
                                ) : (
                                    <Cell.Text title={value} />
                                )
                            }
                        >
                            <Cell.Text title={title} />
                        </Cell>
                    ))}
                </Skeleton>
            </SectionList.Item>
        </SectionList>
    </Page>
)

export default NavigationBarSkeleton
