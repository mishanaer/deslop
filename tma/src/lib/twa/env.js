import WebApp from "./webApp"

// initData is non-empty only inside the Telegram runtime.
export const isTelegram = () => Boolean(WebApp.initData)
