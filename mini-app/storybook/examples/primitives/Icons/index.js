import Page from "@components/Page"
import SectionList from "@components/SectionList"
import Cell from "@components/Cells"
import { BackButton } from "@lib/twa"
import { materialSymbolComponents } from "@primitives/material-symbols-react"

import * as styles from "./Icons.module.css"

const sortedIcons = Object.entries(materialSymbolComponents).toSorted(([a], [b]) =>
    a.localeCompare(b)
)

const IconsExample = () => (
    <>
        <BackButton />
        <Page>
            <SectionList>
                <SectionList.Item header={`Icons · ${sortedIcons.length}`}>
                    {sortedIcons.map(([name, Icon]) => (
                        <Cell
                            key={name}
                            start={
                                <span className={styles.iconPlate}>
                                    <Icon
                                        className={styles.icon}
                                        aria-hidden="true"
                                        focusable="false"
                                    />
                                </span>
                            }
                        >
                            <Cell.Text
                                title={name}
                                description="Material Symbols · Rounded · 24px"
                            />
                        </Cell>
                    ))}
                </SectionList.Item>
            </SectionList>
        </Page>
    </>
)

export default IconsExample
