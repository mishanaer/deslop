import * as styles from "./ActionButtons.module.css"
import { MultilineButton } from "@components/Button"

import {
    IconArrowDown as ArrowDownIcon,
    IconArrowUp as ArrowUpIcon,
    IconPlus as PlusIcon,
    IconSwap as ArrowsSwapIcon,
} from "@primitives/material-symbols-react"

export default function ActionButtons() {
    const buttons = [
        {
            icon: <ArrowUpIcon />,
            name: "Transfer",
        },
        {
            icon: <PlusIcon />,
            name: "Deposit",
        },
        {
            icon: <ArrowDownIcon />,
            name: "Withdraw",
        },
        {
            icon: <ArrowsSwapIcon />,
            name: "Exchange",
        },
    ]

    return (
        <div className={styles.buttons}>
            {buttons.map((button, index) => (
                <MultilineButton
                    variant="tinted"
                    icon={button.icon}
                    label={button.name}
                    key={index}
                />
            ))}
        </div>
    )
}
