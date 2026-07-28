import { computeGradientPixels } from "./gradientCompute"

self.onmessage = (e) => {
    const { id, ...params } = e.data
    const pixels = computeGradientPixels(params)
    self.postMessage(
        { id, pixels, width: params.scaledWidth, height: params.scaledHeight },
        [pixels.buffer]
    )
}
