import { getColor } from "colorthief"

self.onmessage = async (e) => {
    const { id, bitmap, quality } = e.data
    try {
        const color = await getColor(bitmap, { quality })
        self.postMessage({ id, hex: color.hex() })
    } catch (err) {
        self.postMessage({
            id,
            error: err?.message || "accent extraction failed",
        })
    } finally {
        if (bitmap && typeof bitmap.close === "function") bitmap.close()
    }
}
