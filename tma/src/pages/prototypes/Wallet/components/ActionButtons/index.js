import * as styles from "./ActionButtons.module.scss"
import { MultilineButton } from "../../../../../components/Button"

import ArrowUpIcon from "@deslop/primitives/icons/arrow-up.svg?react"
import ArrowsSwapIcon from "@deslop/primitives/icons/arrows-swap.svg?react"
import PlusIcon from "@deslop/primitives/icons/plus.svg?react"
import ArrowDownIcon from "@deslop/primitives/icons/arrow-down.svg?react"

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
