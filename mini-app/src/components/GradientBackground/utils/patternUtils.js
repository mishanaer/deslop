export const fillCanvasWithPattern = (
    ctx,
    canvas,
    source,
    width,
    height,
    isDark
) => {
    let imageWidth = source.width
    let imageHeight = source.height

    const windowHeight = height / canvas.dpr
    const patternHeight = (500 + windowHeight / 2.5) * canvas.dpr

    const ratio = patternHeight / imageHeight
    imageWidth *= ratio
    imageHeight = patternHeight

    ctx.clearRect(0, 0, width, height)

    if (isDark) {
        ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue("--mini-app-static-black")
            .trim()
        ctx.fillRect(0, 0, width, height)
        ctx.globalCompositeOperation = "destination-out"
    } else {
        ctx.globalCompositeOperation = "source-over"
    }

    const drawRow = (y) => {
        for (let x = 0; x < width; x += imageWidth) {
            ctx.drawImage(source, x, y, imageWidth, imageHeight)
        }
    }

    const centerY = (height - imageHeight) / 2
    drawRow(centerY)

    if (centerY > 0) {
        let topY = centerY
        do {
            topY -= imageHeight
            drawRow(topY)
        } while (topY >= 0)
    }

    const endY = height - 1
    for (
        let bottomY = centerY + imageHeight;
        bottomY < endY;
        bottomY += imageHeight
    ) {
        drawRow(bottomY)
    }

    ctx.globalCompositeOperation = "source-over"
}
