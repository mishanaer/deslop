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
            `${normalize(path)} uses ${token}; TMA semantic colors must use the --tma-* namespace`
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
    "--tma-background",
    "--tma-elevation",
    "--tma-text-primary",
    "--tma-text-secondary",
    "--tma-separator",
    "--tma-action-primary-background",
]) {
    if (!semanticTheme.includes(token) || !theme.includes(token)) {
        failures.push(`TMA semantic color is not connected to Tailwind: ${token}`)
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
    /^\s*(--tma-[a-z0-9-]+):\s*([^;]+);$/gm
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
