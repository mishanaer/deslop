import * as styles from "./Collectibles.module.scss"
import Text from "../../../../../components/Text"
import SectionList from "../../../../../components/SectionList"

export default function Collectibles() {
    return (
        <SectionList.Item header="Collectibles">
            <div className={styles.placeholder}>
                <Text variant="body">
                    As you get collectibles, they will appear here.
                </Text>
            </div>
        </SectionList.Item>
    )
}
