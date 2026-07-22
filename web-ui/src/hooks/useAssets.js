import { useSyncExternalStore } from "react"

import { openQuoteStream } from "../utils/tradingViewQuotes"

// TradingView's coin screener defines the asset universe (prices, deltas,
// volumes, categories, logo ids in one open-CORS request); live prices then
// stream over the quote websocket and are flushed into the snapshot at most
// once per FLUSH_INTERVAL.
const ENDPOINT = "https://scanner.tradingview.com/coin/scan"
const SCANNER_INTERVAL = 60_000
const FLUSH_INTERVAL = 1_000

const REQUEST = {
    columns: [
        "base_currency",
        "base_currency_desc",
        "base_currency_logoid",
        "close",
        "24h_close_change|5",
        "24h_vol_cmc",
        "crypto_common_categories",
    ],
    sort: { sortBy: "crypto_total_rank", sortOrder: "asc" },
    range: [0, 100],
}

// Icon URLs derive from the scanner's own `logoid` — never guessed from the
// ticker (HYPE != XTVCHYPE).
const LOGO_BASE = "https://s3-symbol-logo.tradingview.com"
const logoUrl = (logoid) => (logoid ? `${LOGO_BASE}/${logoid}--big.svg` : null)

// Rows keep the CoinGecko field names the screens already consume;
// `quoteSymbol` keys the websocket ticks, `image` feeds ColorAssetPage.
const mapRows = (data) =>
    data.map(({ s, d }) => ({
        quoteSymbol: s,
        symbol: d[0]?.toLowerCase(),
        name: d[1],
        logoid: d[2],
        image: logoUrl(d[2]),
        current_price: d[3],
        price_change_percentage_24h: d[4],
        total_volume: d[5],
        categories: d[6] ?? [],
    }))

// Module-level store shared by every subscribed screen; the snapshot
// persists between mounts so revisits paint instantly.
let snapshot = { assets: null, updatedAt: null, error: null }
let base = null // last scanner rows, before websocket ticks
let baseAt = 0 // timestamp of the current scanner snapshot
const ticks = new Map() // quoteSymbol -> latest streamed fields + `at`
const subscribers = new Set()
let scannerTimer = null
let flushTimer = null
let stream = null
let streamKey = ""
let dirty = false

const notify = () => subscribers.forEach((listener) => listener())

// Live ticks win over scanner closes only while fresher than the current
// snapshot: after an outage, or once a symbol goes quiet, the scanner wins
// again until the symbol ticks anew.
const applyTicks = (rows) =>
    rows.map((row) => {
        const tick = ticks.get(row.quoteSymbol)
        if (!tick || tick.at < baseAt) return row
        return {
            ...row,
            current_price: tick.lp ?? row.current_price,
            price_change_percentage_24h:
                tick.chp ?? row.price_change_percentage_24h,
        }
    })

const onTick = (name, values) => {
    ticks.set(name, { ...ticks.get(name), ...values, at: Date.now() })
    dirty = true
}

// (Re)subscribe the quote stream when the universe actually changes.
const ensureStream = () => {
    const key = base.map((row) => row.quoteSymbol).join(",")
    if (key === streamKey) return
    stream?.close()
    stream = openQuoteStream({
        symbols: base.map((row) => row.quoteSymbol),
        fields: ["lp", "chp"],
        onTick,
    })
    streamKey = key
}

const publish = () => {
    snapshot = {
        assets: applyTicks(base),
        updatedAt: new Date(),
        error: null,
    }
    notify()
}

const flush = () => {
    if (!dirty || !base) return
    dirty = false
    publish()
}

const refresh = async () => {
    try {
        // No Content-Type header on purpose: the scanner's preflight
        // rejects it, while a bare POST is a CORS simple request and the
        // server parses the JSON body regardless.
        const response = await fetch(ENDPOINT, {
            method: "POST",
            body: JSON.stringify(REQUEST),
        })
        const { data } = await response.json()
        // The last subscriber may have unmounted during the await — bail
        // before reopening a stream nobody owns.
        if (!subscribers.size) return
        base = mapRows(data)
        baseAt = Date.now()
        ensureStream()
        publish()
    } catch (error) {
        // Keep serving the last good snapshot; surface the error only when
        // there is no data at all.
        if (!snapshot.assets) {
            snapshot = { assets: null, updatedAt: null, error }
            notify()
        }
    }
}

const subscribe = (listener) => {
    subscribers.add(listener)
    if (subscribers.size === 1) {
        refresh()
        scannerTimer = setInterval(refresh, SCANNER_INTERVAL)
        flushTimer = setInterval(flush, FLUSH_INTERVAL)
    }
    return () => {
        subscribers.delete(listener)
        if (subscribers.size) return
        clearInterval(scannerTimer)
        clearInterval(flushTimer)
        stream?.close()
        stream = null
        streamKey = ""
        ticks.clear() // drop the stale price cache; next mount refetches
    }
}

// Live asset feed; `assets` stays null until the first response so screens
// can render their skeleton in place.
export default function useAssets() {
    return useSyncExternalStore(subscribe, () => snapshot)
}
