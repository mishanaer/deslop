import PropTypes from "prop-types"
import * as m from "motion/react-m"
import { AnimatePresence } from "motion/react"
import * as styles from "./PageContent.module.scss"
import Wallet from "../../../Wallet"
import TONWallet from "../../../TS"

export default function PageContent({ view }) {
    let content
    switch (view) {
        case "wallet":
            content = <Wallet />
            break
        case "tonwallet":
            content = <TONWallet />
            break
        default:
            content = <Wallet />
    }

    return (
        <AnimatePresence
            mode="popLayout"
            initial={false}
            custom={view}
            inherit={false}
        >
            <m.div
                initial={{ opacity: 0, scale: 1.006 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.01 }}
                key={view}
                transition={{
                    duration: 0.2,
                    ease: "easeOut",
                }}
                className={styles.pageView}
            >
                {content}
            </m.div>
        </AnimatePresence>
    )
}

PageContent.propTypes = {
    view: PropTypes.string,
}
