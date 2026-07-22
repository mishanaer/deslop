/**
 * Satori virtual-DOM template for the story card.
 * Mirrors the layout in src/components/StoryCard exactly,
 * using inline styles instead of SCSS modules.
 */

function h(type, props, ...children) {
	const flat = children.flat().filter((c) => c != null && c !== false)
	return { type, props: { ...props, children: flat.length === 1 ? flat[0] : flat.length ? flat : undefined } }
}

const priceFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 })

function formatPrice(value) {
	const num = typeof value === "string" ? parseFloat(value) : value
	return `$${priceFormatter.format(Math.round(num))}`
}

function formatTimestamp(isoString) {
	const date = new Date(isoString)
	const hours = String(date.getHours()).padStart(2, "0")
	const minutes = String(date.getMinutes()).padStart(2, "0")
	const offset = -date.getTimezoneOffset() / 60
	const sign = offset >= 0 ? "+" : ""
	const time = `${hours}:${minutes} (UTC ${sign}${offset})`

	const day = date.getDate()
	const month = date.toLocaleString("en", { month: "short" })
	const year = date.getFullYear()

	return { time, date: `${day} ${month}, ${year}` }
}

function badge(text) {
	return h("span", {
		style: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: "1.5px 7px 2.5px",
			borderRadius: 11,
			background: "rgba(167, 186, 242, 0.13)",
			fontSize: 13,
			fontWeight: 600,
			lineHeight: "18px",
			letterSpacing: 0.52,
			color: "rgba(167, 186, 242, 0.72)",
		},
	}, text)
}

export function storyTemplate({ bgDataUri, coinIconDataUri, coinName, direction, leverage, pnlPercent, entryPrice, closePrice, timestamp }) {
	const isPositive = pnlPercent >= 0
	const ts = formatTimestamp(timestamp)

	return h("div", {
		style: {
			position: "relative",
			width: 360,
			height: 640,
			display: "flex",
			background: "#2b3544",
			fontFamily: "SB Sans Interface",
			color: "#fff",
			overflow: "hidden",
		},
	},
		h("img", { src: bgDataUri, width: 360, height: 640, style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" } }),

		coinIconDataUri && h("img", {
			src: coinIconDataUri,
			width: 40,
			height: 40,
			style: { position: "absolute", top: 159, left: 26, width: 40, height: 40, borderRadius: 100, objectFit: "cover" },
		}),

		h("div", {
			style: { position: "absolute", top: 72, right: 28, display: "flex", flexDirection: "column", alignItems: "flex-end", fontSize: 13, fontWeight: 600, lineHeight: "18px", letterSpacing: 0.48, color: "#5d80af" },
		},
			h("span", {}, ts.time),
			h("span", {}, ts.date),
		),

		h("div", {
			style: { position: "absolute", top: 215, left: 28, display: "flex", alignItems: "flex-end", gap: 8 },
		},
			h("span", { style: { fontSize: 16, fontWeight: 600, lineHeight: "22px", letterSpacing: 0.416 } }, coinName),
			badge(direction),
			badge(`${leverage}\u00d7`),
		),

		h("div", {
			style: { position: "absolute", top: 241, left: 28, fontSize: 48, fontWeight: 700, lineHeight: "56px", letterSpacing: 0.4, color: isPositive ? "#1fcf71" : "#f44" },
		}, `${isPositive ? "+" : ""}${pnlPercent.toFixed(2)}%`),

		h("div", {
			style: { position: "absolute", top: 317, left: 28, display: "flex", gap: 37 },
		},
			priceColumn("Entry Price", formatPrice(entryPrice)),
			priceColumn("Close Price", formatPrice(closePrice)),
		),
	)
}

function priceColumn(label, value) {
	return h("div", {
		style: { display: "flex", flexDirection: "column", gap: 2 },
	},
		h("span", { style: { fontSize: 12, fontWeight: 600, lineHeight: "15px", letterSpacing: 0.552, color: "#616c8d" } }, label),
		h("span", { style: { fontSize: 13, fontWeight: 600, lineHeight: "18px", letterSpacing: 0.52 } }, value),
	)
}
