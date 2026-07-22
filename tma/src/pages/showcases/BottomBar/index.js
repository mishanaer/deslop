import { useRef, useState, useEffect } from "react"

import Page from "../../../components/Page"
import SectionList from "../../../components/SectionList"
import Cell from "../../../components/Cells"

import WebApp, { BackButton } from "../../../lib/twa"
import { getTmaColor } from "../../../theme/colors"

import Picker from "../../../components/Picker"
import Collapsible from "../../../components/Collapsible"
const getDefaultColor = (telegramColor, token) =>
    (telegramColor || getTmaColor(token)).toUpperCase()

const BottomBar = () => {
    const [label, setLabel] = useState("")
    const [labelSecondary, setLabelSecondary] = useState("")

    const MainButton = WebApp.MainButton
    const SecondaryButton = WebApp.SecondaryButton

    const setMainButton = (buttonLabel) => {
        setLabel(buttonLabel)
        if (buttonLabel) {
            MainButton.setText(buttonLabel)
            MainButton.show()
        } else {
            MainButton.hide()
        }
    }

    const setSecondaryButton = (buttonLabel) => {
        setLabelSecondary(buttonLabel)
        if (buttonLabel) {
            SecondaryButton.setText(buttonLabel)
            SecondaryButton.show()
        } else {
            SecondaryButton.hide()
        }
    }

    const [pickerIndex, setPickerValue] = useState(0)

    const position = ["Left", "Top", "Right", "Bottom"]

    const handlePickerIndex = (page) => {
        SecondaryButton.setParams({ position: position[page].toLowerCase() })
        setPickerValue(page)
    }

    const [shine, setShine] = useState(false)

    const handleShineChange = (value) => {
        setShine(value)
        MainButton.setParams({ has_shine_effect: value })
    }

    useEffect(() => {
        const handleBack = () => {
            MainButton.hide()
            SecondaryButton.hide()
        }
        WebApp.onEvent("backButtonClicked", handleBack)
        return () => {
            WebApp.offEvent("backButtonClicked", handleBack)
            MainButton.hide()
            SecondaryButton.hide()
        }
    }, [MainButton, SecondaryButton])

    const colorInputRef = useRef(null)
    const textColorInputRef = useRef(null)
    const [buttonBgColorOverride, setButtonBgColor] = useState(null)
    const [textColorOverride, setTextColor] = useState(null)
    const buttonBgColor =
        buttonBgColorOverride ??
        getDefaultColor(null, "action-primary-background")
    const textColor =
        textColorOverride ??
        getDefaultColor(null, "action-primary-foreground")

    const handleColorClick = () => {
        colorInputRef.current.click()
    }
    const handleTextColorClick = () => {
        textColorInputRef.current.click()
    }

    const handleButtonBgColorChange = (event) => {
        const color = event.target.value.toUpperCase()
        setButtonBgColor(color)
        WebApp.MainButton.setParams({ color: color })
    }
    const handleTextColorChange = (event) => {
        const color = event.target.value.toUpperCase()
        setTextColor(color)
        WebApp.MainButton.setParams({ text_color: color })
    }

    return (
        <Page>
            <BackButton />
            <SectionList>
                <SectionList.Item header="Bottom Bar">
                    <Cell>
                        <Cell.Editable
                            label="Main Button Label"
                            value={label}
                            onChange={setMainButton}
                            onClear={() => {
                                setLabel("")
                                WebApp.MainButton.hide()
                            }}
                            autoFocus
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                        />
                    </Cell>
                    <Cell>
                        <Cell.Editable
                            label="Secondary Button Label"
                            value={labelSecondary}
                            onChange={setSecondaryButton}
                            onClear={() => {
                                setLabelSecondary("")
                                WebApp.SecondaryButton.hide()
                            }}
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                        />
                    </Cell>
                </SectionList.Item>
                <Collapsible open={!!label}>
                    <SectionList.Item header={"Main Button"}>
                        <Cell
                            onClick={handleColorClick}
                            end={
                                <Cell.Part
                                    type="ColorPicker"
                                    value={buttonBgColor}
                                    onChange={handleButtonBgColorChange}
                                    inputRef={colorInputRef}
                                    id="main-button-color"
                                />
                            }
                        >
                            <Cell.Text title="Background Color" />
                        </Cell>
                        <Cell
                            onClick={handleTextColorClick}
                            end={
                                <Cell.Part
                                    type="ColorPicker"
                                    value={textColor}
                                    onChange={handleTextColorChange}
                                    inputRef={textColorInputRef}
                                    id="main-button-text-color"
                                />
                            }
                        >
                            <Cell.Text title="Text Color" />
                        </Cell>
                        <Cell.Switch value={shine} onChange={handleShineChange}>
                            <Cell.Text title="Shine Effect" />
                        </Cell.Switch>
                    </SectionList.Item>
                </Collapsible>
                <Collapsible open={!!labelSecondary}>
                    <SectionList.Item header={"Secondary Button"}>
                        <Cell
                            end={
                                <Cell.Part type="Picker">
                                    {position[pickerIndex]}
                                </Cell.Part>
                            }
                        >
                            <Cell.Text title="Button Position" />
                        </Cell>
                        <Picker
                            items={position}
                            onPickerIndex={handlePickerIndex}
                        />
                    </SectionList.Item>
                </Collapsible>
            </SectionList>
        </Page>
    )
}

export default BottomBar
