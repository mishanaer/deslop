/**
 * Story share configuration.
 * All trade parameters live here — easy to swap for real data.
 */
function randomPnl() {
    return (Math.random() * 100).toFixed(2)
}

const STORY_PARAMS = {
    coinName: "BTC",
    coinIcon: "/icons/avatars/Bitcoin.svg",
    direction: "Long",
    leverage: "10",
    entryPrice: "64250.00",
    closePrice: "91650.00",
}

/** Base URL of the Playwright screenshot server */
const STORY_SERVER = import.meta.env.VITE_STORY_SERVER || window.location.origin

/**
 * Builds the HTTPS URL to the server-rendered 3× story PNG.
 * Playwright renders StoryCard with these params and returns an image.
 */
function getMediaUrl(params = STORY_PARAMS) {
    const query = new URLSearchParams({
        pnl: randomPnl(),
        ...params,
    }).toString()
    return `${STORY_SERVER}/story.png?${query}`
}

/** Widget link sticker attached to the story */
const WIDGET_LINK = {
    url: "https://t.me/wallet",
    name: "Open Wallet",
}

/**
 * Opens the Telegram story editor with a server-rendered
 * trade card image and a widget-link sticker.
 */
export function shareStory(WebApp, params) {
    const mediaUrl = getMediaUrl(params)

    try {
        WebApp.shareToStory(mediaUrl, {
            widget_link: WIDGET_LINK,
        })
    } catch {
        /* shareToStory unavailable outside Telegram */
    }
}

export { STORY_PARAMS }
