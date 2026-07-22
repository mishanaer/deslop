import PropTypes from "prop-types"

import { useModalNav } from "../context"
import PanelHeader from "../../PanelHeader"
import SectionList from "../../SectionList"
import Cell from "../../Cells"
import ImageAvatar from "../../ImageAvatar"

import { getAssetIcon } from "../../../utils/AssetsMap"
import ChevronLeftIcon from "@deslop/primitives/icons/chevron-left.svg?react"
import EllipsisIcon from "@deslop/primitives/icons/circle-more.svg?react"
import XmarkIcon from "@deslop/primitives/icons/cross.svg?react"

export const DEMO_ASSETS = [
    {
        symbol: "TON",
        name: "Toncoin",
        amount: "100 TON",
        fiat: "$520.00",
        price: "$5.20",
        change: "+2.4%",
        cap: "$12.8B",
        about: "Toncoin is the native asset of The Open Network, a layer-1 blockchain designed for speed and scalability.",
    },
    {
        symbol: "USDT",
        name: "Dollars",
        amount: "100 USDT",
        fiat: "$100.00",
        price: "$1.00",
        change: "0.0%",
        cap: "$118.4B",
        about: "Tether is a stablecoin pegged to the US dollar, widely used for transfers and trading.",
    },
    {
        symbol: "BTC",
        name: "Bitcoin",
        amount: "0.000001 BTC",
        fiat: "$0.10",
        price: "$104,250",
        change: "-1.1%",
        cap: "$2.1T",
        about: "Bitcoin is the first and largest cryptocurrency, secured by proof-of-work mining.",
    },
]

const assetShape = PropTypes.shape({
    symbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    amount: PropTypes.string,
    fiat: PropTypes.string,
    price: PropTypes.string,
    change: PropTypes.string,
    cap: PropTypes.string,
    about: PropTypes.string,
})

export const AssetListPage = ({ onSelect }) => {
    const { push, close } = useModalNav()

    return (
        <>
            <PanelHeader left={<XmarkIcon />} onLeft={close}>
                Assets
            </PanelHeader>
            <SectionList>
                <SectionList.Item>
                    {DEMO_ASSETS.map((asset) => (
                        <Cell
                            key={asset.symbol}
                            start={
                                <ImageAvatar
                                    src={getAssetIcon(asset.symbol)}
                                />
                            }
                            end={<Cell.End label={asset.fiat} />}
                            onClick={() => {
                                onSelect(asset)
                                push("detail")
                            }}
                        >
                            <Cell.Text
                                title={asset.name}
                                description={asset.amount}
                                bold
                            />
                        </Cell>
                    ))}
                </SectionList.Item>
            </SectionList>
        </>
    )
}

AssetListPage.propTypes = {
    onSelect: PropTypes.func.isRequired,
}

export const AssetDetailPage = ({ asset }) => {
    const { push, pop } = useModalNav()

    return (
        <>
            <PanelHeader
                left={<ChevronLeftIcon />}
                onLeft={pop}
                right={<EllipsisIcon />}
                onRight={() => push("info")}
            >
                {asset.name}
            </PanelHeader>
            <SectionList>
                <SectionList.Item header="Balance">
                    <Cell
                        start={<ImageAvatar src={getAssetIcon(asset.symbol)} />}
                    >
                        <Cell.Text
                            title={asset.amount}
                            description={asset.fiat}
                            bold
                        />
                    </Cell>
                </SectionList.Item>
                <SectionList.Item header="Market">
                    <Cell end={<Cell.End label={asset.price} />}>
                        <Cell.Text title="Price" />
                    </Cell>
                    <Cell end={<Cell.End label={asset.change} />}>
                        <Cell.Text title="Change 24h" />
                    </Cell>
                    <Cell end={<Cell.End label={asset.cap} />}>
                        <Cell.Text title="Market cap" />
                    </Cell>
                </SectionList.Item>
                <SectionList.Item>
                    <Cell onClick={() => push("info")}>
                        <Cell.Text
                            type="Accent"
                            title={`About ${asset.name}`}
                        />
                    </Cell>
                </SectionList.Item>
            </SectionList>
        </>
    )
}

AssetDetailPage.propTypes = {
    asset: assetShape.isRequired,
}

export const AssetInfoPage = ({ asset }) => {
    const { pop } = useModalNav()

    return (
        <>
            <PanelHeader left={<ChevronLeftIcon />} onLeft={pop}>
                About {asset.name}
            </PanelHeader>
            <SectionList>
                <SectionList.Item description={asset.about}>
                    <Cell
                        start={<ImageAvatar src={getAssetIcon(asset.symbol)} />}
                    >
                        <Cell.Text
                            title={asset.name}
                            description={asset.symbol}
                        />
                    </Cell>
                </SectionList.Item>
            </SectionList>
        </>
    )
}

AssetInfoPage.propTypes = {
    asset: assetShape.isRequired,
}
