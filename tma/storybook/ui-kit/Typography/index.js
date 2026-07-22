import PropTypes from "prop-types"

import Page from "../../../src/components/Page"
import SectionList from "../../../src/components/SectionList"
import Text from "../../../src/components/Text"
import { BackButton } from "../../../src/lib/twa"
import { typographyStyles } from "@deslop/primitives/tokens"

import * as styles from "./Typography.module.scss"

const TypeSample = ({ token }) => {
    const { name, fontSize, lineHeight, fontWeight, letterSpacing, caps } =
        token

    return (
        <div className={styles.row}>
            <span
                className={styles.sample}
                style={{
                    "--sample-font-size": fontSize,
                    "--sample-line-height": lineHeight,
                    "--sample-font-weight": fontWeight,
                    "--sample-letter-spacing": letterSpacing,
                    "--sample-transform": caps ? "uppercase" : "none",
                    "--sample-family": caps
                        ? "var(--ui-font-interface-caps)"
                        : "var(--ui-font-interface)",
                }}
            >
                {name}
            </span>
            <span className={styles.meta}>
                <Text variant="footnote">
                    {fontSize} / {lineHeight} · {fontWeight}
                </Text>
            </span>
        </div>
    )
}

TypeSample.propTypes = {
    token: PropTypes.shape({
        name: PropTypes.string.isRequired,
        fontSize: PropTypes.string.isRequired,
        lineHeight: PropTypes.string.isRequired,
        fontWeight: PropTypes.number.isRequired,
        letterSpacing: PropTypes.string.isRequired,
        caps: PropTypes.bool,
    }).isRequired,
}

const TypographyShowcase = () => (
    <>
        <BackButton />
        <Page>
            <SectionList>
                <SectionList.Item header="Typography Styles">
                    {typographyStyles.map((token) => (
                        <TypeSample key={token.name} token={token} />
                    ))}
                </SectionList.Item>
            </SectionList>
        </Page>
    </>
)

export default TypographyShowcase
