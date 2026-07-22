import PropTypes from "prop-types"
import Text from "../../../../../components/Text"

const walletNames = {
    0: "Crypto Wallet",
    1: "TON Wallet",
}

export default function CollapsedView({ activeSegment }) {
    return (
        <Text variant="footnote" weight="semibold">
            {walletNames[activeSegment]}
        </Text>
    )
}

CollapsedView.propTypes = {
    activeSegment: PropTypes.number,
}
