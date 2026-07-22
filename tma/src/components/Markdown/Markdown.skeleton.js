import PropTypes from "prop-types"

import Page from "../Page"
import Text from "../Text"
import Skeleton, { SkeletonBlock } from "../Skeleton"

import * as styles from "./Markdown.skeleton.module.css"

// Paragraph line: mirrors Markdown's own <p> variant mapping so the loading
// bars land at the article's real body size.
const Line = ({ text }) => (
    <Text
        as="p"
        variant="callout"
        weight="regular"
    >
        {text}
    </Text>
)
Line.propTypes = { text: PropTypes.string }

// Varied-length filler so each stacked bar takes a different width, like real
// wrapped prose ending on a short final line.
const INTRO = [
    "A black hole is a region of spacetime where gravity pulls",
    "so hard that nothing, not even light, can escape once it",
    "slips past the edge.",
]
const BODY = [
    "They form when a massive star runs out of fuel and",
    "collapses under its own weight.",
]
const LIST = [
    "The central singularity of infinite density",
    "The event horizon, a point of no return",
    "A disk of superheated infalling gas",
]
const QUOTE = [
    "A black hole has no hair: once formed it is described",
    "by just three numbers, mass, charge, and spin.",
]

const MarkdownSkeleton = () => (
    <Page mode="primary">
        <Skeleton active>
            <div className={styles.doc}>
                <Text
                    as="h1"
                    variant="title1"
                    weight="bold"
                >
                    Black holes
                </Text>

                <div className={styles.lines}>
                    {INTRO.map((text) => (
                        <Line key={text} text={text} />
                    ))}
                </div>

                <SkeletonBlock className={styles.image} />

                <Text
                    as="h2"
                    variant="title2"
                    weight="bold"
                >
                    Anatomy
                </Text>

                <div className={styles.lines}>
                    {BODY.map((text) => (
                        <Line key={text} text={text} />
                    ))}
                </div>

                <ul className={styles.list}>
                    {LIST.map((text) => (
                        <Text
                            key={text}
                            as="li"
                            variant="callout"
                            weight="regular"
                        >
                            {text}
                        </Text>
                    ))}
                </ul>

                <div className={styles.quote}>
                    {QUOTE.map((text) => (
                        <Line key={text} text={text} />
                    ))}
                </div>
            </div>
        </Skeleton>
    </Page>
)

export default MarkdownSkeleton
