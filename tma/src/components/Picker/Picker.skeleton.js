import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import Text from "../Text"
import Skeleton from "../Skeleton"

import * as styles from "./Picker.skeleton.module.scss"

// Mock month labels of varied width so the redacted rows read as a real
// picker wheel rather than identical bars. The middle one sits on the
// selection highlight, mirroring the centered selected item.
const ROWS = ["September", "October", "November", "December", "January"]

// Placeholder for the Picker screen: the setting cell keeps its solid "Picker"
// label (known chrome) with a redacted current value, and the 200px wheel
// region becomes stacked centered bars behind a solid selection highlight.
const PickerSkeleton = () => (
    <Page>
        <SectionList>
            <SectionList.Item>
                <Cell
                    end={
                        <Skeleton active>
                            <Cell.Part type="Picker">November</Cell.Part>
                        </Skeleton>
                    }
                >
                    <Cell.Text title="Picker" />
                </Cell>

                <div className={styles.wheel}>
                    <div className={styles.selected} />
                    <Skeleton active>
                        <div className={styles.rows}>
                            {ROWS.map((month) => (
                                <Text
                                    key={month}
                                    variant="title3"
                                    weight="regular"
                                >
                                    {month}
                                </Text>
                            ))}
                        </div>
                    </Skeleton>
                </div>
            </SectionList.Item>
        </SectionList>
    </Page>
)

export default PickerSkeleton
