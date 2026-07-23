import Page from "../Page"
import Table from "."

import { BackButton } from "../../lib/twa"

const TableShowcase = () => {
    return (
        <>
            <BackButton />
            <Page mode="primary">
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 24,
                        padding: "24px var(--side-padding)",
                    }}
                >
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
                            ["BTC", "$67k", "−1.4%"],
                        ]}
                    />

                    <Table
                        head={["Type", "Mass", "Horizon radius", "Example"]}
                        align={["left", "left", "right", "left"]}
                        rows={[
                            [
                                "Stellar",
                                "3 – 100 ☉",
                                "tens of km",
                                "Cygnus X-1",
                            ],
                            [
                                "Intermediate",
                                "100 – 100k ☉",
                                "thousands of km",
                                "—",
                            ],
                            [
                                "Supermassive",
                                "millions – billions ☉",
                                "Solar-System-sized",
                                "Sgr A*",
                            ],
                        ]}
                    />
                </div>
            </Page>
        </>
    )
}

export default TableShowcase
