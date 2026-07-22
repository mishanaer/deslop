import Page from "../Page"
import SectionList from "../SectionList"
import Skeleton from "../Skeleton"
import { RegularButton, MultilineButton } from "../Button"

import ArrowUpIcon from "@deslop/primitives/icons/arrow-up.svg?react"
import PlusIcon from "@deslop/primitives/icons/plus.svg?react"

import * as styles from "./Button.skeleton.module.scss"

// Suspense fallback for the Button showcase. Reuses the real buttons: under the
// Skeleton provider each button renders as a neutral gray pill (redaction
// surface) at its exact shape (radius, height, label-derived width), with no
// inner text bar. Section headers stay solid.
const ButtonSkeleton = () => (
    <Page>
        <SectionList>
            <SectionList.Item header="Regular Button">
                <Skeleton active>
                    <div className={styles.regularGroup}>
                        <RegularButton variant="filled" label="Filled" />
                        <RegularButton variant="filled" label="Filled Shine" />
                        <RegularButton variant="outlined" label="Outlined" />
                    </div>
                </Skeleton>
            </SectionList.Item>

            <SectionList.Item header="Multiline Button">
                <Skeleton active>
                    <div className={styles.multilineGroup}>
                        <MultilineButton
                            variant="filled"
                            icon={<ArrowUpIcon />}
                            label="Send"
                        />
                        <MultilineButton
                            variant="filled"
                            icon={<PlusIcon />}
                            label="Add"
                        />
                        <MultilineButton
                            variant="plain"
                            icon={<ArrowUpIcon />}
                            label="Plain"
                        />
                    </div>
                </Skeleton>
            </SectionList.Item>
        </SectionList>
    </Page>
)

export default ButtonSkeleton
