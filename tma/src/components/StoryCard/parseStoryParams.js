/**
 * Parses URL query parameters from the hash portion of the URL
 * into props for the StoryCard component.
 */
export function parseStoryParams() {
    const hash = window.location.hash
    const queryIndex = hash.indexOf("?")
    const search = queryIndex >= 0 ? hash.slice(queryIndex) : ""
    const params = new URLSearchParams(search)

    return {
        coinIcon: params.get("coinIcon") || "",
        coinName: params.get("coinName") || "TOKEN",
        direction: params.get("direction") === "Short" ? "Short" : "Long",
        leverage: params.get("leverage") || "1",
        pnlPercent: parseFloat(params.get("pnl")) || 0,
        entryPrice: params.get("entryPrice") || "0.00",
        closePrice: params.get("closePrice") || "0.00",
        timestamp: params.get("timestamp") || new Date().toISOString(),
    }
}
