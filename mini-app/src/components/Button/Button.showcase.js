import Page from "../Page"
import SectionList from "../SectionList"
import { RegularButton, MultilineButton } from "../Button"

import { BackButton } from "../../lib/twa"

import ArrowUpIcon from "@deslop/primitives/icons/arrow-up.svg?react"
import PlusIcon from "@deslop/primitives/icons/plus.svg?react"

const ButtonShowcase = () => (
    <>
        <BackButton />
        <Page>
            <SectionList>
                <SectionList.Item header="Regular Button">
                    <div
                        style={{
                            padding: "12px var(--side-padding)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                        }}
                    >
                        <RegularButton variant="filled" label="Filled" />
                        <RegularButton
                            variant="filled"
                            label="Filled Shine"
                            isShine
                        />
                        <RegularButton variant="outlined" label="Outlined" />
                    </div>
                </SectionList.Item>

                <SectionList.Item header="Multiline Button">
                    <div
                        style={{
                            padding: "12px var(--side-padding)",
                            display: "flex",
                            gap: 12,
                        }}
                    >
                        <MultilineButton
                            variant="filled"
                            icon={<ArrowUpIcon />}
                            label="Send"
                        />
                        <MultilineButton
                            variant="filled"
                            icon={<PlusIcon />}
                            label="Add"
                        />
                        <MultilineButton
                            variant="plain"
                            icon={<ArrowUpIcon />}
                            label="Plain"
                        />
                    </div>
                </SectionList.Item>
            </SectionList>
        </Page>
    </>
)

export default ButtonShowcase
