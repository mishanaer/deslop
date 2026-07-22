import { useState } from "react"

import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import Collapsible from "../Collapsible"

import { BackButton } from "../../lib/twa"

const CollapsibleShowcase = () => {
    const [open1, setOpen1] = useState(false)
    const [open2, setOpen2] = useState(false)

    return (
        <>
            <BackButton />
            <Page>
                <SectionList>
                    <SectionList.Item header="Default">
                        <Cell.Switch value={open1} onChange={setOpen1}>
                            <Cell.Text title="Toggle Content" />
                        </Cell.Switch>
                        <Collapsible open={open1}>
                            <Cell>
                                <Cell.Text
                                    title="Hidden Content"
                                    description="This content is revealed when the collapsible is open."
                                />
                            </Cell>
                            <Cell>
                                <Cell.Text title="Another Item" />
                            </Cell>
                        </Collapsible>
                    </SectionList.Item>

                    <SectionList.Item header="Slow Animation">
                        <Cell.Switch value={open2} onChange={setOpen2}>
                            <Cell.Text title="Toggle (500ms)" />
                        </Cell.Switch>
                        <Collapsible open={open2} duration={500}>
                            <Cell>
                                <Cell.Text
                                    title="Slow Reveal"
                                    description="This uses a 500ms animation duration."
                                />
                            </Cell>
                        </Collapsible>
                    </SectionList.Item>
                </SectionList>
            </Page>
        </>
    )
}

export default CollapsibleShowcase
