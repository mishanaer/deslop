import { createElement } from "react"
import ColorsExample from "../examples/primitives/Colors"
import IconsExample from "../examples/primitives/Icons"
import TypographyExample from "../examples/primitives/Typography"

export default { title: "Primitives" }

const story = (Component) => ({ render: () => createElement(Component) })

export const Colors = story(ColorsExample)
export const MaterialSymbols = story(IconsExample)
export const Typography = story(TypographyExample)
