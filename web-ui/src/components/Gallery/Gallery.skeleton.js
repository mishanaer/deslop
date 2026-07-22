import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import Gallery from "."
import Skeleton, { SkeletonBlock } from "../Skeleton"

import * as styles from "./Gallery.skeleton.module.scss"

// A full-width redacted block per gallery page.
const TILES = [0, 1, 2, 3]

const GallerySkeleton = () => (
    <Page>
        <SectionList>
            <SectionList.Item header="Gallery">
                <Skeleton active>
                    <Gallery>
                        {TILES.map((i) => (
                            <SkeletonBlock key={i} className={styles.tile} />
                        ))}
                    </Gallery>
                </Skeleton>
            </SectionList.Item>

            <SectionList.Item>
                <Skeleton active>
                    <Cell>
                        <Cell.Text title="Current Page" description="1 of 4" />
                    </Cell>
                </Skeleton>
            </SectionList.Item>
        </SectionList>
    </Page>
)

export default GallerySkeleton
