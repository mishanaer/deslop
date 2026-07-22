import BalanceCard from "../../../Wallet/components/BalanceCard"
import * as balanceCardStyles from "../../../Wallet/components/BalanceCard/BalanceCard.module.css"
import * as ButtonStyles from "../../../../../components/Button/MultilineButton/MultilineButton.module.css"
import { MultilineButton } from "../../../../../components/Button"

import ArrowUpIcon from "@deslop/primitives/icons/arrow-up.svg?react"
import ArrowsSwapIcon from "@deslop/primitives/icons/arrows-swap.svg?react"
import PlusIcon from "@deslop/primitives/icons/plus.svg?react"

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
