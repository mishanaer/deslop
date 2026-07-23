import { RegularButton } from "../../src/components/Button"
import Text from "../../src/components/Text"

import * as styles from "./RouteErrorFallback.module.css"

const handleReload = () => {
    window.location.reload()
}

const RouteErrorFallback = () => (
    <div className={styles.root}>
        <Text
            variant="body"
            weight="semibold"
        >
            Something went wrong
        </Text>
        <div className={styles.description}>
            <Text
                variant="subheadline1"
            >
                This page failed to load. It may have been updated — try
                reloading.
            </Text>
        </div>
        <div className={styles.button}>
            <RegularButton
                variant="filled"
                label="Reload"
                onClick={handleReload}
            />
        </div>
    </div>
)

export default RouteErrorFallback
