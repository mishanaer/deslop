import Page from "../Page"
import Table from "."
import Skeleton from "../Skeleton"

import * as styles from "./Table.skeleton.module.scss"

// Reuses the real Table primitive with mock data. Wrapping in Skeleton redacts
// every header and cell <Text> into shimmer bars while the table borders and
// column grid stay solid, so the placeholder is column-aligned like the loaded
// table. Varied mock lengths give the bars realistic per-column widths.
const TableSkeleton = () => (
    <Page mode="primary">
        <Skeleton active>
            <div className={styles.stack}>
                <Table
                    head={["Property", "Value"]}
                    rows={[
                        ["Name", "Telegram"],
                        ["Network", "TON"],
                        ["Balance", "1,240.50"],
                    ]}
                />

                <Table
                    head={["Coin", "Price", "24h"]}
                    align={["left", "right", "right"]}
                    rows={[
                        ["TON", "$5.20", "+2.1%"],
                        ["USDT", "$1.00", "0.0%"],
                        ["BTC", "$67k", "-1.4%"],
                    ]}
                />

                <Table
                    head={["Type", "Mass", "Horizon radius", "Example"]}
                    align={["left", "left", "right", "left"]}
                    rows={[
                        ["Stellar", "3 - 100", "tens of km", "Cygnus X-1"],
                        ["Intermediate", "100 - 100k", "thousands of km", "-"],
                        ["Supermassive", "millions", "system-sized", "Sgr A*"],
                    ]}
                />
            </div>
        </Skeleton>
    </Page>
)

export default TableSkeleton
