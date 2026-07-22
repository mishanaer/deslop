import { Suspense, lazy } from "react"

import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"

import useModal from "../../hooks/useModal"
const Modals = lazy(() => import("./Modals"))

import { BackButton } from "../../lib/twa"

const ModalPages = () => {
    const { modals, handlers } = useModal({
        tray: false,
        simple: false,
    })

    return (
        <>
            <Page>
                <BackButton />
                <SectionList>
                    <SectionList.Item>
                        <Cell onClick={handlers.tray.open}>
                            <Cell.Text
                                type="Accent"
                                title="Open Dynamic Tray"
                            />
                        </Cell>
                        <Cell onClick={handlers.simple.open}>
                            <Cell.Text
                                type="Accent"
                                title="Open Simple Modal"
                            />
                        </Cell>
                    </SectionList.Item>
                </SectionList>
            </Page>
            <Suspense>
                <Modals modals={modals} handlers={handlers} />
            </Suspense>
        </>
    )
}

export default ModalPages
