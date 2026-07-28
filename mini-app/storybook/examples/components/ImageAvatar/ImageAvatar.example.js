import Page from "@components/Page"
import SectionList from "@components/SectionList"
import Cell from "@components/Cells"
import ImageAvatar from "@components/ImageAvatar"

import { getAssetIcon } from "@utils/AssetsMap"
import { BackButton } from "@lib/twa"

const ImageAvatarExample = () => (
    <>
        <BackButton />
        <Page>
            <SectionList>
                <SectionList.Item header="Shape">
                    <Cell start={<ImageAvatar src={getAssetIcon("TON")} />}>
                        <Cell.Text title="Circle" description="Default" />
                    </Cell>
                    <Cell
                        start={
                            <ImageAvatar
                                src={getAssetIcon("BTC")}
                                shape="rounded"
                            />
                        }
                    >
                        <Cell.Text title="Rounded" />
                    </Cell>
                </SectionList.Item>

                <SectionList.Item header="Size">
                    <Cell
                        start={
                            <ImageAvatar src={getAssetIcon("TON")} size={24} />
                        }
                    >
                        <Cell.Text title="24px" />
                    </Cell>
                    <Cell start={<ImageAvatar src={getAssetIcon("BTC")} />}>
                        <Cell.Text title="40px" description="Default" />
                    </Cell>
                    <Cell
                        start={
                            <ImageAvatar src={getAssetIcon("USDT")} size={56} />
                        }
                    >
                        <Cell.Text title="56px" />
                    </Cell>
                </SectionList.Item>

                <SectionList.Item header="Assets">
                    <Cell start={<ImageAvatar src={getAssetIcon("TON")} />}>
                        <Cell.Text title="Toncoin" />
                    </Cell>
                    <Cell start={<ImageAvatar src={getAssetIcon("BTC")} />}>
                        <Cell.Text title="Bitcoin" />
                    </Cell>
                    <Cell start={<ImageAvatar src={getAssetIcon("USDT")} />}>
                        <Cell.Text title="Tether" />
                    </Cell>
                    <Cell start={<ImageAvatar src={getAssetIcon("NOT")} />}>
                        <Cell.Text title="Notcoin" />
                    </Cell>
                </SectionList.Item>
            </SectionList>
        </Page>
    </>
)

export default ImageAvatarExample
