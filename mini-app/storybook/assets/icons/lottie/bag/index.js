import lottieBagIconApple from "./bag_apple.json"
import lottieBagIconMaterial from "./bag_material.json"

export default (skin) =>
    skin === "apple" ? lottieBagIconApple : lottieBagIconMaterial
