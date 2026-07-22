import Page from "../Page"
import SectionList from "../SectionList"
import Text from "."
import Skeleton from "../Skeleton"

import * as styles from "./Text.skeleton.module.scss"

// Typographic specimen placeholder: redacted lines across the same variants the
// Text screen showcases, at varied widths so the shimmer reads as real copy
// rather than identical blocks. Each mock string sets its bar's width.
const SAMPLES = [
    { variant: "title1", text: "The quick brown fox" },
    { variant: "title2", text: "Jumps over the lazy dog" },
    { variant: "title3", text: "Pack my box with liquor jugs" },
    { variant: "body", text: "How vexingly quick daft zebras leap the fence" },
    { variant: "callout", text: "Sphinx of black quartz, judge my vow" },
    { variant: "footnote", text: "The five boxing wizards jump quickly at dawn" },
    { variant: "caption1", text: "Waltz, bad nymph, for quick jigs" },
]

const TextSkeleton = () => (
    <Page>
        <SectionList>
            <SectionList.Item header="Preview">
                <Skeleton active>
                    <div className={styles.stack}>
                        {SAMPLES.map(({ variant, text }) => (
                            <Text key={variant} variant={variant}>
                                {text}
                            </Text>
                        ))}
                    </div>
                </Skeleton>
            </SectionList.Item>
        </SectionList>
    </Page>
)

export default TextSkeleton
