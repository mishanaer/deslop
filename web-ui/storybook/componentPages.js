import lazyWithPreload from "../src/utils/lazyWithPreload"

const showcases = import.meta.glob("../src/components/**/*.showcase.js")

const page = (title, path) => {
    const loader = showcases[`../src/components/${path}.js`]
    if (!loader) throw new Error(`Missing showcase: ${path}`)
    return { title, component: lazyWithPreload(loader) }
}

const componentPages = [
    page("Cell", "Cells/Cells.showcase"),
    page("Cell Stack", "CellStack/CellStack.showcase"),
    page("Picker", "Picker/Picker.showcase"),
    page("Wheel", "Wheel/Wheel.showcase"),
    page("Modal Pages", "ModalView/ModalView.showcase"),
    page("Panel Header", "PanelHeader/PanelHeader.showcase"),
    page("Spinner", "Spinner/Spinner.showcase"),
    page("Train", "Train/Train.showcase"),
    page("Start View", "StartView/StartView.showcase"),
    page("Section List", "SectionList/SectionList.showcase"),
    page("Image Avatar", "ImageAvatar/ImageAvatar.showcase"),
    page("Initials Avatar", "InitialsAvatar/InitialsAvatar.showcase"),
    page("Switch", "Switch/Switch.showcase"),
    page("Collapsible", "Collapsible/Collapsible.showcase"),
    page("Button", "Button/Button.showcase"),
    page("Segmented Control", "SegmentedControl/SegmentedControl.showcase"),
    page("Dropdown Menu", "DropdownMenu/DropdownMenu.showcase"),
    page("Tooltip", "Tooltip/Tooltip.showcase"),
    page("Text", "Text/Text.showcase"),
    page("Skeleton", "Skeleton/Skeleton.showcase"),
    page("Markdown", "Markdown/Markdown.showcase"),
    page("Table", "Table/Table.showcase"),
    page("Gallery", "Gallery/Gallery.showcase"),
    page("TabBar", "TabBar/TabBar.showcase"),
    page("Tabs", "Tabs/Tabs.showcase"),
    page("Snackbar", "Snackbar/Snackbar.showcase"),
]

export default componentPages
