import { normalizePositions, parseColor } from "../utils/gradientUtils"

export function computeGradientPixels({
    scaledWidth,
    scaledHeight,
    colors,
    positions,
    rotation,
}) {
    const topRight = parseColor(colors[0])
    const bottomRight = parseColor(colors[1])
    const bottomLeft = parseColor(colors[2])
    const topLeft = parseColor(colors[3])

    const validPositions = normalizePositions(positions)
    const rotationRad = (rotation * Math.PI) / 180
    const centerX = 0.5
    const centerY = 0.5

    const rotatedPositions = validPositions.map((pos) => {
        if (rotationRad === 0) return pos
        const relX = pos.x - centerX
        const relY = pos.y - centerY
        const cos = Math.cos(rotationRad)
        const sin = Math.sin(rotationRad)
        return {
            x: relX * cos - relY * sin + centerX,
            y: relX * sin + relY * cos + centerY,
        }
    })

    const pixels = new Uint8ClampedArray(scaledWidth * scaledHeight * 4)
    const colorsArray = [topRight, bottomRight, bottomLeft, topLeft]

    for (let y = 0; y < scaledHeight; y++) {
        const directPixelY = y / scaledHeight
        const centerDistanceY = directPixelY - 0.5
        const centerDistanceY2 = centerDistanceY * centerDistanceY

        for (let x = 0; x < scaledWidth; x++) {
            const index = (y * scaledWidth + x) * 4

            const directPixelX = x / scaledWidth
            const centerDistanceX = directPixelX - 0.5
            const centerDistance = Math.sqrt(
                centerDistanceX * centerDistanceX + centerDistanceY2
            )

            const swirlFactor = 0.35 * centerDistance
            const theta = swirlFactor * swirlFactor * 0.8 * 8.0
            const sinTheta = Math.sin(theta)
            const cosTheta = Math.cos(theta)

            const pixelX = Math.max(
                0.0,
                Math.min(
                    1.0,
                    0.5 +
                        centerDistanceX * cosTheta -
                        centerDistanceY * sinTheta
                )
            )
            const pixelY = Math.max(
                0.0,
                Math.min(
                    1.0,
                    0.5 +
                        centerDistanceX * sinTheta +
                        centerDistanceY * cosTheta
                )
            )

            let distanceSum = 0.0
            let r = 0.0
            let g = 0.0
            let b = 0.0

            for (let i = 0; i < 4; i++) {
                const distanceX = pixelX - rotatedPositions[i].x
                const distanceY = pixelY - rotatedPositions[i].y
                let distance = Math.max(
                    0.0,
                    0.9 -
                        Math.sqrt(distanceX * distanceX + distanceY * distanceY)
                )
                distance = distance * distance * distance * distance
                distanceSum += distance
                r += distance * colorsArray[i][0]
                g += distance * colorsArray[i][1]
                b += distance * colorsArray[i][2]
            }

            pixels[index] = Math.round(r / distanceSum)
            pixels[index + 1] = Math.round(g / distanceSum)
            pixels[index + 2] = Math.round(b / distanceSum)
            pixels[index + 3] = 255
        }
    }

    return pixels
}
