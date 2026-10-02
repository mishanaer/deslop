import { useState } from "react"
import SegmentedControl from "@components/SegmentedControl"
import Page from "@components/Page"
import SectionList from "@components/SectionList"
import Cell from "@components/Cells"
import { BackButton } from "@lib/twa"
import { iconComponents } from "@primitives/icons-react"

import * as styles from "./Icons.module.css"

const sortedIcons = Object.entries(iconComponents).toSorted(([a], [b]) =>
    a.localeCompare(b)
)

const IconsExample = () => {
    const [shape, setShape] = useState("round")
    const [variant, setVariant] = useState("line")
    return (
        <>
            <BackButton />
            <Page>
                <SectionList>
                    <SectionList.Item header="Style">
                        <SegmentedControl
                            segments={["Round", "Sharp"]}
                            onChange={(index) =>
                                setShape(index ? "sharp" : "round")
                            }
                        />
                        <SegmentedControl
                            segments={["Line", "Solid"]}
                            onChange={(index) =>
                                setVariant(index ? "solid" : "line")
                            }
                        />
                    </SectionList.Item>
                    <SectionList.Item header={`Icons · ${sortedIcons.length}`}>
                        {sortedIcons.map(([name, Icon]) => (
                            <Cell
                                key={name}
                                start={
                                    <span className={styles.iconPlate}>
                                        <Icon
                                            shape={shape}
                                            variant={variant}
                                            className={styles.icon}
                                            aria-hidden="true"
                                            focusable="false"
                                        />
                                    </span>
                                }
                            >
                                <Cell.Text
                                    title={name}
                                    description={`${shape} · ${variant} · 24px`}
                                />
                            </Cell>
                        ))}
                    </SectionList.Item>
                </SectionList>
            </Page>
        </>
    )
}

export default IconsExample
