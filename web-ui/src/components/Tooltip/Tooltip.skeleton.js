import Page from "../Page"
import Skeleton, { SkeletonBlock } from "../Skeleton"

import * as styles from "./Tooltip.skeleton.module.scss"

// Same anchor grid the showcase pins its trigger dots to, so the placeholder
// reads as the real screen: two control rows above a framed field of eight
// tooltip triggers. The tooltip bubbles only appear on tap and are never part
// of the resting page.
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

const controlBar = <SkeletonBlock as="span" className={styles.controlBar} />

const TooltipSkeleton = () => (
    <Page>
        <div className={styles.page}>
            <Skeleton active>
                <div className={styles.controls}>
                    {controlBar}
                    {controlBar}
                </div>
                <div className={styles.rect}>
                    {ANCHORS.map(({ key, top, left }) => (
                        <div
                            key={key}
                            className={styles.anchor}
                            style={{ top, left }}
                        >
                            <SkeletonBlock as="span" className={styles.dot} />
                        </div>
                    ))}
                </div>
            </Skeleton>
        </div>
    </Page>
)

export default TooltipSkeleton
