// Squarified treemap (Bruls, Huizing, van Wijk): items join the current
// strip while that improves the worst aspect ratio. Feed weights sorted
// descending; returns rects ({ x, y, w, h }) in input units and order.
const worstRatio = (row, side) => {
    const sum = row.reduce((acc, area) => acc + area, 0)
    const max = Math.max(...row)
    const min = Math.min(...row)
    return Math.max(
        (side * side * max) / (sum * sum),
        (sum * sum) / (side * side * min)
    )
}

export const squarify = (weights, width, height) => {
    const total = weights.reduce((acc, weight) => acc + weight, 0)
    const scale = (width * height) / total
    const rects = []
    const rect = { x: 0, y: 0, w: width, h: height }
    let row = []

    const layoutRow = () => {
        const sum = row.reduce((acc, area) => acc + area, 0)
        if (rect.w >= rect.h) {
            const stripW = sum / rect.h
            let y = rect.y
            for (const area of row) {
                rects.push({ x: rect.x, y, w: stripW, h: area / stripW })
                y += area / stripW
            }
            rect.x += stripW
            rect.w -= stripW
        } else {
            const stripH = sum / rect.w
            let x = rect.x
            for (const area of row) {
                rects.push({ x, y: rect.y, w: area / stripH, h: stripH })
                x += area / stripH
            }
            rect.y += stripH
            rect.h -= stripH
        }
        row = []
    }

    for (const weight of weights) {
        const area = weight * scale
        const side = Math.min(rect.w, rect.h)
        if (
            row.length &&
            worstRatio([...row, area], side) > worstRatio(row, side)
        ) {
            layoutRow()
        }
        row.push(area)
    }
    if (row.length) layoutRow()

    return rects
}
