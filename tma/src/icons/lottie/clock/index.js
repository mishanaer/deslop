import lottieClockIconApple from "./clock_apple.json"
import lottieClockIconMaterial from "./clock_material.json"

export default (skin) =>
    skin === "apple" ? lottieClockIconApple : lottieClockIconMaterial
