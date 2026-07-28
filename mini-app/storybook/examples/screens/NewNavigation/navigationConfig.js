import { TRANSITIONS } from "@mini-utils/animations"
import Wallet from "../Wallet"
import TONWallet from "../TS"
import Trading from "../Trading"
import History from "./History"

import {
    IconChart as TradeIcon,
    IconClock as HistoryIcon,
    IconWallet as WalletIcon,
} from "@primitives/material-symbols-react"

export const getTabsConfig = () => ({
    wallet: [
        {
            label: "Wallet",
            icon: <WalletIcon />,
            view: <Wallet />,
        },
        {
            label: "Trade",
            icon: <TradeIcon />,
            view: <Trading />,
        },
        {
            label: "Earn",
            icon: <TradeIcon />,
            view: <Trading />,
        },
        {
            label: "History",
            icon: <HistoryIcon />,
            view: <History />,
        },
    ],
    ton: [
        {
            label: "TON Space",
            icon: <WalletIcon />,
            view: <TONWallet />,
        },
        {
            label: "Activity",
            icon: <HistoryIcon />,
            view: <History />,
        },
        {
            label: "Browser",
            icon: <TradeIcon />,
            view: <Trading />,
        },
    ],
})

export const pageVariants = {
    initial: ({ isSegmentSwitch, direction, isApple }) => {
        if (isSegmentSwitch) return { opacity: 0, scale: 1.006, x: 0 }

        if (isApple) {
            return {
                opacity: 0,
                scale:
                    (window.innerHeight - 3.0 * window.devicePixelRatio) /
                    window.innerHeight,
                x: 0,
            }
        }
        return { opacity: 0, x: `${-3 * direction}%`, scale: 1 }
    },
    animate: ({ isSegmentSwitch, isApple }) => {
        if (isSegmentSwitch) {
            return {
                opacity: 1,
                scale: 1,
                x: 0,
                transition: { duration: 0.2, ease: "easeOut" },
            }
        }

        if (isApple) {
            return {
                opacity: 1,
                scale: 1,
                x: 0,
                transition: {
                    scale: { duration: 0.15, ease: [0.38, 0.7, 0.125, 1.0] },
                    opacity: { duration: 0.1, ease: "easeInOut" },
                },
            }
        }
        return {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: TRANSITIONS.MATERIAL_STANDARD,
        }
    },
    exit: ({ isSegmentSwitch, direction, isApple }) => {
        if (isSegmentSwitch) {
            return {
                opacity: 0,
                scale: 1.01,
                x: 0,
                transition: { duration: 0.2, ease: "easeOut" },
            }
        }

        if (isApple) {
            return {
                opacity: 0,
                scale:
                    (window.innerHeight - 3.0 * window.devicePixelRatio) /
                    window.innerHeight,
                x: 0,
                transition: {
                    scale: { duration: 0.15, ease: [0.38, 0.7, 0.125, 1.0] },
                    opacity: { duration: 0.1, ease: "easeInOut" },
                },
            }
        }
        return {
            opacity: 0,
            x: `${3 * direction}%`,
            scale: 1,
            transition: TRANSITIONS.MATERIAL_STANDARD,
        }
    },
}
