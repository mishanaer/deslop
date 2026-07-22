import Page from "../../../components/Page"
import Text from "../../../components/Text"
import StartView from "../../../components/StartView"
import { RegularButton } from "../../../components/Button"
import Skeleton from "../../../components/Skeleton"

import * as styles from "./Onboarding.module.css"

// Loading placeholder for the Onboarding gallery's first screen. Reuses the real
// layout so the black top region (cover) is preserved, but the illustration
// itself is intentionally omitted — an empty black cover reads cleaner than a
// redacted circle. Title/subtitle redact via StartView; the bottom buttons
// redact to gray pills.
const OnboardingSkeleton = () => (
    <Page headerColor="131314">
        <Skeleton active>
            <div className={styles.root}>
                <div className={styles.cover} />
                <div className={styles.content}>
                    <StartView
                        title="Your TON Wallet"
                        description="Get access to all the features of TON blockchain directly in Telegram"
                    />
                </div>
                <div className={styles.BottomButtons}>
                    <RegularButton
                        variant="filled"
                        label="Start exploring TON"
                        isFill
                    />
                    <RegularButton
                        variant="tinted"
                        label="Add Existing Wallet"
                        isFill
                    />
                    <div className={styles.terms}>
                        <Text variant="subheadline2" weight="regular">
                            By continuing you agree to Terms of Service
                        </Text>
                    </div>
                </div>
            </div>
        </Skeleton>
    </Page>
)

export default OnboardingSkeleton
