import { createServer } from "http"
import { loadAssets, renderStoryPng } from "./story-render.js"

const PORT = Number(process.env.STORY_PORT) || 3001

let assets

createServer(async (req, res) => {
	const url = new URL(req.url, `http://localhost:${PORT}`)

	if (url.pathname !== "/story.png") {
		res.writeHead(404)
		res.end("Not found")
		return
	}

	try {
		const params = Object.fromEntries(url.searchParams)
		const png = await renderStoryPng(params, assets)

		res.writeHead(200, {
			"Content-Type": "image/png",
			"Content-Length": png.byteLength,
			"Cache-Control": "public, max-age=60",
		})
		res.end(png)
	} catch (err) {
		console.error("Screenshot failed:", err)
		res.writeHead(500)
		res.end("Screenshot failed")
	}
}).listen(PORT, async () => {
	assets = await loadAssets()
	console.log(`Story screenshot server: http://localhost:${PORT}/story.png`)
})
