import BalanceCard from "../../../Wallet/components/BalanceCard"
import * as balanceCardStyles from "../../../Wallet/components/BalanceCard/BalanceCard.module.css"
import * as ButtonStyles from "@components/Button/MultilineButton/MultilineButton.module.css"
import { MultilineButton } from "@components/Button"

import {
    IconArrowUp as ArrowUpIcon,
    IconPlus as PlusIcon,
    IconSwap as ArrowsSwapIcon,
} from "@primitives/material-symbols-react"

export default function Profile() {
    return (
        <BalanceCard
            label="TON Wallet Balance"
            initialBalance="261.69"
            variant="overlay"
            actions={
                <>
                    <MultilineButton
                        variant="plain"
                        icon={<ArrowUpIcon />}
                        label="Send"
                        className={`${ButtonStyles.button} ${balanceCardStyles.overlayButton}`}
                    />
                    <MultilineButton
                        variant="plain"
                        icon={<PlusIcon />}
                        label="Deposit"
                        className={`${ButtonStyles.button} ${balanceCardStyles.overlayButton}`}
                    />
                    <MultilineButton
                        variant="plain"
                        icon={<ArrowsSwapIcon />}
                        label="Swap"
                        className={`${ButtonStyles.button} ${balanceCardStyles.overlayButton}`}
                    />
                </>
            }
        />
    )
}
