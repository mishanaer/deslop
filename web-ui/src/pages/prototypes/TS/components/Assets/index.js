import Cell from "../../../../../components/Cells"
import ImageAvatar from "../../../../../components/ImageAvatar"
import SectionList from "../../../../../components/SectionList"
import { getAssetIcon } from "../../../../../utils/AssetsMap"
import assets from "../../data/assets.json"

export default function Assets() {
    return (
        <SectionList.Item header="Assets">
            {assets.map((asset, index) => (
                <Cell
                    start={<ImageAvatar src={getAssetIcon(asset.ticker)} />}
                    end={<Cell.Text title={asset.value} />}
                    key={`tx-${index}`}
                >
                    <Cell.Text
                        title={asset.name}
                        description={asset.price}
                        bold
                    />
                </Cell>
            ))}
        </SectionList.Item>
    )
}
