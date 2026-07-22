import PropTypes from "prop-types"

import Text from "../../../../../components/Text"
import SectionList from "../../../../../components/SectionList"
import Tappable from "../../../../../components/Tappable"
import {
    waveRef,
    useRedactionClassName,
} from "../../../../../components/Skeleton"

import useAssets from "../../../../../hooks/useAssets"

import { squarify } from "./treemap"

import * as styles from "./AssetHeatmap.module.scss"

const cx = (...classes) => classes.filter(Boolean).join(" ")

const MAP_ASPECT = 1074 / 743
const TOP_COUNT = 25

// Volume^0.4 area compression: BTC/ETH out-trade the tail ~500x and would
// swallow the map raw; 0.4 keeps the dominance readable.
const AREA_EXPONENT = 0.4

// Tiles below these map fractions drop the percent line.
const MIN_CHANGE_HEIGHT = 13
const MIN_CHANGE_WIDTH = 9

// FitText stand-in: tile geometry is known before paint, so the font size
// is a pure function of the rect (in cqw units; height converts through
// MAP_ASPECT) — no ResizeObserver, no measure-then-scale pass. sqrt(area)
// shrinks the tail progressively, the width/height terms are hard bounds
// against clipping, and the stylesheet caps the result at the ramp size.
const AREA_K = 0.22
const FILL_W = 0.78
const FILL_H = 0.72
const LINE_EM = 1.1 // pinned in the stylesheet
const GAP_EM = 0.2 // the 2px labels gap, at typical tile type size
const CHANGE_SCALE = 0.85 // percent line, relative to the ticker (see SCSS)
const SOLO_AREA_K = 0.34

// Canvas-measured glyph widths in em, cached per unique label — exact with
// zero layout involvement. 600 covers both skins: material's medium only
// renders narrower.
const measureCtx = document.createElement("canvas").getContext("2d")
const emWidths = new Map()
const labelEm = (text, weight) => {
    const key = `${weight} ${text}`
    let em = emWidths.get(key)
    if (em === undefined) {
        measureCtx.font = `${weight} 100px "SB Sans Interface", sans-serif`
        em = measureCtx.measureText(text).width / 100
        emWidths.set(key, em)
    }
    return em
}

// Stables sit at ~0% yet dominate turnover (USDT is the biggest volume) —
// meaningless near-flat tiles; the screener already tags them.
const isStablecoin = (asset) => asset.categories.includes("stablecoins")

// Largest first; `change` is quantized to display precision so sub-0.01%
// websocket jitter cannot invalidate tiles whose label and tone are fixed.
const selectHeatmapAssets = (assets) =>
    assets
        .filter(
            (asset) =>
                !isStablecoin(asset) &&
                asset.price_change_percentage_24h !== null &&
                asset.total_volume > 0
        )
        .sort((a, b) => b.total_volume - a.total_volume)
        .slice(0, TOP_COUNT)
        .map((asset) => ({
            symbol: asset.symbol.toUpperCase(),
            change: Number(asset.price_change_percentage_24h.toFixed(2)),
            volume: asset.total_volume,
        }))

// Squarify must see the rendered proportions: lay out in map units, then
// convert the vertical axis back to percentages.
const layoutAssets = (rows) => {
    const height = 100 / MAP_ASPECT
    return squarify(
        rows.map((row) => row.volume ** AREA_EXPONENT),
        100,
        height
    ).map((rect) => ({
        x: rect.x,
        y: (rect.y / height) * 100,
        w: rect.w,
        h: (rect.h / height) * 100,
    }))
}

const formatChange = (change) =>
    `${change < 0 ? "↓" : "↑"}\u202F${Math.abs(Number(change.toFixed(2)))}%`

const SKELETON_ROWS = Array.from({ length: TOP_COUNT }, (_, i) => ({
    id: `s${i}`,
    volume: 0.8 ** i,
}))

const formatUpdatedAt = (date) =>
    `Today at ${date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    })}`

const toneClass = (change) => {
    const strength = Math.abs(change) >= 3 ? 3 : Math.abs(change) >= 1 ? 2 : 1
    return styles[`${change < 0 ? "loss" : "gain"}${strength}`]
}

// Scalar props: the store publishes a fresh snapshot every flush, so object
// props would defeat the React Compiler cache — with scalars only tiles
// whose change actually moved re-render.
const HeatmapTile = ({ symbol, change, x, y, w, h }) => {
    const showChange = h >= MIN_CHANGE_HEIGHT && w >= MIN_CHANGE_WIDTH
    const label = formatChange(change)
    const hCq = h / MAP_ASPECT // height % -> cqw units
    const widestEm = Math.max(
        labelEm(symbol, 600),
        showChange ? labelEm(label, 400) * CHANGE_SCALE : 0
    )
    const linesEm = showChange
        ? LINE_EM * (1 + CHANGE_SCALE) + GAP_EM
        : LINE_EM
    const fit = Math.min(
        (showChange ? AREA_K : SOLO_AREA_K) * Math.sqrt(w * hCq),
        (FILL_W * w) / widestEm,
        (FILL_H * hCq) / linesEm
    )

    return (
        <Tappable
            className={cx(styles.tile, toneClass(change))}
            style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: `${w}%`,
                height: `${h}%`,
                "--fit": `${fit.toFixed(3)}cqw`,
            }}
        >
            <div className={styles.labels}>
                <Text variant="subheadline2" weight="semibold">
                    {symbol}
                </Text>
                {showChange && (
                    <div className={styles.change}>
                        <Text variant="subheadline2">
                            {label}
                        </Text>
                    </div>
                )}
            </div>
        </Tappable>
    )
}

HeatmapTile.propTypes = {
    symbol: PropTypes.string.isRequired,
    change: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    w: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired,
}

const SkeletonTile = ({ x, y, w, h }) => {
    const redaction = useRedactionClassName(true)
    return (
        <div
            ref={waveRef}
            className={cx(styles.tile, styles.skeletonTile, redaction)}
            style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: `${w}%`,
                height: `${h}%`,
            }}
        />
    )
}

SkeletonTile.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    w: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired,
}

const AssetHeatmap = () => {
    const { assets, updatedAt, error } = useAssets()
    const loading = !assets && !error

    const rows = assets ? selectHeatmapAssets(assets) : SKELETON_ROWS
    const rects = layoutAssets(rows)

    return (
        <SectionList.Item
            className={styles.transparentSection}
            header="Market heatmap"
            description={
                updatedAt ? formatUpdatedAt(updatedAt) : "Today at 00:00"
            }
        >
            <div className={styles.map}>
                <div className={styles.tiles}>
                    {rows.map((asset, index) =>
                        loading ? (
                            <SkeletonTile
                                key={asset.id}
                                x={rects[index].x}
                                y={rects[index].y}
                                w={rects[index].w}
                                h={rects[index].h}
                            />
                        ) : (
                            <HeatmapTile
                                key={asset.symbol}
                                symbol={asset.symbol}
                                change={asset.change}
                                x={rects[index].x}
                                y={rects[index].y}
                                w={rects[index].w}
                                h={rects[index].h}
                            />
                        )
                    )}
                </div>
            </div>
        </SectionList.Item>
    )
}

export default AssetHeatmap
