import Page from "../Page"
import SectionList from "../SectionList"
import Text from "../Text"
import Skeleton from "../Skeleton"

import * as styles from "./Calligraph.skeleton.module.css"

// Restrained stand-in for the Calligraph text/number morph: centered bars in
// the same stage region as the live glyphs. It does not animate the roll or
// slide — just holds the shape while the chunk loads.
const REGIONS = [
    {
        header: "Text — shared characters slide, the rest fade",
        value: "Swap tokens",
    },
    { header: "Number — rolling vertical digits", value: "1234.56" },
]

const CalligraphSkeleton = () => (
    <Page>
        <SectionList>
            {REGIONS.map(({ header, value }) => (
                <SectionList.Item key={header} header={header}>
                    <div className={styles.stage}>
                        <Skeleton active>
                            <Text variant="title1" weight="bold">
                                {value}
                            </Text>
                        </Skeleton>
                    </div>
                </SectionList.Item>
            ))}
        </SectionList>
    </Page>
)

export default CalligraphSkeleton
