import Page from "../../../../components/Page"
import SectionList from "../../../../components/SectionList"
import Cell from "../../../../components/Cells"

import txHistory from "../../Wallet/data/transactions.json"

function TransactionList() {
    return (
        <Page>
            <SectionList>
                <SectionList.Item header="Transaction History">
                    {txHistory.map((tx, index) => (
                        <Cell
                            start={<Cell.Start type="Icon" />}
                            end={
                                <Cell.Text
                                    title={tx.value}
                                    description={tx.status}
                                />
                            }
                            key={`tx-${index}`}
                        >
                            <Cell.Text
                                title={tx.name}
                                description={tx.date}
                                bold
                            />
                        </Cell>
                    ))}
                </SectionList.Item>
            </SectionList>
        </Page>
    )
}

export default TransactionList
