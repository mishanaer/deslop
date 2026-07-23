import { access, readFile, readdir } from "node:fs/promises"
import { basename, dirname, extname, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const agentRoot = dirname(fileURLToPath(import.meta.url))
const catalog = JSON.parse(
    await readFile(resolve(agentRoot, "components.json"), "utf8")
)
const componentNames = new Set(
    catalog.components.map(({ name }) => name.toLowerCase())
)

const ignoredDirectories = new Set([
    ".deslop",
    ".git",
    ".next",
    ".output",
    ".turbo",
    "build",
    "coverage",
    "dist",
    "node_modules",
    "public",
])
const codeExtensions = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"])
const styleExtensions = new Set([".css", ".scss", ".sass"])
const forbiddenDependency =
    /^(?:@chakra-ui\/|@mui\/|@radix-ui\/|@telegram-apps\/telegram-ui$|@tma\.js\/ui$|antd$|lucide-react$|react-icons$|shadcn$|tma-ui$)/
const forbiddenImport =
    /from\s+["'](?:@chakra-ui\/|@mui\/|@radix-ui\/|@telegram-apps\/telegram-ui|@tma\.js\/ui|antd(?:\/|["'])|lucide-react(?:\/|["'])|react-icons(?:\/|["'])|shadcn(?:\/|["'])|tma-ui(?:\/|["']))/
const paletteClass =
    /(?:^|[\s"'`])(?:bg|text|border|outline|ring|fill|stroke)-(?:black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:[\s"'`/:-]|$)/
const arbitraryTailwindClass = /[a-z][a-z0-9-]*-\[[^\]]+\]/
const literalColor = /(?:#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|oklch\(|color-mix\()/i
const rawControl = /<(?:a|button|img|input|select|table|textarea)\b/
const inlineStyle = /\bstyle\s*=\s*\{/
const hardcodedMetric =
    /(?:border-radius|box-shadow|font-family|font-size|gap|line-height|margin(?:-[a-z]+)?|padding(?:-[a-z]+)?|text-shadow)\s*:\s*[^;]*(?:\d(?:px|rem|em|vh|vw)|["'][^"']+["'])/i

const exists = async (path) => {
    try {
        await access(path)
        return true
    } catch {
        return false
    }
}

const walk = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true })
    const files = []

    for (const entry of entries) {
        if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue

        const path = resolve(directory, entry.name)
        if (entry.isDirectory()) files.push(...(await walk(path)))
        else files.push(path)
    }

    return files
}

const projectFiles = async (root) => {
    const candidates = ["src", "app", "pages"].map((name) =>
        resolve(root, name)
    )
    const roots = []

    for (const candidate of candidates) {
        if (await exists(candidate)) roots.push(candidate)
    }

    if (roots.length === 0) return []
    return (await Promise.all(roots.map(walk))).flat()
}

const localComponentName = (root, path) => {
    const fileName = basename(path, extname(path))
    const directoryName = basename(dirname(path))
    const relativePath = relative(root, path).replaceAll("\\", "/")

    if (!relativePath.includes("/components/")) return undefined
    if (relativePath.includes("/components/mini-app/")) return undefined
    return fileName === "index" ? directoryName : fileName
}

const isManagedMiniAppComponent = (root, path) =>
    relative(root, path).replaceAll("\\", "/").includes("/components/mini-app/")

const directMiniAppImports = (source) =>
    [...source.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']@deslop\/mini-app["']/g)]
        .flatMap((match) => match[1].split(","))
        .map((name) => name.trim().split(/\s+as\s+/)[0])
        .filter(Boolean)

export async function checkProject({ root = process.cwd() } = {}) {
    const projectRoot = resolve(root)
    const packagePath = resolve(projectRoot, "package.json")
    const failures = []

    if (!(await exists(packagePath))) {
        return {
            ok: false,
            failures: [
                "package.json not found; run the check from the project root",
            ],
        }
    }

    if (!(await exists(resolve(projectRoot, "src/components/mini-app/index.js")))) {
        failures.push(
            "local Mini App components are missing; run npx @deslop/mini-app setup"
        )
    }

    const packageJson = JSON.parse(await readFile(packagePath, "utf8"))
    const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
    }

    if (!("@deslop/mini-app" in dependencies)) {
        failures.push("@deslop/mini-app is not listed in project dependencies")
    }

    for (const dependency of Object.keys(dependencies)) {
        if (forbiddenDependency.test(dependency)) {
            failures.push(
                `package.json includes ${dependency}; use @deslop/mini-app instead`
            )
        }
    }

    const files = await projectFiles(projectRoot)
    const sourceFiles = files.filter((path) =>
        codeExtensions.has(extname(path))
    )
    const styleFiles = files.filter((path) =>
        styleExtensions.has(extname(path))
    )
    const sources = new Map(
        await Promise.all(
            [...sourceFiles, ...styleFiles].map(async (path) => [
                path,
                await readFile(path, "utf8"),
            ])
        )
    )

    const productSourceFiles = sourceFiles.filter(
        (path) => !isManagedMiniAppComponent(projectRoot, path)
    )
    const hasInterface = productSourceFiles.some((path) =>
        /<[A-Za-z][A-Za-z0-9.]*(?:\s|>|\/)/.test(sources.get(path))
    )
    const allSource = productSourceFiles
        .map((path) => sources.get(path))
        .join("\n")

    if (hasInterface && !allSource.includes("components/mini-app")) {
        failures.push(
            "interface code does not import local components from src/components/mini-app"
        )
    }
    if (hasInterface && !allSource.includes("@deslop/mini-app/styles.css")) {
        failures.push(
            'Mini App styles are not connected; import "@deslop/mini-app/styles.css" once in the app entry'
        )
    }
    if (hasInterface && !allSource.includes("MiniAppProvider")) {
        failures.push("the application is not wrapped in MiniAppProvider")
    }

    for (const path of sourceFiles) {
        const source = sources.get(path)
        const file = relative(projectRoot, path).replaceAll("\\", "/")
        if (isManagedMiniAppComponent(projectRoot, path)) continue
        const duplicate = localComponentName(projectRoot, path)

        if (duplicate && componentNames.has(duplicate.toLowerCase())) {
            failures.push(
                `${file} duplicates the Mini App ${duplicate} component; import it from src/components/mini-app`
            )
        }
        if (forbiddenImport.test(source)) {
            failures.push(`${file} imports another UI or icon library`)
        }
        if (/from\s+["']@deslop\/mini-app\/(?:dist|src)\//.test(source)) {
            failures.push(
                `${file} imports a private Mini App path; use the public package export`
            )
        }
        const directComponents = directMiniAppImports(source)
        if (directComponents.length > 0) {
            failures.push(
                `${file} imports ${directComponents.join(", ")} directly from @deslop/mini-app; use src/components/mini-app`
            )
        }
        if (rawControl.test(source)) {
            failures.push(
                `${file} renders a raw control; use the matching Mini App component`
            )
        }
        if (source.includes("<svg")) {
            failures.push(`${file} contains a local SVG; use a Deslop icon`)
        }
        if (inlineStyle.test(source)) {
            failures.push(
                `${file} uses inline styles; use Mini App and Primitives styles`
            )
        }
        if (literalColor.test(source)) {
            failures.push(`${file} hardcodes a color; use a Primitives token`)
        }
        if (paletteClass.test(source)) {
            failures.push(
                `${file} uses a Tailwind palette color; use a Primitives token`
            )
        }
        if (arbitraryTailwindClass.test(source)) {
            failures.push(
                `${file} uses a Tailwind arbitrary value; use a Primitives token`
            )
        }
    }

    for (const path of styleFiles) {
        const source = sources.get(path)
        const file = relative(projectRoot, path).replaceAll("\\", "/")

        if (literalColor.test(source)) {
            failures.push(`${file} hardcodes a color; use a Primitives token`)
        }
        if (hardcodedMetric.test(source)) {
            failures.push(
                `${file} hardcodes a visual value; use a Primitives token`
            )
        }
    }

    return { ok: failures.length === 0, failures }
}

const isMain =
    process.argv[1] &&
    resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
    const result = await checkProject()
    if (!result.ok) {
        console.error(
            result.failures.map((failure) => `- ${failure}`).join("\n")
        )
        process.exit(1)
    }

    console.log("Mini App project rules passed.")
}
