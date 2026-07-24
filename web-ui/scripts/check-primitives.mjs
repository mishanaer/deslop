import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("../", import.meta.url))
const sourceRoot = path.join(root, "src")
const errors = []
const primitiveColorDocs = await readFile(
  path.join(root, "../primitives/colors.md"),
  "utf8"
)

function documentedNames(sectionName) {
  const fence = "`".repeat(3)
  const section = primitiveColorDocs.match(
    new RegExp(
      `^${sectionName}:\\n([\\s\\S]*?)(?=^[a-z][a-z-]*:\\n|^${fence})`,
      "m"
    )
  )?.[1] ?? ""

  return [...section.matchAll(/^  ([a-z0-9-]+):$/gm)].map((match) => match[1])
}

const documentedColorTokens = new Set([
  ...documentedNames("accent-colors").map((name) => `--accent-${name}`),
  ...documentedNames("base-colors").map((name) => `--${name}`),
  ...documentedNames("elevation-colors").map((name) =>
    name === "primary" ? "--primary" : `--${name}`
  ),
  ...documentedNames("avatar-gradients").flatMap((name) => [
    `--avatar-${name}-top`,
    `--avatar-${name}-bottom`,
    `--avatar-${name}-gradient`,
  ]),
])
const colorTokenPattern =
  /^(?:--(?:primary|background|elevation)$|--(?:accent|avatar|elevation)-)/

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name)
      return entry.isDirectory() ? sourceFiles(entryPath) : [entryPath]
    })
  )

  return files.flat().filter((file) => /\.(css|ts|tsx)$/.test(file))
}

const paletteClass =
  /(?:^|[\s"'`])(?:bg|text|border|outline|ring|fill|stroke)-(?:black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:[\s"'`/:-]|$)/
const arbitraryColorClass =
  /(?:bg|text|border|outline|ring|fill|stroke)-\[[^\]]*(?:#|rgb\(|hsl\(|oklch\(|color-mix\()/
const legacySharedSemanticToken =
  /--ui-(?:action|background|control|fill|glass|heatmap|material|overlay|press|separator|story|surface|text|toast)[a-z0-9-]*/
const semanticColorOpacityClass =
  /(?:bg|text|border|outline|ring|fill|stroke)-(?:background|foreground|card(?:-foreground)?|popover(?:-foreground)?|primary(?:-foreground)?|secondary(?:-foreground)?|muted(?:-foreground)?|accent(?:-foreground)?|destructive(?:-foreground)?|border|input|ring|sidebar(?:-[a-z-]+)?)\/[0-9]+/
const nonPrimitiveNeutralHover = /hover[^\s"'`]*:bg-(?:muted|input)/

for (const file of await sourceFiles(sourceRoot)) {
  const content = await readFile(file, "utf8")
  const relative = path.relative(root, file)

  if (/from\s+["']lucide-react["']/.test(content)) {
    errors.push(`${relative}: import icons from @/lib/icons instead of lucide-react`)
  }

  if (paletteClass.test(content)) {
    errors.push(`${relative}: use a semantic color token instead of a Tailwind palette color`)
  }

  if (arbitraryColorClass.test(content)) {
    errors.push(`${relative}: use a semantic color token instead of an arbitrary color`)
  }

  if (semanticColorOpacityClass.test(content)) {
    errors.push(
      `${relative}: use an exact semantic token instead of adding color opacity`
    )
  }

  if (nonPrimitiveNeutralHover.test(content)) {
    errors.push(
      `${relative}: neutral hover backgrounds must use accent (Elevation 5)`
    )
  }

  if (/color-mix\(|(?:rgb|oklch)\(from\s/i.test(content)) {
    errors.push(`${relative}: derive colors in Primitives, not inside Web UI`)
  }

  const legacyToken = content.match(legacySharedSemanticToken)?.[0]
  if (legacyToken) {
    errors.push(
      `${relative}: ${legacyToken} is a product role; use a --web-* semantic token`
    )
  }

  for (const [, token] of content.matchAll(/var\((--[a-z0-9-]+)\)/g)) {
    if (colorTokenPattern.test(token) && !documentedColorTokens.has(token)) {
      errors.push(`${relative}: ${token} is not documented in primitives/colors.md`)
    }
  }
}

const styles = await readFile(path.join(sourceRoot, "index.css"), "utf8")
const icons = await readFile(path.join(sourceRoot, "lib/icons.tsx"), "utf8")
const catalog = await readFile(path.join(sourceRoot, "storybook/catalog.ts"), "utf8")
const storybookApp = await readFile(
  path.join(sourceRoot, "storybook/storybook-app.tsx"),
  "utf8"
)
const primaryDemos = await readFile(
  path.join(sourceRoot, "storybook/component-demo.tsx"),
  "utf8"
)
const extraDemos = await readFile(
  path.join(sourceRoot, "storybook/component-demos-extra.tsx"),
  "utf8"
)
const avatarComponent = await readFile(
  path.join(sourceRoot, "components/ui/avatar.tsx"),
  "utf8"
)
const badgeComponent = await readFile(
  path.join(sourceRoot, "components/ui/badge.tsx"),
  "utf8"
)
const buttonComponent = await readFile(
  path.join(sourceRoot, "components/ui/button.tsx"),
  "utf8"
)
const comboboxComponent = await readFile(
  path.join(sourceRoot, "components/ui/combobox.tsx"),
  "utf8"
)
const inputComponent = await readFile(
  path.join(sourceRoot, "components/ui/input.tsx"),
  "utf8"
)
const inputOtpComponent = await readFile(
  path.join(sourceRoot, "components/ui/input-otp.tsx"),
  "utf8"
)
const selectComponent = await readFile(
  path.join(sourceRoot, "components/ui/select.tsx"),
  "utf8"
)
const cardComponent = await readFile(
  path.join(sourceRoot, "components/ui/card.tsx"),
  "utf8"
)
const calendarComponent = await readFile(
  path.join(sourceRoot, "components/ui/calendar.tsx"),
  "utf8"
)

for (const source of [
  "components/blocks/dashboard.tsx",
  "components/blocks/login.tsx",
  "components/blocks/sidebar.tsx",
  "components/blocks/signup.tsx",
  "components/charts/area.tsx",
]) {
  try {
    await readFile(path.join(sourceRoot, source), "utf8")
  } catch {
    errors.push(`src/${source}: missing Storybook library source`)
  }
}

const floatingSurfaceBlurContracts = {
  "alert-dialog.tsx": 1,
  "combobox.tsx": 1,
  "context-menu.tsx": 2,
  "dialog.tsx": 1,
  "drawer.tsx": 1,
  "dropdown-menu.tsx": 2,
  "hover-card.tsx": 1,
  "menubar.tsx": 2,
  "navigation-menu.tsx": 2,
  "popover.tsx": 1,
  "select.tsx": 1,
  "sheet.tsx": 1,
  "tooltip.tsx": 1,
}

for (const [file, expectedCount] of Object.entries(
  floatingSurfaceBlurContracts
)) {
  const content = await readFile(
    path.join(sourceRoot, "components/ui", file),
    "utf8"
  )
  const actualCount = content.match(/ui-background-blur/g)?.length ?? 0

  if (actualCount !== expectedCount) {
    errors.push(
      `src/components/ui/${file}: all popup and modal surfaces must use ui-background-blur`
    )
  }
}

for (const [, token, value] of styles.matchAll(
  /^\s*(--web-[a-z0-9-]+):\s*([^;]+);$/gm
)) {
  const reference = value.trim().match(/^var\((--[a-z0-9-]+)\)$/)?.[1]
  if (!reference || !documentedColorTokens.has(reference)) {
    errors.push(`${token}: Web UI semantic colors must point directly to Primitives`)
  }
}

const catalogBlock = catalog.match(/const slugs = \[([\s\S]*?)\] as const/)?.[1] ?? ""
const catalogSlugs = [...catalogBlock.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1])
const demoSlugs = new Set(
  [...`${primaryDemos}\n${extraDemos}`.matchAll(/case "([a-z0-9-]+)":/g)].map(
    (match) => match[1]
  )
)

for (const slug of catalogSlugs) {
  if (!demoSlugs.has(slug)) {
    errors.push(`src/storybook: ${slug} is listed in the catalog without a real demo`)
  }
}

if (!icons.includes("@deslop/primitives/icons/")) {
  errors.push("src/lib/icons.tsx: icons must come from @deslop/primitives")
}

if (!styles.includes("color: var(--elevation-40)")) {
  errors.push("src/index.css: icons must use Elevation 40 by default")
}

for (const primitiveStylesheet of ["colors.css", "layout.css", "typography.css"]) {
  if (!styles.includes(`@deslop/primitives/${primitiveStylesheet}`)) {
    errors.push(`src/index.css: missing @deslop/primitives/${primitiveStylesheet}`)
  }
}

for (const bridge of [
  "--web-background: var(--background)",
  "--web-foreground: var(--primary)",
  "--web-subtle-fill: var(--elevation-5)",
  "--web-subtle-fill: var(--elevation-10)",
  "--web-input: var(--elevation-5)",
  "--web-muted-foreground: var(--elevation-60)",
  "--web-action-primary: var(--accent-green)",
  "--web-action-primary-foreground: var(--primary)",
  "--web-action-primary-foreground: var(--background)",
  "--web-action-destructive: var(--accent-red)",
  "--web-action-destructive-foreground: var(--background)",
  "--web-action-destructive-foreground: var(--primary)",
  "--web-avatar-foreground: var(--background)",
  "--web-avatar-foreground: var(--primary)",
  "--web-badge-accent: var(--accent-green)",
  "--web-badge-border: var(--elevation-20)",
  "--web-badge-fill: var(--elevation-10)",
  "--web-badge-fill: var(--elevation-20)",
  "--web-badge-foreground: var(--primary)",
  "--web-badge-media: var(--elevation)",
  "--web-badge-on-accent: var(--primary)",
  "--web-badge-on-accent: var(--background)",
  "--page-background: var(--web-background)",
  "--foreground: var(--web-foreground)",
  "--card: var(--elevation)",
  "--card-foreground: var(--web-foreground)",
  "--popover: var(--elevation)",
  "--popover-foreground: var(--web-foreground)",
  "--action-primary: var(--web-action-primary)",
  "--action-primary-foreground: var(--web-action-primary-foreground)",
  "--secondary: var(--web-subtle-fill)",
  "--secondary-foreground: var(--web-foreground)",
  "--muted: var(--web-subtle-fill)",
  "--muted-foreground: var(--web-muted-foreground)",
  "--action-accent: var(--elevation-5)",
  "--action-accent-foreground: var(--web-foreground)",
  "--destructive: var(--web-action-destructive)",
  "--destructive-foreground: var(--web-action-destructive-foreground)",
  "--border: var(--elevation-10)",
  "--input: var(--web-input)",
  "--ring: var(--elevation-10)",
  "--chart-1: var(--accent-orange)",
  "--chart-2: var(--accent-teal)",
  "--chart-3: var(--accent-blue)",
  "--chart-4: var(--accent-yellow)",
  "--chart-5: var(--accent-brown)",
  "--chart-1: var(--accent-indigo)",
  "--chart-2: var(--accent-green)",
  "--chart-3: var(--accent-yellow)",
  "--chart-4: var(--accent-purple)",
  "--chart-5: var(--accent-red)",
  "--sidebar: var(--elevation)",
  "--sidebar-foreground: var(--web-foreground)",
  "--sidebar-primary: var(--web-action-primary)",
  "--sidebar-primary-foreground: var(--web-action-primary-foreground)",
  "--sidebar-accent: var(--elevation-5)",
  "--sidebar-accent-foreground: var(--web-foreground)",
  "--sidebar-border: var(--elevation-10)",
  "--sidebar-ring: var(--elevation-40)",
  "--font-sans: var(--ui-font-interface)",
  "--font-caps: var(--ui-font-interface-caps)",
  "--radius-button: var(--ui-component-button-regular-radius)",
  "--radius-section: var(--ui-component-section-radius)",
  "--spacing: var(--ui-space-4)",
]) {
  if (!styles.includes(bridge)) {
    errors.push(`src/index.css: missing primitive bridge ${bridge}`)
  }
}

const inputElevationFiveCount =
  styles.match(/--web-input:\s*var\(--elevation-5\)/g)?.length ?? 0

if (inputElevationFiveCount !== 2) {
  errors.push(
    "src/index.css: light and dark inputs must both use Elevation 5"
  )
}

if (!styles.includes(".ui-hover-elevation-5:hover")) {
  errors.push("src/index.css: hover state layer must use Elevation 5")
}

if (!styles.includes(".ui-background-elevation-5")) {
  errors.push("src/index.css: Elevation 5 surfaces must use the primitive state layer")
}

if (!styles.includes(".ui-background-blur")) {
  errors.push("src/index.css: popup and modal surfaces must share background blur")
}

if (!storybookApp.includes("ui-hover-elevation-5")) {
  errors.push("src/storybook: component cards must use the Elevation 5 state layer")
}

if (!storybookApp.includes("ui-background-elevation-5")) {
  errors.push("src/storybook: component cards must use Elevation 5 surfaces")
}

for (const avatarContract of [
  "ImageAvatar",
  "InitialsAvatar",
  "--avatar-${avatarGradientNames[index]}-gradient",
]) {
  if (!avatarComponent.includes(avatarContract)) {
    errors.push(`src/components/ui/avatar.tsx: missing Mini App avatar contract ${avatarContract}`)
  }
}

for (const badgeContract of [
  'variant: "filled"',
  "tinted:",
  "gray:",
  "media:",
  "outlined:",
  "circled?: boolean",
  "squared?: boolean",
  "bg-badge-accent",
  "bg-badge-fill",
  "bg-badge-media",
  "border-badge-border",
]) {
  if (!badgeComponent.includes(badgeContract)) {
    errors.push(`src/components/ui/badge.tsx: missing Mini App badge contract ${badgeContract}`)
  }
}

if (!buttonComponent.includes("rounded-button")) {
  errors.push("src/components/ui/button.tsx: buttons must use the Mini App radius token")
}

if (!buttonComponent.includes("[&_svg]:text-current")) {
  errors.push("src/components/ui/button.tsx: button icons must use the text color")
}

if (!buttonComponent.includes('default: "h-12 px-4 py-3.5')) {
  errors.push("src/components/ui/button.tsx: default buttons must use the Mini App 48px size")
}

if (!styles.includes("--radius-text-field: var(--ui-component-text-field-radius)")) {
  errors.push("src/index.css: text fields must use the Primitives radius token")
}

if (!comboboxComponent.includes('className={cn("h-12 w-auto rounded-text-field"')) {
  errors.push("src/components/ui/combobox.tsx: combobox input must use the 48px size and text-field radius")
}

if (!inputComponent.includes('"h-12 w-full min-w-0 rounded-text-field')) {
  errors.push("src/components/ui/input.tsx: inputs must use the 48px size and text-field radius")
}

if (!inputOtpComponent.includes("size-12") || !inputOtpComponent.includes("rounded-l-text-field")) {
  errors.push("src/components/ui/input-otp.tsx: OTP slots must use the 48px size and text-field radius")
}

if (!selectComponent.includes("rounded-text-field") || !selectComponent.includes("data-[size=default]:h-12")) {
  errors.push("src/components/ui/select.tsx: default select trigger must use the 48px size and text-field radius")
}

if (!selectComponent.includes("overflow-y-auto rounded-text-field") || !selectComponent.includes("min-h-12 w-full")) {
  errors.push("src/components/ui/select.tsx: select menu must use the shared blur, radius, and 48px item size")
}

if (!cardComponent.includes("rounded-section")) {
  errors.push("src/components/ui/card.tsx: cards must use the Mini App section radius token")
}

if (!calendarComponent.includes("group/calendar rounded-section")) {
  errors.push("src/components/ui/calendar.tsx: calendar surface must use the section radius token")
}

if (errors.length) {
  console.error("Primitive usage check failed:\n")
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log("Web UI uses Deslop Primitives for colors, type, layout, and icons.")
}
