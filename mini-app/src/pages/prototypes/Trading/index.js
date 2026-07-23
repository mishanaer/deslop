import Text from "../../../components/Text"
import Page from "../../../components/Page"
import SectionList from "../../../components/SectionList"

import AssetHeatmap from "./components/AssetHeatmap"
import AssetList from "./components/AssetList"

import useAssets from "../../../hooks/useAssets"

import * as styles from "./Trading.module.css"

function Trading() {
    const { error } = useAssets()

    if (error) {
        return (
            <Page>
                <div className={`${styles.center} ${styles.error}`}>
                    <Text variant="body">Error loading assets</Text>
                </div>
            </Page>
        )
    }

    return (
        <Page>
            <SectionList>
                <AssetHeatmap />
                <AssetList />
            </SectionList>
        </Page>
    )
}

export default Trading
