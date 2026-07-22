import Page from "../../../src/components/Page"
import SectionList from "../../../src/components/SectionList"
import Cell from "../../../src/components/Cells"
import { BackButton } from "../../../src/lib/twa"
import { iconComponents } from "@deslop/primitives/icons-react"

import * as styles from "./Icons.module.scss"

const sortedIcons = Object.entries(iconComponents).toSorted(([a], [b]) =>
    a.localeCompare(b)
)

const IconsShowcase = () => (
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
                            <Cell.Text title={name} description="24 × 24" />
                        </Cell>
                    ))}
                </SectionList.Item>
            </SectionList>
        </Page>
    </>
)

export default IconsShowcase
