import { useState, useRef } from "react"

import Page from "../../../components/Page"
import SectionList from "../../../components/SectionList"
import Cell from "../../../components/Cells"

import WebApp, { BackButton } from "../../../lib/twa"
import { getMiniAppColor } from "../../../theme/colors"

const NavigationBar = () => {
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isVisibleBackButton, setBackButton] = useState(true)
    const [isSettingsButtonAvailable, setSettingsButtonAvailable] =
        useState(false)
    const [headerColor, setHeaderColor] = useState(() => {
        const color = getMiniAppColor("background-secondary")
        return color.toUpperCase()
    })
    const colorInputRef = useRef(null)

    const handleColorClick = () => {
        colorInputRef.current.click()
    }

    const handleColorChange = (event) => {
        let color = event.target.value.toUpperCase()
        setHeaderColor(color)
        WebApp.setHeaderColor(color)
    }

    return (
        <Page>
            <BackButton />
            <SectionList>
                <SectionList.Item header="Navigation Bar">
                    <Cell
                        onClick={handleColorClick}
                        end={
                            <Cell.Part
                                type="ColorPicker"
                                value={headerColor}
                                onChange={handleColorChange}
                                inputRef={colorInputRef}
                                id="header-color"
                            />
                        }
                    >
                        <Cell.Text title="Header Color" />
                    </Cell>
                    <Cell.Switch
                        value={isVisibleBackButton}
                        onChange={(checked) => {
                            if (checked) {
                                setBackButton(true)
                                WebApp.BackButton.show()
                            } else {
                                setBackButton(false)
                                WebApp.BackButton.hide()
                            }
                        }}
                    >
                        <Cell.Text title="Back Button" />
                    </Cell.Switch>
                    <Cell.Switch
                        value={isFullscreen}
                        onChange={(checked) => {
                            if (checked) {
                                setIsFullscreen(true)
                                WebApp.requestFullscreen()
                            } else {
                                setIsFullscreen(false)
                                WebApp.exitFullscreen()
                            }
                        }}
                    >
                        <Cell.Text title="Fullscreen" />
                    </Cell.Switch>
                    <Cell.Switch
                        value={isSettingsButtonAvailable}
                        onChange={(checked) => {
                            if (checked) {
                                setSettingsButtonAvailable(true)
                                WebApp.SettingsButton.show()
                            } else {
                                setSettingsButtonAvailable(false)
                                WebApp.SettingsButton.hide()
                            }
                        }}
                    >
                        <Cell.Text title="Settings Button" />
                    </Cell.Switch>
                </SectionList.Item>
            </SectionList>
        </Page>
    )
}

export default NavigationBar
