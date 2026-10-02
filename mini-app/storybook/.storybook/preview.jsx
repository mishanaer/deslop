import { createElement } from "react"
import MiniAppProvider from "../../MiniAppProvider"
import "./preview.css"

const preview = {
    decorators: [
        (Story) => createElement(MiniAppProvider, null, createElement(Story)),
    ],
    parameters: {
        layout: "fullscreen",
        controls: { expanded: true },
        options: {
            storySort: {
                order: ["Primitives", "Components", "Screens"],
            },
        },
    },
}

export default preview
