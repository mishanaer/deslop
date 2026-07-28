import { BackButton } from "@lib/twa"
import Page from "@components/Page"
import SectionList from "@components/SectionList"
import Cell from "@components/Cells"
import ImageAvatar from "@components/ImageAvatar"
import { getAssetIcon } from "@utils/AssetsMap"

import CellStack from "@components/CellStack"

const CellStackExample = () => (
    <>
        <BackButton />
        <Page>
            <SectionList>
                <SectionList.Item>
                    <Cell
                        start={<ImageAvatar src={getAssetIcon("USDT")} />}
                        end={<Cell.Text title="$50.00" />}
                    >
                        <Cell.Text title="Dollars" description="50 USDT" bold />
                    </Cell>
                </SectionList.Item>

                <CellStack>
                    <CellStack.Morph>
                        <Cell
                            start={<ImageAvatar src={getAssetIcon("BTC")} />}
                            end={<Cell.Text title="$201.92" />}
                        >
                            <Cell.Text title="More Assets" bold />
                        </Cell>
                        <Cell
                            start={<ImageAvatar src={getAssetIcon("TON")} />}
                            end={<Cell.Text title="$150.00" />}
                        >
                            <Cell.Text
                                title="Toncoin"
                                description="100 TON"
                                bold
                            />
                        </Cell>
                    </CellStack.Morph>

                    {["Bitcoin", "1 Bitcoin", "2 Bitcoin"].map((name) => (
                        <Cell
                            key={name}
                            start={<ImageAvatar src={getAssetIcon("BTC")} />}
                            end={<Cell.Text title="$50.64" />}
                        >
                            <Cell.Text
                                title={name}
                                description="0.000011 BTC"
                                bold
                            />
                        </Cell>
                    ))}
                </CellStack>
            </SectionList>
        </Page>
    </>
)

export default CellStackExample
