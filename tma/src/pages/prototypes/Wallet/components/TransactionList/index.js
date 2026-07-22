import * as styles from "./TransactionList.module.scss"
import SectionList from "../../../../../components/SectionList"
import Cell from "../../../../../components/Cells"
import txHistory from "../../data/transactions.json"

export default function TransactionList() {
    return (
        <SectionList.Item
            header="Transaction History"
            description="Section Description"
            className={styles.transactions}
        >
            {txHistory.map((tx, index) => (
                <Cell
                    start={<Cell.Start type="Icon" />}
                    end={<Cell.Text title={tx.value} description={tx.status} />}
                    key={`tx-${index}`}
                >
                    <Cell.Text title={tx.name} description={tx.date} bold />
                </Cell>
            ))}
        </SectionList.Item>
    )
}
