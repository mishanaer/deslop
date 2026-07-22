import Cell from "../../../../../components/Cells"
import SectionList from "../../../../../components/SectionList"
import activityItems from "../../data/activity.json"

export default function Activity() {
    return (
        <SectionList.Item header="Activity">
            {activityItems.map((item, index) => (
                <Cell
                    start={<Cell.Start type="Icon" />}
                    end={
                        <Cell.Text
                            title={item.amount}
                            description={item.time}
                        />
                    }
                    key={`tx-${index}`}
                >
                    <Cell.Text
                        title={item.name}
                        description={item.address}
                        bold
                    />
                </Cell>
            ))}
            <Cell end={<Cell.Part type="Chevron" />}>
                <Cell.Text title="Show All" />
            </Cell>
        </SectionList.Item>
    )
}
