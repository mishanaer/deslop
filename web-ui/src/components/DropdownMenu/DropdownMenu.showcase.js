import Page from "../Page"
import DropdownMenu from "../DropdownMenu"

import { BackButton } from "../../lib/twa"

import * as styles from "./DropdownMenu.showcase.module.scss"

const ITEMS = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"]

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

const DropdownMenuShowcase = () => (
    <>
        <BackButton />
        <Page>
            <div className={styles.page}>
                <div className={styles.rect}>
                    {ANCHORS.map(({ key, top, left }) => (
                        <div
                            key={key}
                            className={styles.anchor}
                            style={{ top, left }}
                        >
                            <DropdownMenu
                                items={ITEMS}
                                trigger={<span className={styles.dot} />}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </Page>
    </>
)

export default DropdownMenuShowcase
