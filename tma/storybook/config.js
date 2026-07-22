import lazyWithPreload from "../src/utils/lazyWithPreload"
import componentPages from "./componentPages"

const config = [
    {
        category: "Primitives",
        pages: [
            {
                title: "Colors",
                component: lazyWithPreload(
                    () => import("./ui-kit/Colors")
                ),
            },
            {
                title: "Icons",
                component: lazyWithPreload(
                    () => import("./ui-kit/Icons")
                ),
            },
            {
                title: "Typography",
                component: lazyWithPreload(
                    () => import("./ui-kit/Typography")
                ),
            },
        ],
    },
    {
        category: "Components",
        pages: componentPages,
    },
    {
        category: "Text Effects",
        pages: [
            {
                title: "Streaming Text",
                component: lazyWithPreload(
                    () =>
                        import("../src/components/StreamingText/StreamingText.showcase")
                ),
            },
            {
                title: "Particle Effect",
                component: lazyWithPreload(
                    () =>
                        import("../src/components/ParticleEffect/ParticleEffect.showcase")
                ),
            },
            {
                title: "Calligraph",
                component: lazyWithPreload(
                    () => import("../src/components/Calligraph/Calligraph.showcase")
                ),
            },
            {
                title: "Fit Text",
                component: lazyWithPreload(
                    () => import("../src/components/FitText/FitText.showcase")
                ),
            },
        ],
    },
    {
        category: "Telegram",
        pages: [
            {
                title: "Navigation Bar",
                component: lazyWithPreload(
                    () => import("../src/pages/showcases/NavigationBar")
                ),
            },
            {
                title: "Bottom Bar",
                component: lazyWithPreload(
                    () => import("../src/pages/showcases/BottomBar")
                ),
            },
            {
                title: "Haptic Feedback",
                component: lazyWithPreload(
                    () => import("../src/pages/showcases/HapticFeedback")
                ),
            },
        ],
    },
    {
        category: "Prototypes",
        // Full app prototypes own their chrome — no browser AppBar.
        header: false,
        pages: [
            {
                title: "Input Page",
                component: lazyWithPreload(
                    () => import("../src/components/TextField/TextField.showcase")
                ),
            },
            {
                title: "Navigation",
                component: lazyWithPreload(
                    () => import("../src/pages/prototypes/NewNavigation")
                ),
                routeSuffix: "/:rest*?",
            },
            {
                title: "Color Asset Page",
                component: lazyWithPreload(
                    () => import("../src/pages/prototypes/ColorAssetPage")
                ),
            },
            {
                title: "Onboarding",
                component: lazyWithPreload(
                    () => import("../src/pages/prototypes/Onboarding")
                ),
            },
            {
                title: "Background Tests",
                component: lazyWithPreload(
                    () => import("../src/pages/prototypes/ColorChanging")
                ),
            },
        ],
    },
]

export default config
