const noop = () => {}

const createButton = () => ({
    show: noop,
    hide: noop,
    enable: noop,
    disable: noop,
    showProgress: noop,
    hideProgress: noop,
    setParams: noop,
    setText: noop,
    onClick: noop,
    offClick: noop,
})

const browserWebApp = {
    initData: "",
    themeParams: {},
    viewportHeight: 0,
    BackButton: createButton(),
    SettingsButton: createButton(),
    MainButton: createButton(),
    SecondaryButton: createButton(),
    HapticFeedback: {
        impactOccurred: noop,
        notificationOccurred: noop,
        selectionChanged: noop,
    },
    onEvent: noop,
    offEvent: noop,
    expand: noop,
    setHeaderColor: noop,
    setBackgroundColor: noop,
    setBottomBarColor: noop,
    disableVerticalSwipes: noop,
    enableVerticalSwipes: noop,
    requestFullscreen: noop,
    exitFullscreen: noop,
    shareToStory: noop,
}

const WebApp = globalThis.Telegram?.WebApp ?? browserWebApp

export default WebApp
