export type ComponentCategory =
  | "Inputs"
  | "Navigation"
  | "Overlays"
  | "Feedback"
  | "Data Display"
  | "Layout"

export type CatalogComponent = {
  slug: string
  title: string
  category: ComponentCategory
  description: string
}

const categoryBySlug: Record<string, ComponentCategory> = {
  accordion: "Layout",
  alert: "Feedback",
  "alert-dialog": "Overlays",
  "aspect-ratio": "Layout",
  attachment: "Data Display",
  avatar: "Data Display",
  badge: "Data Display",
  breadcrumb: "Navigation",
  bubble: "Data Display",
  button: "Inputs",
  "button-group": "Inputs",
  calendar: "Inputs",
  card: "Layout",
  carousel: "Layout",
  chart: "Data Display",
  checkbox: "Inputs",
  collapsible: "Layout",
  combobox: "Inputs",
  command: "Navigation",
  "context-menu": "Overlays",
  dialog: "Overlays",
  direction: "Layout",
  drawer: "Overlays",
  "dropdown-menu": "Overlays",
  empty: "Feedback",
  field: "Inputs",
  form: "Inputs",
  "hover-card": "Overlays",
  input: "Inputs",
  "input-group": "Inputs",
  "input-otp": "Inputs",
  item: "Data Display",
  kbd: "Data Display",
  label: "Inputs",
  marker: "Data Display",
  menubar: "Navigation",
  message: "Data Display",
  "message-scroller": "Layout",
  "native-select": "Inputs",
  "navigation-menu": "Navigation",
  pagination: "Navigation",
  popover: "Overlays",
  progress: "Feedback",
  "radio-group": "Inputs",
  resizable: "Layout",
  "scroll-area": "Layout",
  select: "Inputs",
  separator: "Layout",
  sheet: "Overlays",
  sidebar: "Navigation",
  skeleton: "Feedback",
  slider: "Inputs",
  sonner: "Feedback",
  spinner: "Feedback",
  switch: "Inputs",
  table: "Data Display",
  tabs: "Navigation",
  textarea: "Inputs",
  toggle: "Inputs",
  "toggle-group": "Inputs",
  tooltip: "Overlays",
}

const descriptions: Record<string, string> = {
  accordion: "A vertically stacked set of interactive headings.",
  alert: "Displays a callout for important information.",
  "alert-dialog": "A modal dialog that interrupts the user with important content.",
  avatar: "An image element with a fallback for representing a user.",
  badge: "Displays a badge or a component that looks like a badge.",
  breadcrumb: "Displays the path to the current resource.",
  button: "Displays a button or a component that looks like a button.",
  calendar: "A date field component for selecting dates and ranges.",
  card: "A container with header, content, and footer regions.",
  checkbox: "A control that allows the user to toggle between checked and unchecked.",
  command: "A fast, composable command menu for navigation and actions.",
  dialog: "A window overlaid on the primary content of the page.",
  input: "Displays a form input field.",
  select: "Displays a list of options for the user to pick from.",
  tabs: "A set of layered sections of content displayed one at a time.",
  tooltip: "A popup that displays information related to an element.",
}

const slugs = [
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "attachment",
  "avatar",
  "badge",
  "breadcrumb",
  "bubble",
  "button",
  "button-group",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "combobox",
  "command",
  "context-menu",
  "dialog",
  "direction",
  "drawer",
  "dropdown-menu",
  "empty",
  "field",
  "form",
  "hover-card",
  "input",
  "input-group",
  "input-otp",
  "item",
  "kbd",
  "label",
  "marker",
  "menubar",
  "message",
  "message-scroller",
  "native-select",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "sonner",
  "spinner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toggle",
  "toggle-group",
  "tooltip",
] as const

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export const components: CatalogComponent[] = slugs.map((slug) => ({
  slug,
  title: titleFromSlug(slug),
  category: categoryBySlug[slug],
  description:
    descriptions[slug] ??
    `A production-ready ${titleFromSlug(slug)} component for web interfaces.`,
}))

export const componentCategories: ComponentCategory[] = [
  "Inputs",
  "Navigation",
  "Overlays",
  "Feedback",
  "Data Display",
  "Layout",
]

export function getComponent(slug: string) {
  return components.find((component) => component.slug === slug)
}
