import Page from "../Page"
import GlassContainer from "../GlassEffect"
import { SkeletonBlock } from "../Skeleton"

import * as styles from "./TextField.skeleton.module.css"

// Loading placeholder for the Input Page. The real screen is a single chat-style
// message field in a glass pill at the bottom of the viewport; the skeleton
// keeps that pill (with a redacted bar inside) over the default page background.
const TextFieldSkeleton = () => (
    <Page>
        <div className={styles.container}>
            <div className={styles.input}>
                <GlassContainer style={{ borderRadius: "36px" }}>
                    <SkeletonBlock className={styles.field} />
                </GlassContainer>
            </div>
        </div>
    </Page>
)

export default TextFieldSkeleton
