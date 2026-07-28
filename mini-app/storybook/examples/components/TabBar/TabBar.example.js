import { useState } from "react"

import Page from "@components/Page"
import TabBar from "@components/TabBar"
import SectionList from "@components/SectionList"
import Cell from "@components/Cells"
import Picker from "@components/Picker"

import { BackButton } from "@lib/twa"

import {
    IconChart as ChartlineIcon,
    IconClock as ClockIcon,
    IconSearch as MagnifyIcon,
    IconWallet as WalletIcon,
} from "@primitives/material-symbols-react"

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

const TabBarExample = () => {
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

export default TabBarExample
