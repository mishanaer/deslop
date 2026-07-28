import Page from "@components/Page"
import Markdown from "@components/Markdown"
import SAMPLE from "./sample.md?raw"

import { BackButton } from "@lib/twa"

const MarkdownExample = () => {
    return (
        <>
            <BackButton />
            <Page mode="primary">
                <div style={{ padding: "0 var(--side-padding) 32px" }}>
                    <Markdown>{SAMPLE}</Markdown>
                </div>
            </Page>
        </>
    )
}

export default MarkdownExample
