import { useState } from "react"

import Page from "@components/Page"
import SectionList from "@components/SectionList"
import Picker from "@components/Picker"
import Cell from "@components/Cells"

import { BackButton } from "@lib/twa"

const PickerPage = () => {
    const [pickerIndex, setPickerValue] = useState(0)

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    const handlePickerIndex = (page) => {
        setPickerValue(page)
    }

    return (
        <>
            <BackButton />
            <Page>
                <SectionList>
                    <SectionList.Item>
                        <Cell
                            end={
                                <Cell.Part type="Picker">
                                    {months[pickerIndex]}
                                </Cell.Part>
                            }
                        >
                            <Cell.Text title="Picker" />
                        </Cell>
                        <Picker
                            items={months}
                            onPickerIndex={handlePickerIndex}
                        />
                    </SectionList.Item>
                </SectionList>
            </Page>
        </>
    )
}

export default PickerPage
