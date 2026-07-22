/**
 * Satori + resvg rendering pipeline for story card images.
 * Loads fonts and assets once, renders story PNGs on demand.
 */
import { readFile } from "fs/promises"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
import { storyTemplate } from "./story-template.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

function toDataUri(buffer, mime) {
	return `data:${mime};base64,${buffer.toString("base64")}`
}

export async function loadAssets() {
	const [semibold, bold, bgBuffer] = await Promise.all([
		readFile(resolve(__dirname, "../../primitives/fonts/SBSansUI-Semibold.otf")),
		readFile(resolve(__dirname, "../../primitives/fonts/SBSansUI-Bold.otf")),
		readFile(resolve(__dirname, "assets/story-bg.jpg")),
	])

	return {
		fonts: [
			{ name: "SB Sans Interface", data: semibold, weight: 600, style: "normal" },
			{ name: "SB Sans Interface", data: bold, weight: 700, style: "normal" },
		],
		bgDataUri: toDataUri(bgBuffer, "image/jpeg"),
	}
}

export async function loadCoinIcon(iconPath) {
	if (!iconPath) return ""

	if (iconPath.startsWith("data:")) return iconPath

	if (iconPath.startsWith("http://") || iconPath.startsWith("https://")) {
		const res = await fetch(iconPath)
		const buf = Buffer.from(await res.arrayBuffer())
		const mime = res.headers.get("content-type") || "image/png"
		return toDataUri(buf, mime)
	}

	const root = resolve(__dirname, "..")
	const filePath = iconPath.startsWith("/")
		? resolve(root, "public", iconPath.slice(1))
		: resolve(root, "public", iconPath)

	const buf = await readFile(filePath)
	const mime = filePath.endsWith(".svg") ? "image/svg+xml" : "image/png"
	return toDataUri(buf, mime)
}

export async function renderStoryPng(params, assets) {
	const coinIconDataUri = await loadCoinIcon(params.coinIcon)

	const vdom = storyTemplate({
		bgDataUri: assets.bgDataUri,
		coinIconDataUri,
		coinName: params.coinName || "TOKEN",
		direction: params.direction || "Long",
		leverage: params.leverage || "1",
		pnlPercent: parseFloat(params.pnl) || 0,
		entryPrice: params.entryPrice || "0.00",
		closePrice: params.closePrice || "0.00",
		timestamp: params.timestamp || new Date().toISOString(),
	})

	const svg = await satori(vdom, {
		width: 360,
		height: 640,
		fonts: assets.fonts,
	})

	const resvg = new Resvg(svg, {
		fitTo: { mode: "zoom", value: 3 },
	})

	return resvg.render().asPng()
}
