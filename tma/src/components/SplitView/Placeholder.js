import { useEffect } from "react"
import Text from "../Text"
import { useSplitViewContext } from "./context"

import * as styles from "./SplitView.module.scss"

// Empty-state shown in the detail pane when no item is selected (route "/").
// Reports the secondary background so the pane resets after a page with a
// primary/custom background (e.g. Table) was open in the detail before.
const SplitViewPlaceholder = () => {
    const { setPaneBackground } = useSplitViewContext()

    useEffect(() => {
        setPaneBackground?.("var(--tg-theme-secondary-bg-color)")
    }, [setPaneBackground])

    return (
        <div className={styles.placeholder}>
            <Text variant="body" weight="regular">
                Select a component
            </Text>
        </div>
    )
}

export default SplitViewPlaceholder
