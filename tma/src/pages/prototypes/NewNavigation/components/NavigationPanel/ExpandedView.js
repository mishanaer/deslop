import PropTypes from "prop-types"
import Cell from "../../../../../components/Cells"
import ImageAvatar from "../../../../../components/ImageAvatar"
import { getAssetIcon } from "../../../../../utils/AssetsMap"

import * as styles from "./NavigationPanel.module.scss"

const wallets = [
    {
        id: "crypto",
        icon: "TON",
        title: "Crypto Wallet",
        description: "Easiest way to buy, sell and trade",
        index: 0,
    },
    {
        id: "ton",
        icon: "TON",
        title: "TON Wallet",
        description: "Self-custody for advanced users",
        index: 1,
    },
]

export default function ExpandedView({ activeSegment, onSegmentChange }) {
    return (
        <div className={styles.items}>
            {wallets.map((wallet) => (
                <div
                    key={wallet.id}
                    className={`${styles.item} ${
                        activeSegment === wallet.index ? styles.active : ""
                    }`}
                    onClick={() => onSegmentChange(wallet.index)}
                >
                    <Cell
                        start={<ImageAvatar src={getAssetIcon(wallet.icon)} />}
                    >
                        <Cell.Text
                            title={wallet.title}
                            description={wallet.description}
                            bold
                        />
                    </Cell>
                </div>
            ))}
        </div>
    )
}

ExpandedView.propTypes = {
    activeSegment: PropTypes.number,
    onSegmentChange: PropTypes.func,
}
