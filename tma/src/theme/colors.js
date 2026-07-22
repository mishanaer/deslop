export const tmaSemanticColors = [
    { name: "Action Primary Background", token: "--tma-action-primary-background" },
    { name: "Action Primary Foreground", token: "--tma-action-primary-foreground" },
    {
        name: "Action Destructive Background",
        token: "--tma-action-destructive-background",
    },
    {
        name: "Action Destructive Foreground",
        token: "--tma-action-destructive-foreground",
    },
    { name: "Background", token: "--tma-background" },
    { name: "Text Primary", token: "--tma-text-primary" },
    { name: "Text Secondary", token: "--tma-text-secondary" },
    { name: "Section Text", token: "--tma-text-section" },
    { name: "Separator", token: "--tma-separator" },
    { name: "Control Active", token: "--tma-control-active" },
    { name: "Control Disabled", token: "--tma-control-disabled" },
    { name: "Text Disabled", token: "--tma-text-disabled" },
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

export const getTmaColor = (token) =>
    getResolvedColorToken(`--tma-${token}`)
