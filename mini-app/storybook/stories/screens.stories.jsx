import { createElement } from "react"
import ColorAssetPageExample from "../examples/screens/ColorAssetPage"
import ColorChangingExample from "../examples/screens/ColorChanging"
import NewNavigationExample from "../examples/screens/NewNavigation"
import OnboardingExample from "../examples/screens/Onboarding"
import StoryCardExample from "../examples/screens/StoryCard"
import TonSpaceExample from "../examples/screens/TS"
import TradingExample from "../examples/screens/Trading"
import WalletExample from "../examples/screens/Wallet"

export default { title: "Screens" }

const story = (Component) => ({ render: () => createElement(Component) })

export const ColorAsset = story(ColorAssetPageExample)
export const ColorChanging = story(ColorChangingExample)
export const Navigation = story(NewNavigationExample)
export const Onboarding = story(OnboardingExample)
export const StoryCard = story(StoryCardExample)
export const TonSpace = story(TonSpaceExample)
export const Trading = story(TradingExample)
export const Wallet = story(WalletExample)
