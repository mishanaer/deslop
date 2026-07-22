import { useState } from "react"

import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import Switch from "../Switch"

import { BackButton } from "../../lib/twa"

const SwitchShowcase = () => {
    const [controlled, setControlled] = useState(true)

    return (
        <>
            <BackButton />
            <Page>
                <SectionList>
                    <SectionList.Item header="States">
                        <Cell.Switch
                            value={controlled}
                            onChange={setControlled}
                        >
                            <Cell.Text title="Controlled" />
                        </Cell.Switch>
                        <Cell.Switch defaultValue={false}>
                            <Cell.Text title="Uncontrolled" />
                        </Cell.Switch>
                    </SectionList.Item>

                    <SectionList.Item header="Disabled">
                        <Cell.Switch value={true} disabled>
                            <Cell.Text title="Disabled On" />
                        </Cell.Switch>
                        <Cell.Switch value={false} disabled>
                            <Cell.Text title="Disabled Off" />
                        </Cell.Switch>
                    </SectionList.Item>

                    <SectionList.Item header="Standalone">
                        <div
                            style={{
                                padding: "12px var(--side-padding)",
                                display: "flex",
                                gap: 16,
                            }}
                        >
                            <Switch value={true} />
                            <Switch value={false} />
                            <Switch disabled value={true} />
                        </div>
                    </SectionList.Item>
                </SectionList>
            </Page>
        </>
    )
}

export default SwitchShowcase
