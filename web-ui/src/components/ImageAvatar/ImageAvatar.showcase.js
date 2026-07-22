import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import ImageAvatar from "../ImageAvatar"

import { getAssetIcon } from "../../utils/AssetsMap"
import { BackButton } from "../../lib/twa"

const ImageAvatarShowcase = () => (
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

export default ImageAvatarShowcase
