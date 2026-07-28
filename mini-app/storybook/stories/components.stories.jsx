import { createElement } from "react"
import BackButtonLayersExample from "../examples/components/PanelHeader/BackButtonLayers.example"
import ButtonExample from "../examples/components/Button/Button.example"
import CalligraphExample from "../examples/components/Calligraph/Calligraph.example"
import CellExample from "../examples/components/Cells/Cells.example"
import CellStackExample from "../examples/components/CellStack/CellStack.example"
import CollapsibleExample from "../examples/components/Collapsible/Collapsible.example"
import DropdownMenuExample from "../examples/components/DropdownMenu/DropdownMenu.example"
import FitTextExample from "../examples/components/FitText/FitText.example"
import GalleryExample from "../examples/components/Gallery/Gallery.example"
import ImageAvatarExample from "../examples/components/ImageAvatar/ImageAvatar.example"
import InitialsAvatarExample from "../examples/components/InitialsAvatar/InitialsAvatar.example"
import MarkdownExample from "../examples/components/Markdown/Markdown.example"
import ModalViewExample from "../examples/components/ModalView/ModalView.example"
import PanelHeaderExample from "../examples/components/PanelHeader/PanelHeader.example"
import ParticleEffectExample from "../examples/components/ParticleEffect/ParticleEffect.example"
import PickerExample from "../examples/components/Picker/Picker.example"
import SectionListExample from "../examples/components/SectionList/SectionList.example"
import SegmentedControlExample from "../examples/components/SegmentedControl/SegmentedControl.example"
import SkeletonExample from "../examples/components/Skeleton/Skeleton.example"
import SnackbarExample from "../examples/components/Snackbar/Snackbar.example"
import SpinnerExample from "../examples/components/Spinner/Spinner.example"
import StartViewExample from "../examples/components/StartView/StartView.example"
import StreamingTextExample from "../examples/components/StreamingText/StreamingText.example"
import SwitchExample from "../examples/components/Switch/Switch.example"
import TabBarExample from "../examples/components/TabBar/TabBar.example"
import TabBarLayersExample from "../examples/components/TabBar/TabBarLayers.example"
import TableExample from "../examples/components/Table/Table.example"
import TabsExample from "../examples/components/Tabs/Tabs.example"
import TextExample from "../examples/components/Text/Text.example"
import TextFieldExample from "../examples/components/TextField/TextField.example"
import TooltipExample from "../examples/components/Tooltip/Tooltip.example"
import TrainExample from "../examples/components/Train/Train.example"
import WheelExample from "../examples/components/Wheel/Wheel.example"
import BottomBarExample from "../examples/components/telegram/BottomBar"
import HapticFeedbackExample from "../examples/components/telegram/HapticFeedback"
import NavigationBarExample from "../examples/components/telegram/NavigationBar"

export default { title: "Components" }

const story = (Component) => ({ render: () => createElement(Component) })

export const BackButtonLayers = story(BackButtonLayersExample)
export const Button = story(ButtonExample)
export const Calligraph = story(CalligraphExample)
export const Cell = story(CellExample)
export const CellStack = story(CellStackExample)
export const Collapsible = story(CollapsibleExample)
export const DropdownMenu = story(DropdownMenuExample)
export const FitText = story(FitTextExample)
export const Gallery = story(GalleryExample)
export const ImageAvatar = story(ImageAvatarExample)
export const InitialsAvatar = story(InitialsAvatarExample)
export const Markdown = story(MarkdownExample)
export const ModalView = story(ModalViewExample)
export const PanelHeader = story(PanelHeaderExample)
export const ParticleEffect = story(ParticleEffectExample)
export const Picker = story(PickerExample)
export const SectionList = story(SectionListExample)
export const SegmentedControl = story(SegmentedControlExample)
export const Skeleton = story(SkeletonExample)
export const Snackbar = story(SnackbarExample)
export const Spinner = story(SpinnerExample)
export const StartView = story(StartViewExample)
export const StreamingText = story(StreamingTextExample)
export const Switch = story(SwitchExample)
export const TabBar = story(TabBarExample)
export const TabBarLayers = story(TabBarLayersExample)
export const Table = story(TableExample)
export const Tabs = story(TabsExample)
export const Text = story(TextExample)
export const TextField = story(TextFieldExample)
export const Tooltip = story(TooltipExample)
export const Train = story(TrainExample)
export const Wheel = story(WheelExample)
export const BottomBar = story(BottomBarExample)
export const HapticFeedback = story(HapticFeedbackExample)
export const NavigationBar = story(NavigationBarExample)
