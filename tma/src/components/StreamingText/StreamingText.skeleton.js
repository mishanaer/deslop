import Page from "../Page"
import SectionList from "../SectionList"
import Text from "../Text"

import * as styles from "./StreamingText.skeleton.module.scss"

// Widths (in ch) approximate a paragraph mid-generation: mostly full lines
// with a short final line signalling the stream tail. Bars cap at 100% of
// the container, so over-wide values simply fill the row.
const LINE_WIDTHS = [30, 34, 27, 33, 16]

const StreamingTextSkeleton = () => (
    <Page>
        <SectionList>
            <SectionList.Item header="Preview">
                <div className={styles.preview}>
                    {LINE_WIDTHS.map((width, index) => (
                        <Text
                            key={index}
                            variant="body"
                            weight="regular"
                            skeleton={width}
                        />
                    ))}
                </div>
            </SectionList.Item>
        </SectionList>
    </Page>
)

export default StreamingTextSkeleton
