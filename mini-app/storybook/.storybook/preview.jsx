import MiniAppProvider from "../../MiniAppProvider"
import "./preview.css"

const preview = {
    decorators: [
        (Story) => (
            <MiniAppProvider>
                <Story />
            </MiniAppProvider>
        ),
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
