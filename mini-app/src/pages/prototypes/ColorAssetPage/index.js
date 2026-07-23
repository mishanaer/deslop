import PropTypes from "prop-types"
import { BackButton } from "../../../lib/twa"

import Page from "../../../components/Page"

import ImageAvatar from "../../../components/ImageAvatar"
import Text from "../../../components/Text"
import Skeleton from "../../../components/Skeleton"
import { RegularButton, MultilineButton } from "../../../components/Button"

import useAssets from "../../../hooks/useAssets"
import ArrowUpIcon from "@deslop/primitives/icons/arrow-up.svg?react"
import ArrowDownIcon from "@deslop/primitives/icons/arrow-down.svg?react"
import PlusIcon from "@deslop/primitives/icons/plus.svg?react"
import ArrowsSwapIcon from "@deslop/primitives/icons/arrows-swap.svg?react"

import * as styles from "./ColorAssetPage.module.css"

// Placeholder cards rendered while the fetch is in flight; each reveals on
// its own once its data and accent color are ready.
const SKELETON_COUNT = 3

// Mock values give the skeleton bars realistic, varied widths while loading.
const PLACEHOLDER = { name: "Ethereum", current_price: "3,180", symbol: "eth" }

const ASSET_BACKGROUNDS = [
    "var(--accent-indigo)",
    "var(--accent-purple)",
    "var(--accent-blue)",
    "var(--accent-teal)",
]

function Banner({ name }) {
    const BannerText = `Currently, ${name} can only be purchased, held and sold within Crypto Wallet. It is not possible to transfer, receive or withdraw ${name} externally.`
    return (
        <div className={styles.bannerContainer}>
            <div className={styles.banner}>
                <Text variant="subheadline2">{BannerText}</Text>
            </div>
        </div>
    )
}

Banner.propTypes = {
    name: PropTypes.string,
}

function ActionButtons({ mode }) {
    const custodyButtons = [
        {
            icon: <ArrowUpIcon />,
            name: "Transfer",
        },
        {
            icon: <ArrowDownIcon />,
            name: "Deposit",
        },
        {
            icon: <PlusIcon />,
            name: "Withdraw",
        },
        {
            icon: <ArrowsSwapIcon />,
            name: "Exchange",
        },
    ]

    const tradeButtons = [
        {
            icon: <PlusIcon />,
            name: "Buy",
        },
        {
            icon: <ArrowsSwapIcon />,
            name: "Sell",
        },
    ]

    if (mode === "trade") {
        return (
            <div className={styles.buttons}>
                {tradeButtons.map((button, index) => (
                    <RegularButton
                        variant="tinted"
                        icon={button.icon}
                        label={button.name}
                        isFill={true}
                        key={index}
                        style={{
                            color: "var(--mini-app-static-white)",
                            backgroundColor: "var(--mini-app-fill-tertiary)",
                        }}
                    />
                ))}
            </div>
        )
    }

    if (mode === "custody") {
        return (
            <div className={styles.buttons}>
                {custodyButtons.map((button, index) => (
                    <MultilineButton
                        variant="tinted"
                        icon={button.icon}
                        label={button.name}
                        key={index}
                        style={{
                            color: "var(--mini-app-static-white)",
                            backgroundColor: "var(--mini-app-fill-tertiary)",
                        }}
                    />
                ))}
            </div>
        )
    }
}

ActionButtons.propTypes = {
    mode: PropTypes.string,
}

function AssetSection({ mode, asset, backgroundColor }) {
    const revealed = Boolean(asset)
    const data = asset ?? PLACEHOLDER

    return (
        <section
            className={styles.root}
            style={{ backgroundColor }}
        >
            {revealed && mode === "trade" ? <Banner name={data.name} /> : null}
            <Skeleton active={!revealed}>
                <div className={styles.body}>
                    <ImageAvatar size={72} src={asset?.image} />
                    <div className={styles.data}>
                        <Text variant="title3" weight="semibold">
                            {data.name}
                        </Text>
                        <Text variant="title2" weight="semibold">
                            ${data.current_price}
                        </Text>
                        <Text variant="subheadline1" weight="regular">
                            {data.symbol?.toUpperCase()}
                        </Text>
                    </div>
                </div>
            </Skeleton>
            {revealed ? <ActionButtons mode={mode} /> : null}
        </section>
    )
}

AssetSection.propTypes = {
    mode: PropTypes.string,
    backgroundColor: PropTypes.string,
    asset: PropTypes.shape({
        image: PropTypes.string,
        name: PropTypes.string,
        current_price: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        symbol: PropTypes.string,
    }),
}

function ColorAssetPage() {
    const { assets } = useAssets()

    // Index keys keep the placeholder cards and the real cards on the same
    // elements, so the first cards reveal in place rather than remounting.
    const rows = assets ?? Array.from({ length: SKELETON_COUNT }, () => null)

    return (
        <>
            <BackButton />
            <Page>
                <div className={styles.list}>
                    {rows.map((asset, index) => (
                        <AssetSection
                            mode="trade"
                            asset={asset}
                            backgroundColor={
                                ASSET_BACKGROUNDS[
                                    index % ASSET_BACKGROUNDS.length
                                ]
                            }
                            key={index}
                        />
                    ))}
                </div>
            </Page>
        </>
    )
}

export default ColorAssetPage
