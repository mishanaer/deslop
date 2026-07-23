import { writeFile } from "fs/promises"
import { parseArgs as nodeParseArgs } from "node:util"
import { fileURLToPath } from "url"
import { loadAssets, renderStoryPng } from "./story-render.js"

export async function screenshotStory(options = {}) {
	const {
		coinName = "TOKEN",
		coinIcon = "",
		direction = "Long",
		leverage = "1",
		pnl = "0",
		entryPrice = "0.00",
		closePrice = "0.00",
		timestamp = new Date().toISOString(),
		output,
	} = options

	const assets = await loadAssets()
	const params = { coinName, coinIcon, direction, leverage, pnl, entryPrice, closePrice, timestamp }
	const png = await renderStoryPng(params, assets)

	if (output) {
		await writeFile(output, png)
		console.log(`Screenshot saved: ${output}`)
		return output
	}
	return png
}

const __filename = fileURLToPath(import.meta.url)
if (process.argv[1] === __filename) {
	const { values: args } = nodeParseArgs({
		options: {
			coinName: { type: "string" },
			coinIcon: { type: "string" },
			direction: { type: "string" },
			leverage: { type: "string" },
			pnl: { type: "string" },
			entryPrice: { type: "string" },
			closePrice: { type: "string" },
			timestamp: { type: "string" },
			output: { type: "string" },
		},
		strict: false,
	})
	screenshotStory({ output: "story.png", ...args })
}
