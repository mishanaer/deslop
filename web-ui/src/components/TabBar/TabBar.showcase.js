import { useState } from "react"

import Page from "../Page"
import TabBar from "../TabBar"
import SectionList from "../SectionList"
import Cell from "../Cells"
import Picker from "../Picker"

import { BackButton } from "../../lib/twa"

import WalletIcon from "@deslop/primitives/icons/wallet.svg?react"
import ChartlineIcon from "@deslop/primitives/icons/bar-chart.svg?react"
import ClockIcon from "@deslop/primitives/icons/clock.svg?react"
import MagnifyIcon from "@deslop/primitives/icons/search.svg?react"

const allTabs = [
    { label: "Wallet", icon: <WalletIcon /> },
    { label: "Trade", icon: <ChartlineIcon /> },
    { label: "History", icon: <ClockIcon /> },
    { label: "Search", icon: <MagnifyIcon /> },
]

const tabCounts = ["2", "3", "4"]

const wrapperStyle = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    pointerEvents: "none",
}

const TabBarShowcase = () => {
    const [pickerIndex, setPickerIndex] = useState(0)
    const count = parseInt(tabCounts[pickerIndex], 10)
    const tabs = allTabs.slice(0, count)

    return (
        <>
            <BackButton />
            <Page>
                <SectionList>
                    <SectionList.Item>
                        <Cell
                            end={
                                <Cell.Part type="Picker">
                                    {tabCounts[pickerIndex]}
                                </Cell.Part>
                            }
                        >
                            <Cell.Text title="Number of tabs" />
                        </Cell>
                        <Picker
                            items={tabCounts}
                            onPickerIndex={setPickerIndex}
                        />
                    </SectionList.Item>
                </SectionList>
                <div style={wrapperStyle}>
                    <div style={{ pointerEvents: "auto" }}>
                        <TabBar tabs={tabs} />
                    </div>
                </div>
            </Page>
        </>
    )
}

export default TabBarShowcase
