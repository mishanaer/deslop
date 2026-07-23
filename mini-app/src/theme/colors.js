export const miniAppSemanticColors = [
    { name: "Action Primary Background", token: "--mini-app-action-primary-background" },
    { name: "Action Primary Foreground", token: "--mini-app-action-primary-foreground" },
    {
        name: "Action Destructive Background",
        token: "--mini-app-action-destructive-background",
    },
    {
        name: "Action Destructive Foreground",
        token: "--mini-app-action-destructive-foreground",
    },
    { name: "Background", token: "--mini-app-background" },
    { name: "Text Primary", token: "--mini-app-text-primary" },
    { name: "Text Secondary", token: "--mini-app-text-secondary" },
    { name: "Section Text", token: "--mini-app-text-section" },
    { name: "Separator", token: "--mini-app-separator" },
    { name: "Control Active", token: "--mini-app-control-active" },
    { name: "Control Disabled", token: "--mini-app-control-disabled" },
    { name: "Text Disabled", token: "--mini-app-text-disabled" },
]

const rgbToHex = (value) => {
    const srgb = value.match(
        /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/
    )
    const rgb = value.match(
        /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/
    )
    const channels = srgb
        ? srgb.slice(1, 4).map((channel) => Number(channel) * 255)
        : rgb?.slice(1, 4).map(Number)
    if (!channels || channels.length !== 3) return value

    return `#${channels
        .map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
        .join("")}`
}

export const getResolvedColorToken = (token) => {
    if (typeof document === "undefined") return ""

    const probe = document.createElement("span")
    probe.style.color = `var(${token})`
    document.documentElement.append(probe)
    const color = getComputedStyle(probe).color
    probe.remove()

    return rgbToHex(color)
}

export const getMiniAppColor = (token) =>
    getResolvedColorToken(`--mini-app-${token}`)
