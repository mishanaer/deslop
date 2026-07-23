import Page from "../Page"
import Markdown from "."
import SAMPLE from "./sample.md?raw"

import { BackButton } from "../../lib/twa"

const MarkdownShowcase = () => {
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

export default MarkdownShowcase
