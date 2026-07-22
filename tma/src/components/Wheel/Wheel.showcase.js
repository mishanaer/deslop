import { useState } from "react"

import * as styles from "./Wheel.showcase.module.scss"

import Page from "../Page"
import SectionList from "../SectionList"
import Wheel from "../Wheel"
import Cell from "../Cells"

import { BackButton } from "../../lib/twa"

const WheelPage = () => {
    const [wheelValue, setWheelValue] = useState(20)
    const [controlledValue, setControlledValue] = useState(10)

    const handleWheelChange = (value) => {
        setWheelValue(value)
    }

    const handleControlledChange = (value) => {
        setControlledValue(value)
    }

    return (
        <>
            <BackButton />
            <Page>
                <SectionList>
                    {/* Uncontrolled Wheel Example */}
                    <SectionList.Item>
                        <Cell>
                            <Cell.Text
                                title="Uncontrolled Wheel"
                                subtitle={`Current value: ${wheelValue}`}
                            />
                        </Cell>
                        <div className={styles.wheelWrapper}>
                            <Wheel
                                defaultValue={20}
                                max={40}
                                onChange={handleWheelChange}
                            />
                        </div>
                    </SectionList.Item>

                    {/* Controlled Wheel Example */}
                    <SectionList.Item>
                        <Cell>
                            <Cell.Text
                                title="Controlled Wheel"
                                subtitle={`Current value: ${controlledValue}`}
                            />
                        </Cell>
                        <div className={styles.wheelWrapper}>
                            <Wheel
                                value={controlledValue}
                                max={30}
                                onChange={handleControlledChange}
                            />
                        </div>
                    </SectionList.Item>

                    {/* Custom Formatter Example */}
                    <SectionList.Item>
                        <Cell>
                            <Cell.Text
                                title="Custom Formatter"
                                subtitle="Displaying as percentage"
                            />
                        </Cell>
                        <div className={styles.wheelWrapper}>
                            <Wheel defaultValue={50} max={100} suffix="%" />
                        </div>
                    </SectionList.Item>

                    {/* Disabled Wheel Example */}
                    <SectionList.Item>
                        <Cell>
                            <Cell.Text
                                title="Disabled Wheel"
                                subtitle="Interaction disabled"
                            />
                        </Cell>
                        <div className={styles.wheelWrapper}>
                            <Wheel defaultValue={15} max={40} disabled />
                        </div>
                    </SectionList.Item>
                </SectionList>
            </Page>
        </>
    )
}

export default WheelPage
