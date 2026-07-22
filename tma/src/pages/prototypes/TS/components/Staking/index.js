import Cell from "../../../../../components/Cells"
import SectionList from "../../../../../components/SectionList"

export default function Staking() {
    const assets = [
        {
            name: "Staking",
            subtitle: "APY up to 4.50%",
        },
    ]

    return (
        <SectionList.Item>
            {assets.map((asset, index) => (
                <Cell
                    start={<Cell.Start type="Icon" />}
                    end={<Cell.Part type="Chevron" />}
                    key={`tx-${index}`}
                >
                    <Cell.Text
                        title={asset.name}
                        description={asset.subtitle}
                        bold
                    />
                </Cell>
            ))}
        </SectionList.Item>
    )
}
