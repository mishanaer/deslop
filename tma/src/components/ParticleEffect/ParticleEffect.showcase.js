import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Calligraph } from "calligraph"

import Page from "../Page"
import SectionList from "../SectionList"
import Text from "../Text"
import ParticleEffect from "."

import { generateRandomBalance } from "../../utils/number"
import { BackButton } from "../../lib/twa"
import { getUiColor } from "@deslop/primitives/colors"

function Demo({ color, children }) {
    const [hidden, setHidden] = useState(true)

    return (
        <ParticleEffect
            hidden={hidden}
            color={color}
            onClick={() => setHidden((s) => !s)}
        >
            {children}
        </ParticleEffect>
    )
}

Demo.propTypes = {
    color: PropTypes.string,
    children: PropTypes.node,
}

// Mirrors BalanceCard: a Calligraph number that rolls every second (frozen
// while hidden). Use this to A/B against the static cases above.
function LiveNumberDemo() {
    const [hidden, setHidden] = useState(false)
    const [balance, setBalance] = useState("30.06")

    useEffect(() => {
        const id = setInterval(() => {
            if (!hidden) setBalance(generateRandomBalance())
        }, 1000)
        return () => clearInterval(id)
    }, [hidden])

    return (
        <ParticleEffect hidden={hidden} onClick={() => setHidden((s) => !s)}>
            <Text variant="title1" weight="bold">
                <Calligraph variant="number" animation="smooth">
                    {balance}
                </Calligraph>
            </Text>
        </ParticleEffect>
    )
}

const ParticleEffectShowcase = () => (
    <>
        <BackButton />
        <Page>
            <SectionList>
                <SectionList.Item header="Tap to reveal / hide">
                    <Demo>
                        <Text variant="title1" weight="bold">
                            $1,234.56
                        </Text>
                    </Demo>
                </SectionList.Item>

                <SectionList.Item header="Live number (Calligraph, like BalanceCard)">
                    <LiveNumberDemo />
                </SectionList.Item>

                <SectionList.Item header="Inline text">
                    <Text variant="body">
                        The password is{" "}
                        <Demo>
                            <Text variant="body">hunter2</Text>
                        </Demo>{" "}
                        — keep it safe.
                    </Text>
                </SectionList.Item>

                <SectionList.Item header="On a dark surface (white particles)">
                    <div
                        style={{
                            background: "var(--ui-background-secondary)",
                            padding: "24px",
                            borderRadius: "16px",
                            color: "var(--ui-static-white)",
                        }}
                    >
                        <Demo color={getUiColor("static-white")}>
                            <Text variant="title1" weight="bold">
                                7 412 TON
                            </Text>
                        </Demo>
                    </div>
                </SectionList.Item>
            </SectionList>
        </Page>
    </>
)

export default ParticleEffectShowcase
