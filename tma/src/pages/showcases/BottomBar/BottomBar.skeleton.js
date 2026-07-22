import Page from "../../../components/Page"
import SectionList from "../../../components/SectionList"
import Cell from "../../../components/Cells"
import Skeleton from "../../../components/Skeleton"

// Mirrors the initial page body: the two label inputs. The Main/Secondary
// Button config sections are collapsed until a label is typed, so they stay
// out of the loading shape. The button chrome itself is Telegram's, not the
// page body, so nothing extra is drawn.
const ROWS = ["Main Button Label", "Secondary Button Label"]

const BottomBarSkeleton = () => (
    <Page>
        <SectionList>
            <SectionList.Item header="Bottom Bar">
                <Skeleton active>
                    {ROWS.map((label) => (
                        <Cell key={label}>
                            <Cell.Text title={label} />
                        </Cell>
                    ))}
                </Skeleton>
            </SectionList.Item>
        </SectionList>
    </Page>
)

export default BottomBarSkeleton
