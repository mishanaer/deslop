import { useState, useRef } from "react"

import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import ImageAvatar from "../ImageAvatar"
import InitialsAvatar from "../InitialsAvatar"
import DropdownMenu from "../DropdownMenu"

import { getAssetIcon } from "../../utils/AssetsMap"
import { BackButton } from "../../lib/twa"
import { getColorToken } from "@deslop/primitives/colors"

const CellsShowcase = () => {
    const [switchValue, setSwitchValue] = useState(true)
    const [disabledSwitch, setDisabledSwitch] = useState(false)
    const [editableValue, setEditableValue] = useState("")
    const [pickerIndex] = useState(0)
    const [headerColor, setHeaderColor] = useState(() =>
        getColorToken("accent-blue")
    )
    const colorInputRef = useRef(null)

    const pickerOptions = ["English", "Russian", "Japanese"]

    return (
        <>
            <BackButton />
            <Page>
                <SectionList>
                    <SectionList.Item header="Text">
                        <Cell>
                            <Cell.Text title="Title Only" />
                        </Cell>
                        <Cell>
                            <Cell.Text
                                title="Title with Subtitle"
                                description="Description text"
                            />
                        </Cell>
                        <Cell>
                            <Cell.Text title="Bold Title" bold />
                        </Cell>
                        <Cell>
                            <Cell.Text
                                title="Bold with Subtitle"
                                description="Description text"
                                bold
                            />
                        </Cell>
                        <Cell>
                            <Cell.Text type="Accent" title="Accent Text" />
                        </Cell>
                    </SectionList.Item>

                    <SectionList.Item header="Start">
                        <Cell start={<ImageAvatar src={getAssetIcon("TON")} />}>
                            <Cell.Text
                                title="Toncoin"
                                description="100 TON"
                                bold
                            />
                        </Cell>
                        <Cell start={<ImageAvatar src={getAssetIcon("BTC")} />}>
                            <Cell.Text
                                title="Bitcoin"
                                description="0.001 BTC"
                                bold
                            />
                        </Cell>
                        <Cell
                            start={
                                <InitialsAvatar
                                    userId={1}
                                    name="Ilya Grishin"
                                />
                            }
                        >
                            <Cell.Text
                                title="Ilya Grishin"
                                description="Contact"
                                bold
                            />
                        </Cell>
                        <Cell start={<Cell.Start type="Icon" />}>
                            <Cell.Text title="Default Icon" />
                        </Cell>
                        <Cell
                            start={
                                <Cell.Start
                                    type="Image"
                                    src={getAssetIcon("USDT")}
                                />
                            }
                        >
                            <Cell.Text title="Cell.Start Image" />
                        </Cell>
                    </SectionList.Item>

                    <SectionList.Item header="End">
                        <Cell end={<Cell.Part type="Chevron" />}>
                            <Cell.Text title="Chevron" />
                        </Cell>
                        <Cell
                            end={
                                <Cell.Text
                                    title="$150.00"
                                    description="Received"
                                />
                            }
                        >
                            <Cell.Text
                                title="Transfer"
                                description="Today"
                                bold
                            />
                        </Cell>
                        <Cell
                            end={
                                <Cell.Part type="Picker">
                                    {pickerOptions[pickerIndex]}
                                </Cell.Part>
                            }
                        >
                            <Cell.Text title="Language" />
                        </Cell>
                        <Cell
                            end={
                                <Cell.Part type="Dropdown">
                                    <DropdownMenu items={pickerOptions} />
                                </Cell.Part>
                            }
                        >
                            <Cell.Text title="Dropdown" />
                        </Cell>
                        <Cell
                            onClick={() => colorInputRef.current?.click()}
                            end={
                                <Cell.Part
                                    type="ColorPicker"
                                    value={headerColor}
                                    onChange={(e) =>
                                        setHeaderColor(
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    inputRef={colorInputRef}
                                    id="showcase-color"
                                />
                            }
                        >
                            <Cell.Text title="Color Picker" />
                        </Cell>
                    </SectionList.Item>

                    <SectionList.Item header="Switch">
                        <Cell.Switch
                            value={switchValue}
                            onChange={setSwitchValue}
                        >
                            <Cell.Text title="Enabled" />
                        </Cell.Switch>
                        <Cell.Switch
                            value={disabledSwitch}
                            onChange={setDisabledSwitch}
                            disabled
                        >
                            <Cell.Text title="Disabled" />
                        </Cell.Switch>
                    </SectionList.Item>

                    <SectionList.Item header="Editable">
                        <Cell>
                            <Cell.Editable
                                label="Enter text"
                                value={editableValue}
                                onChange={setEditableValue}
                                onClear={() => setEditableValue("")}
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck={false}
                            />
                        </Cell>
                        <Cell>
                            <Cell.Editable
                                label="Read-only"
                                value="Cannot edit"
                            />
                        </Cell>
                    </SectionList.Item>

                    <SectionList.Item header="Triple">
                        <Cell
                            start={
                                <InitialsAvatar
                                    userId={3}
                                    name="Thomas Andersson"
                                />
                            }
                            end={<Cell.End label="+2.46" />}
                        >
                            <Cell.Text
                                title="Thomas Andersson"
                                description="Incoming transfer"
                                caption="Mar 22 at 23:39"
                                bold
                            />
                        </Cell>
                        <Cell
                            start={<ImageAvatar src={getAssetIcon("TON")} />}
                            end={<Cell.End label="-100 TON" caption="$32.33" />}
                        >
                            <Cell.Text
                                title="Outgoing transfer"
                                description="To Alice"
                                caption="Yesterday at 14:02"
                                bold
                            />
                        </Cell>
                    </SectionList.Item>

                    <SectionList.Item header="Combined">
                        <Cell
                            start={<ImageAvatar src={getAssetIcon("TON")} />}
                            end={<Cell.Part type="Chevron" />}
                        >
                            <Cell.Text
                                title="Toncoin"
                                description="100 TON"
                                bold
                            />
                        </Cell>
                        <Cell
                            start={<InitialsAvatar userId={2} name="Alice" />}
                            end={
                                <Cell.Text
                                    title="$50.00"
                                    description="Pending"
                                />
                            }
                        >
                            <Cell.Text
                                title="Alice"
                                description="Transfer"
                                bold
                            />
                        </Cell>
                    </SectionList.Item>
                </SectionList>
            </Page>
        </>
    )
}

export default CellsShowcase
