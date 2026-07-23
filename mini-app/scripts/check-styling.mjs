import { readdir, readFile } from "node:fs/promises"
import { dirname, extname, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const sourceRoots = [resolve(root, "src"), resolve(root, "storybook")]

const walk = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true })
    const nested = await Promise.all(
        entries.map((entry) => {
            const path = resolve(directory, entry.name)
            return entry.isDirectory() ? walk(path) : [path]
        })
    )

    return nested.flat()
}

const normalize = (path) => relative(root, path).replaceAll("\\", "/")
const files = (await Promise.all(sourceRoots.map(walk))).flat()
const failures = []
const sourceCodeFiles = files.filter((path) =>
    [".js", ".jsx", ".ts", ".tsx"].includes(extname(path))
)

const paletteClass =
    /(?:^|[\s"'`])(?:bg|text|border|outline|ring|fill|stroke)-(?:black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:[\s"'`/:-]|$)/
const arbitraryTailwindClass = /[a-z][a-z0-9-]*-\[[^\]]+\]/
const arbitraryColorClass =
    /(?:bg|text|border|outline|ring|fill|stroke)-\[[^\]]*(?:#|rgb\(|hsl\(|oklch\(|color-mix\()/
const externalUiImport =
    /from\s+["'](?:@mui\/|@chakra-ui\/|antd(?:\/|["'])|lucide-react(?:\/|["'])|react-icons(?:\/|["'])|@radix-ui\/|shadcn(?:\/|["']))/
const literalColor = /(?:#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|oklch\()/i
const rawControl = /<(?:button|input|select|textarea)\b/
const allowedLiteralColorFiles = new Set([
    "src/components/GradientBackground/GradientBackground.js",
    "src/components/GradientBackground/hooks/useGradientCanvas.js",
])
const allowedRawSvgFiles = new Set([
    "src/components/TabBar/components/GradientMask/index.js",
])
const existingArbitraryClasses = new Map([
    [
        "src/components/Image/index.js",
        ["rounded-[inherit]", "ease-[cubic-bezier(0.23,1,0.32,1)]"],
    ],
    ["src/components/Train/index.js", ["mx-[3px]", "content-['·']"]],
])
const allowedCheckSuppressions = new Set([
    "src/components/Cells/components/EditableCell/EditableCell.module.css:stylelint-disable-next-line no-duplicate-selectors */",
    "src/pages/prototypes/Trading/components/AssetList/index.js:eslint-disable-next-line react-hooks/incompatible-library",
])

for (const path of sourceCodeFiles) {
    const source = await readFile(path, "utf8")
    const file = normalize(path)

    if (paletteClass.test(source)) {
        failures.push(
            `${file} uses a Tailwind palette color; use a token from @deslop/primitives`
        )
    }

    if (arbitraryColorClass.test(source)) {
        failures.push(
            `${file} uses an arbitrary Tailwind color; use a token from @deslop/primitives`
        )
    }

    const withoutExistingArbitraryClasses = (
        existingArbitraryClasses.get(file) ?? []
    ).reduce(
        (content, value) => content.replaceAll(value, ""),
        source
    )
    if (arbitraryTailwindClass.test(withoutExistingArbitraryClasses)) {
        failures.push(
            `${file} adds an arbitrary Tailwind value; add a Primitives token first`
        )
    }

    if (externalUiImport.test(source)) {
        failures.push(
            `${file} imports another UI or icon library; use Mini App and @deslop/primitives`
        )
    }

    if (literalColor.test(source) && !allowedLiteralColorFiles.has(file)) {
        failures.push(
            `${file} hardcodes a color; use a token from @deslop/primitives`
        )
    }

    if (source.includes("<svg") && !allowedRawSvgFiles.has(file)) {
        failures.push(
            `${file} contains a local SVG; use an icon from @deslop/primitives`
        )
    }

    if (
        (file.startsWith("src/pages/") || file.startsWith("storybook/")) &&
        rawControl.test(source)
    ) {
        failures.push(
            `${file} renders a raw form control; use a component from src/components`
        )
    }
}

for (const path of files.filter((path) =>
    [".css", ".js", ".jsx", ".ts", ".tsx"].includes(extname(path))
)) {
    const source = await readFile(path, "utf8")
    const file = normalize(path)
    const suppressions = source.match(
        /(?:eslint-disable(?:-next-line)?[^\n]*|stylelint-disable(?:-next-line)?[^\n]*|@ts-ignore|@ts-expect-error)/g
    ) ?? []

    for (const suppression of suppressions) {
        if (!allowedCheckSuppressions.has(`${file}:${suppression.trim()}`)) {
            failures.push(
                `${file} disables a check; fix the source instead of suppressing validation`
            )
        }
    }
}

const scssFiles = files.filter((path) =>
    [".scss", ".sass"].includes(extname(path))
)
if (scssFiles.length > 0) {
    failures.push(
        `Sass files are not allowed:\n${scssFiles.map(normalize).join("\n")}`
    )
}

const legacyManifest = await readFile(
    resolve(root, "scripts/legacy-css-modules.txt"),
    "utf8"
)
const allowedModules = new Set(legacyManifest.split(/\r?\n/).filter(Boolean))
const cssModules = files
    .map(normalize)
    .filter((path) => path.endsWith(".module.css"))
const newModules = cssModules.filter((path) => !allowedModules.has(path))
if (newModules.length > 0) {
    failures.push(
        `New CSS Modules are not allowed; use Tailwind utilities:\n${newModules.join("\n")}`
    )
}
const currentModules = new Set(cssModules)
const migratedModules = [...allowedModules].filter(
    (path) => !currentModules.has(path)
)
if (migratedModules.length > 0) {
    failures.push(
        `Remove migrated files from scripts/legacy-css-modules.txt:\n${migratedModules.join("\n")}`
    )
}

const legacySharedSemanticToken =
    /--ui-(?:action|background|control|fill|glass|heatmap|material|overlay|press|separator|story|surface|text|toast)[a-z0-9-]*/
for (const path of files.filter((path) =>
    [".css", ".js", ".jsx", ".ts", ".tsx"].includes(extname(path))
)) {
    const source = await readFile(path, "utf8")
    const token = source.match(legacySharedSemanticToken)?.[0]
    if (token) {
        failures.push(
            `${normalize(path)} uses ${token}; Mini App semantic colors must use the --mini-app-* namespace`
        )
    }

    if (/color-mix\(|(?:rgb|oklch)\(from\s/i.test(source)) {
        failures.push(
            `${normalize(path)} derives a local color; use a color token from @deslop/primitives`
        )
    }
}

for (const path of files.filter((path) => extname(path) === ".css")) {
    const source = await readFile(path, "utf8")
    const literal = source.match(
        /(?:^|[;{])\s*(?:--[a-z0-9-]+|color|background(?:-color)?|border(?:-[a-z]+)?-color|outline(?:-color)?|fill|stroke|box-shadow|text-shadow)\s*:\s*(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|oklch\()/im
    )?.[1]
    if (literal) {
        failures.push(
            `${normalize(path)} applies ${literal}; use a color token from @deslop/primitives`
        )
    }
}

const packageJson = JSON.parse(
    await readFile(resolve(root, "package.json"), "utf8")
)
const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
}
for (const dependency of Object.keys(dependencies)) {
    if (
        /^(?:@mui\/|@chakra-ui\/|antd$|lucide-react$|react-icons$|@radix-ui\/|shadcn$)/.test(
            dependency
        )
    ) {
        failures.push(
            `Remove forbidden UI or icon dependency: ${dependency}`
        )
    }
}
for (const dependency of [
    "sass",
    "node-sass",
    "stylelint-config-standard-scss",
]) {
    if (dependency in dependencies) {
        failures.push(`Remove forbidden dependency: ${dependency}`)
    }
}

for (const dependency of ["tailwindcss", "@tailwindcss/vite"]) {
    if (!(dependency in dependencies)) {
        failures.push(`Missing Tailwind dependency: ${dependency}`)
    }
}

const viteConfig = await readFile(resolve(root, "vite.config.js"), "utf8")
const libraryConfig = await readFile(
    resolve(root, "vite.lib.config.js"),
    "utf8"
)
for (const [name, config] of [
    ["vite.config.js", viteConfig],
    ["vite.lib.config.js", libraryConfig],
]) {
    if (
        !config.includes('from "@tailwindcss/vite"') ||
        !config.includes("tailwindcss()")
    ) {
        failures.push(`${name} must enable the Tailwind Vite plugin`)
    }
}

const theme = await readFile(resolve(root, "src/styles/tailwind.css"), "utf8")
const semanticTheme = await readFile(
    resolve(root, "src/styles/theme.css"),
    "utf8"
)
if (/(?:#[0-9a-f]{3,8}|rgb\(|hsl\(|oklch\(|color-mix\()/i.test(semanticTheme)) {
    failures.push(
        "src/styles/theme.css must point directly to @deslop/primitives color tokens"
    )
}
for (const required of [
    '@import "tailwindcss/theme.css"',
    '@import "tailwindcss/utilities.css"',
    '@import "@deslop/primitives/colors.css"',
    '@import "@deslop/primitives/layout.css"',
    '@import "@deslop/primitives/typography.css"',
    '@import "./theme.css"',
    "@theme inline",
]) {
    if (!theme.includes(required)) {
        failures.push(`src/styles/tailwind.css is missing: ${required}`)
    }
}

for (const token of [
    "--mini-app-background",
    "--mini-app-elevation",
    "--mini-app-text-primary",
    "--mini-app-text-secondary",
    "--mini-app-separator",
    "--mini-app-action-primary-background",
]) {
    if (!semanticTheme.includes(token) || !theme.includes(token)) {
        failures.push(`Mini App semantic color is not connected to Tailwind: ${token}`)
    }
}

const primitiveSources = await Promise.all(
    ["colors.css", "layout.css", "typography.css"].map((file) =>
        readFile(resolve(root, "../primitives", file), "utf8")
    )
)
const ignoredPrimitiveTokens = new Set(["--ui-caption-text-transform"])
const primitiveTokens = new Set(
    primitiveSources
        .flatMap(
            (source) =>
                source.match(
                    /--(?:ui-[a-z0-9-]+|primary|background|elevation(?:-[a-z0-9-]+)?|(?:accent|avatar)-[a-z0-9-]+)(?=\s*:)/g
                ) ?? []
        )
        .filter((token) => !ignoredPrimitiveTokens.has(token))
)
const primitiveColorTokens = new Set(
    primitiveSources[0].match(/--[a-z0-9-]+(?=\s*:)/g) ?? []
)
for (const [, role, value] of semanticTheme.matchAll(
    /^\s*(--mini-app-[a-z0-9-]+):\s*([^;]+);$/gm
)) {
    const reference = value.trim().match(/^var\((--[a-z0-9-]+)\)$/)?.[1]
    if (!reference || !primitiveColorTokens.has(reference)) {
        failures.push(
            `${role} must point directly to a color from @deslop/primitives`
        )
    }
}
const unmappedTokens = [...primitiveTokens].filter(
    (token) => !theme.includes(token) && !semanticTheme.includes(token)
)
if (unmappedTokens.length > 0) {
    failures.push(
        `Map new Primitives tokens in src/styles/tailwind.css:\n${unmappedTokens.join("\n")}`
    )
}

if (failures.length > 0) {
    console.error(failures.join("\n\n"))
    process.exit(1)
}

console.log(
    `Tailwind setup is valid; ${cssModules.length} legacy CSS Modules remain`
)
