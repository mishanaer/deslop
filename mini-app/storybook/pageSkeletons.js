// Per-screen loading skeletons, keyed by the page title used in config.js.
// These are EAGER imports on purpose: a skeleton is the Suspense fallback that
// must paint instantly while the screen's own lazy chunk loads, so it cannot
// itself be code-split. Screens without an entry fall back to PageSkeleton.

import CellsSkeleton from "../src/components/Cells/Cells.skeleton"
import PickerSkeleton from "../src/components/Picker/Picker.skeleton"
import WheelSkeleton from "../src/components/Wheel/Wheel.skeleton"
import ModalViewSkeleton from "../src/components/ModalView/ModalView.skeleton"
import TrainSkeleton from "../src/components/Train/Train.skeleton"
import StartViewSkeleton from "../src/components/StartView/StartView.skeleton"
import SectionListSkeleton from "../src/components/SectionList/SectionList.skeleton"
import ImageAvatarSkeleton from "../src/components/ImageAvatar/ImageAvatar.skeleton"
import InitialsAvatarSkeleton from "../src/components/InitialsAvatar/InitialsAvatar.skeleton"
import SwitchSkeleton from "../src/components/Switch/Switch.skeleton"
import CollapsibleSkeleton from "../src/components/Collapsible/Collapsible.skeleton"
import ButtonSkeleton from "../src/components/Button/Button.skeleton"
import SegmentedControlSkeleton from "../src/components/SegmentedControl/SegmentedControl.skeleton"
import DropdownMenuSkeleton from "../src/components/DropdownMenu/DropdownMenu.skeleton"
import TooltipSkeleton from "../src/components/Tooltip/Tooltip.skeleton"
import TextSkeleton from "../src/components/Text/Text.skeleton"
import MarkdownSkeleton from "../src/components/Markdown/Markdown.skeleton"
import TableSkeleton from "../src/components/Table/Table.skeleton"
import GallerySkeleton from "../src/components/Gallery/Gallery.skeleton"
import TabBarSkeleton from "../src/components/TabBar/TabBar.skeleton"
import TabsSkeleton from "../src/components/Tabs/Tabs.skeleton"
import SnackbarSkeleton from "../src/components/Snackbar/Snackbar.skeleton"
import StreamingTextSkeleton from "../src/components/StreamingText/StreamingText.skeleton"
import ParticleEffectSkeleton from "../src/components/ParticleEffect/ParticleEffect.skeleton"
import CalligraphSkeleton from "../src/components/Calligraph/Calligraph.skeleton"
import FitTextSkeleton from "../src/components/FitText/FitText.skeleton"
import NavigationBarSkeleton from "../src/pages/showcases/NavigationBar/NavigationBar.skeleton"
import BottomBarSkeleton from "../src/pages/showcases/BottomBar/BottomBar.skeleton"
import HapticFeedbackSkeleton from "../src/pages/showcases/HapticFeedback/HapticFeedback.skeleton"
import TextFieldSkeleton from "../src/components/TextField/TextField.skeleton"
import NavigationSkeleton from "../src/pages/prototypes/NewNavigation/NewNavigation.skeleton"
import ColorAssetPageSkeleton from "../src/pages/prototypes/ColorAssetPage/ColorAssetPage.skeleton"
import OnboardingSkeleton from "../src/pages/prototypes/Onboarding/Onboarding.skeleton"
import BackgroundTestsSkeleton from "../src/pages/prototypes/ColorChanging/ColorChanging.skeleton"

const pageSkeletons = {
    Cell: CellsSkeleton,
    Picker: PickerSkeleton,
    Wheel: WheelSkeleton,
    "Modal Pages": ModalViewSkeleton,
    Train: TrainSkeleton,
    "Start View": StartViewSkeleton,
    "Section List": SectionListSkeleton,
    "Image Avatar": ImageAvatarSkeleton,
    "Initials Avatar": InitialsAvatarSkeleton,
    Switch: SwitchSkeleton,
    Collapsible: CollapsibleSkeleton,
    Button: ButtonSkeleton,
    "Segmented Control": SegmentedControlSkeleton,
    "Dropdown Menu": DropdownMenuSkeleton,
    Tooltip: TooltipSkeleton,
    Text: TextSkeleton,
    Markdown: MarkdownSkeleton,
    Table: TableSkeleton,
    Gallery: GallerySkeleton,
    TabBar: TabBarSkeleton,
    Tabs: TabsSkeleton,
    Snackbar: SnackbarSkeleton,
    "Streaming Text": StreamingTextSkeleton,
    "Particle Effect": ParticleEffectSkeleton,
    Calligraph: CalligraphSkeleton,
    "Fit Text": FitTextSkeleton,
    "Navigation Bar": NavigationBarSkeleton,
    "Bottom Bar": BottomBarSkeleton,
    "Haptic Feedback": HapticFeedbackSkeleton,
    "Input Page": TextFieldSkeleton,
    Navigation: NavigationSkeleton,
    "Color Asset Page": ColorAssetPageSkeleton,
    Onboarding: OnboardingSkeleton,
    "Background Tests": BackgroundTestsSkeleton,
}

export default pageSkeletons
