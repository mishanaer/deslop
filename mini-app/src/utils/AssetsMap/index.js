import DollarsLogo from "../../icons/avatars/Dollars.svg"
import BitcoinLogo from "../../icons/avatars/Bitcoin.svg"
import ToncoinLogo from "../../icons/avatars/Toncoin.svg"
import NotcoinLogo from "../../icons/avatars/Notcoin.svg"
import MajorLogo from "../../icons/avatars/Major.svg"
import HamsterLogo from "../../icons/avatars/Hamster.webp"
import XEmpireLogo from "../../icons/avatars/XEmpire.svg"
import CatizenLogo from "../../icons/avatars/Catizen.webp"

const AssetsMap = {
    USDT: DollarsLogo,
    TON: ToncoinLogo,
    BTC: BitcoinLogo,
    NOT: NotcoinLogo,
    MAJOR: MajorLogo,
    HMSTR: HamsterLogo,
    X: XEmpireLogo,
    CATI: CatizenLogo,
}

// Not a React hook; rename to avoid rules-of-hooks false positives
export const getAssetIcon = (ticker) => AssetsMap[ticker] || null
