import Page from "../Page"
import SectionList from "../SectionList"
import StartView from "../StartView"
import Skeleton from "../Skeleton"

// Reuses the real StartView so the placeholder inherits its centered column,
// spacing and platform padding exactly. The Skeleton provider redacts the
// inner Text into shimmer bars. Keep the description to a single line: the
// redaction draws one bar per Text element, so a wrapping string would render
// as a single tall block rather than stacked line bars.
const StartViewSkeleton = () => (
    <Page>
        <SectionList>
            <SectionList.Item header="Title Only">
                <Skeleton active>
                    <StartView title="Welcome to Wallet" />
                </Skeleton>
            </SectionList.Item>

            <SectionList.Item header="Title & Description">
                <Skeleton active>
                    <StartView
                        title="Set Up Your Wallet"
                        description="Create or import a wallet"
                    />
                </Skeleton>
            </SectionList.Item>
        </SectionList>
    </Page>
)

export default StartViewSkeleton
