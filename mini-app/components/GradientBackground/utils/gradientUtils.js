import { DEFAULT_POSITIONS } from "./constants"

export const parseColor = (color) => {
    if (!color) return [0, 0, 0]

    if (color.startsWith("#")) {
        const hex = color.slice(1)
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        return [r, g, b]
    }

    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    if (rgbMatch) {
        return [
            parseInt(rgbMatch[1], 10),
            parseInt(rgbMatch[2], 10),
            parseInt(rgbMatch[3], 10),
        ]
    }

    return [0, 0, 0]
}

export const parseSize = (size) => {
    if (!size) return null
    const match = size.toString().match(/^(\d+(?:\.\d+)?)(px)?$/)
    if (match) {
        return parseFloat(match[1])
    }
    return null
}

export const getContainerDimensions = (container) => {
    const rect = container.getBoundingClientRect()
    const styleHeight = container.style?.height
    const styleWidth = container.style?.width

    const width = rect.width || parseSize(styleWidth) || window.innerWidth
    const height =
        rect.height || parseSize(styleHeight) || window.innerHeight || 100

    return { width, height }
}

export const normalizePositions = (positions) => {
    const colorPositions = positions || DEFAULT_POSITIONS

    return colorPositions.map((pos, index) => {
        if (!pos || typeof pos.x !== "number" || typeof pos.y !== "number") {
            console.warn(`Invalid position at index ${index}, using default`)
            return DEFAULT_POSITIONS[index]
        }

        return {
            x: Math.max(0, Math.min(1, pos.x)),
            y: Math.max(0, Math.min(1, pos.y)),
        }
    })
}
