import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import ImageAvatar from "../ImageAvatar"
import Skeleton from "../Skeleton"

// Suspense fallback for the Image Avatar showcase. Mirrors
// ImageAvatar.showcase.js section by section so the lazy chunk swaps in
// without the list shifting. Section headers stay solid (SectionList.Item
// renders `header` outside the provider); avatars and labels redact into
// shimmer bars. Avatar sizes/shapes match the real rows exactly, and the
// varied mock labels give each bar a realistic width.
const ImageAvatarSkeleton = () => (
    <Page>
        <SectionList>
            <SectionList.Item header="Shape">
                <Skeleton active>
                    <Cell start={<ImageAvatar />}>
                        <Cell.Text title="Circle" description="Default" />
                    </Cell>
                    <Cell start={<ImageAvatar shape="rounded" />}>
                        <Cell.Text title="Rounded" />
                    </Cell>
                </Skeleton>
            </SectionList.Item>

            <SectionList.Item header="Size">
                <Skeleton active>
                    <Cell start={<ImageAvatar size={24} />}>
                        <Cell.Text title="24px" />
                    </Cell>
                    <Cell start={<ImageAvatar />}>
                        <Cell.Text title="40px" description="Default" />
                    </Cell>
                    <Cell start={<ImageAvatar size={56} />}>
                        <Cell.Text title="56px" />
                    </Cell>
                </Skeleton>
            </SectionList.Item>

            <SectionList.Item header="Assets">
                <Skeleton active>
                    <Cell start={<ImageAvatar />}>
                        <Cell.Text title="Toncoin" />
                    </Cell>
                    <Cell start={<ImageAvatar />}>
                        <Cell.Text title="Bitcoin" />
                    </Cell>
                    <Cell start={<ImageAvatar />}>
                        <Cell.Text title="Tether" />
                    </Cell>
                    <Cell start={<ImageAvatar />}>
                        <Cell.Text title="Notcoin" />
                    </Cell>
                </Skeleton>
            </SectionList.Item>
        </SectionList>
    </Page>
)

export default ImageAvatarSkeleton
