import { useLayoutEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Calligraph } from "calligraph"

import { formatPercentage, formatPrice } from "../../../../../utils/number"

import SectionList from "../../../../../components/SectionList"
import Cell from "../../../../../components/Cells"
import ImageAvatar from "../../../../../components/ImageAvatar"
import Skeleton from "../../../../../components/Skeleton"

import useAssets from "../../../../../hooks/useAssets"

import * as styles from "./AssetList.module.css"

// Loading rows; the varied mock lengths give the skeleton a realistic
// rhythm instead of identical bars.
const PLACEHOLDER_ASSETS = [
    { name: "Bitcoin", symbol: "btc", current_price: 64120, pct: 2.4 },
    { name: "Ethereum", symbol: "eth", current_price: 3180, pct: -1.1 },
    { name: "Toncoin", symbol: "ton", current_price: 5.42, pct: 0.8 },
    { name: "Solana", symbol: "sol", current_price: 142.6, pct: 3.9 },
    { name: "Notcoin", symbol: "not", current_price: 0.0091, pct: -2.2 },
    { name: "Tether", symbol: "usdt", current_price: 1.0, pct: 0.4 },
    { name: "Dogecoin", symbol: "doge", current_price: 0.121, pct: 1.5 },
    { name: "Polygon", symbol: "matic", current_price: 0.72, pct: -0.6 },
]

// The estimate seeds the scrollbar until measureElement reports real row
// heights (they differ per platform ramp).
const ESTIMATED_ROW = 64
const OVERSCAN = 5

// Live rows carry a catalog-resolved `image`; the XTVC guess only backs
// the local placeholders.
const assetIcon = (asset) =>
    asset.image ??
    `https://s3-symbol-logo.tradingview.com/crypto/XTVC${asset.symbol?.toUpperCase()}--big.svg`

// The arrow sits outside the odometer so a sign flip swaps it instantly
// instead of morphing through the digit animation.
const Delta = ({ value }) => {
    const up = value >= 0
    return (
        <span className={`${styles.delta} ${up ? styles.up : styles.down}`}>
            {up ? "↑" : "↓"}
            <Calligraph variant="number" animation="smooth" autoSize={false}>
                {formatPercentage(Math.abs(value))}
            </Calligraph>
        </span>
    )
}

Delta.propTypes = {
    value: PropTypes.number.isRequired,
}

// Odometers are keyed by symbol: rows themselves are keyed by index (the
// skeleton reveals in place when data lands), so on a rank reorder the same
// row hosts another coin — remount the digits instead of morphing one
// coin's price into another's. autoSize is off: it animates the wrapper
// width (layout) on every tick that changes digit count.
const AssetRow = ({ asset }) => (
    <Cell
        start={<ImageAvatar src={assetIcon(asset)} />}
        end={
            <Cell.Text
                title={
                    <>
                        $
                        <Calligraph
                            key={asset.symbol}
                            variant="number"
                            animation="smooth"
                            autoSize={false}
                        >
                            {formatPrice(asset.current_price)}
                        </Calligraph>
                    </>
                }
                description={
                    <Delta
                        key={asset.symbol}
                        value={asset.price_change_percentage_24h ?? asset.pct}
                    />
                }
            />
        }
    >
        <Cell.Text
            title={asset.name}
            description={asset.symbol?.toUpperCase()}
            bold
        />
    </Cell>
)

AssetRow.propTypes = {
    asset: PropTypes.shape({
        name: PropTypes.string,
        symbol: PropTypes.string,
        image: PropTypes.string,
        current_price: PropTypes.number,
        price_change_percentage_24h: PropTypes.number,
        pct: PropTypes.number,
    }).isRequired,
}

// The page scroller lives in PageTransition, a few ancestors up.
const findScrollParent = (node) => {
    for (let el = node.parentElement; el; el = el.parentElement) {
        if (/auto|scroll/.test(getComputedStyle(el).overflowY)) return el
    }
    return null
}

const AssetList = () => {
    const { assets, error } = useAssets()
    const loading = !assets && !error
    const rows = assets ?? PLACEHOLDER_ASSETS

    const listRef = useRef(null)
    const [scrollEl, setScrollEl] = useState(null)
    const [listOffset, setListOffset] = useState(0)

    useLayoutEffect(() => {
        const list = listRef.current
        const scroller = findScrollParent(list)
        setScrollEl(scroller)
        if (!scroller) return undefined
        // Rect-based: the offsetParent chain dead-ends at whichever
        // ancestor happens to carry a transform. Re-measured on resize —
        // the aspect-ratio heatmap above moves the list start.
        const measure = () =>
            setListOffset(
                list.getBoundingClientRect().top -
                    scroller.getBoundingClientRect().top +
                    scroller.scrollTop
            )
        measure()
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [])

    // The compiler skips this component either way; scroll re-renders are the point.
    // eslint-disable-next-line react-hooks/incompatible-library
    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => scrollEl,
        estimateSize: () => ESTIMATED_ROW,
        overscan: OVERSCAN,
        scrollMargin: listOffset,
    })

    return (
        <SectionList.Item header="Today's lists">
            <Skeleton active={loading}>
                <div
                    ref={listRef}
                    className={styles.sizer}
                    style={{ height: virtualizer.getTotalSize() }}
                >
                    {/* Index keys: placeholder and live rows share identity,
                        so bars reveal in place when data lands. */}
                    {virtualizer.getVirtualItems().map((item) => (
                        <div
                            key={item.key}
                            ref={virtualizer.measureElement}
                            data-index={item.index}
                            className={styles.row}
                            style={{
                                transform: `translateY(${item.start - listOffset}px)`,
                            }}
                        >
                            <AssetRow asset={rows[item.index]} />
                        </div>
                    ))}
                </div>
            </Skeleton>
        </SectionList.Item>
    )
}

export default AssetList
