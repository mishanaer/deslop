import Page from "../../../components/Page"
import SectionList from "../../../components/SectionList"
import Cell from "../../../components/Cells"
import Skeleton from "../../../components/Skeleton"

// Loading placeholder for the Haptic Feedback showcase. Mirrors a settings-like
// list of trigger cells: the section header is real chrome (stays solid), while
// the rows redact to shimmer bars under the Skeleton provider. Varied label
// lengths give the bars a realistic rhythm instead of identical widths.
const TRIGGERS = [
    "Impact · Light",
    "Impact · Medium",
    "Impact · Heavy",
    "Notification · Success",
    "Notification · Warning",
    "Notification · Error",
    "Selection",
]

const HapticFeedbackSkeleton = () => (
    <Page>
        <SectionList>
            <SectionList.Item header="Haptic Feedback">
                <Skeleton active>
                    {TRIGGERS.map((label, index) => (
                        <Cell key={index}>
                            <Cell.Text title={label} />
                        </Cell>
                    ))}
                </Skeleton>
            </SectionList.Item>
        </SectionList>
    </Page>
)

export default HapticFeedbackSkeleton
