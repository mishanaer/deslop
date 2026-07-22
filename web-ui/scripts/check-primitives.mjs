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
const primaryDemos = await readFile(
  path.join(sourceRoot, "storybook/component-demo.tsx"),
  "utf8"
)
const extraDemos = await readFile(
  path.join(sourceRoot, "storybook/component-demos-extra.tsx"),
  "utf8"
)

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
  "--web-input: var(--elevation-10)",
  "--web-input: var(--elevation-20)",
  "--web-muted-foreground: var(--elevation-60)",
  "--web-action-primary: var(--accent-green)",
  "--web-action-primary-foreground: var(--primary)",
  "--web-action-primary-foreground: var(--background)",
  "--web-action-destructive: var(--accent-red)",
  "--web-action-destructive-foreground: var(--background)",
  "--web-action-destructive-foreground: var(--primary)",
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
  "--action-accent: var(--web-subtle-fill)",
  "--action-accent-foreground: var(--web-foreground)",
  "--destructive: var(--web-action-destructive)",
  "--destructive-foreground: var(--web-action-destructive-foreground)",
  "--border: var(--elevation-10)",
  "--input: var(--web-input)",
  "--ring: var(--elevation-40)",
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
  "--sidebar-accent: var(--web-subtle-fill)",
  "--sidebar-accent-foreground: var(--web-foreground)",
  "--sidebar-border: var(--elevation-10)",
  "--sidebar-ring: var(--elevation-40)",
  "--font-sans: var(--ui-font-interface)",
  "--spacing: var(--ui-space-4)",
]) {
  if (!styles.includes(bridge)) {
    errors.push(`src/index.css: missing primitive bridge ${bridge}`)
  }
}

if (errors.length) {
  console.error("Primitive usage check failed:\n")
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log("Web UI uses Deslop Primitives for colors, type, layout, and icons.")
}
