import Page from "../Page"
import Skeleton, { SkeletonBlock } from "../Skeleton"

import * as styles from "./DropdownMenu.skeleton.module.css"

// Same anchor grid the showcase pins its trigger dots to, so the placeholder
// reads as the real screen: a framed field with eight menu triggers. The
// dropdown itself only opens on tap and is never part of the resting page.
const ANCHORS = [
    { key: "tl", top: "0%", left: "0%" },
    { key: "tc", top: "0%", left: "50%" },
    { key: "tr", top: "0%", left: "100%" },
    { key: "lc", top: "50%", left: "0%" },
    { key: "rc", top: "50%", left: "100%" },
    { key: "bl", top: "100%", left: "0%" },
    { key: "bc", top: "100%", left: "50%" },
    { key: "br", top: "100%", left: "100%" },
]

const DropdownMenuSkeleton = () => (
    <Page>
        <div className={styles.page}>
            <div className={styles.rect}>
                <Skeleton active>
                    {ANCHORS.map(({ key, top, left }) => (
                        <div
                            key={key}
                            className={styles.anchor}
                            style={{ top, left }}
                        >
                            <SkeletonBlock as="span" className={styles.dot} />
                        </div>
                    ))}
                </Skeleton>
            </div>
        </div>
    </Page>
)

export default DropdownMenuSkeleton
