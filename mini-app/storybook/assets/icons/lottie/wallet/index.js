import lottieWalletIconApple from "./wallet_apple.json"
import lottieWalletIconMaterial from "./wallet_material.json"

export default (skin) =>
    skin === "apple" ? lottieWalletIconApple : lottieWalletIconMaterial
