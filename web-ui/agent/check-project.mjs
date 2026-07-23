import { access, readFile, readdir } from "node:fs/promises"
import { basename, dirname, extname, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const agentRoot = dirname(fileURLToPath(import.meta.url))
const catalog = JSON.parse(
  await readFile(resolve(agentRoot, "components.json"), "utf8")
)
const componentNames = new Set(
  catalog.modules
    .filter(({ local }) => local.startsWith("ui/"))
    .map(({ local }) => basename(local).replaceAll("-", "").toLowerCase())
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
  /^(?:@chakra-ui\/|@mui\/|@radix-ui\/|@base-ui\/react$|@deslop\/mini-app$|@shadcn\/react$|antd$|lucide-react$|mantine$|react-icons$|shadcn$|tma-ui$)/
const forbiddenImport =
  /from\s+["'](?:@chakra-ui\/|@mui\/|@radix-ui\/|@base-ui\/react|@deslop\/mini-app|@shadcn\/react|antd(?:\/|["'])|lucide-react(?:\/|["'])|mantine(?:\/|["'])|react-icons(?:\/|["'])|shadcn(?:\/|["'])|tma-ui(?:\/|["']))/
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
  const candidates = ["src", "app", "pages"].map((name) => resolve(root, name))
  const roots = []
  for (const candidate of candidates) {
    if (await exists(candidate)) roots.push(candidate)
  }
  return roots.length === 0 ? [] : (await Promise.all(roots.map(walk))).flat()
}

const relativePath = (root, path) => relative(root, path).replaceAll("\\", "/")
const isManagedComponent = (root, path) =>
  relativePath(root, path).includes("/components/web-ui/")

const localComponentName = (root, path) => {
  const pathFromRoot = relativePath(root, path)
  if (!pathFromRoot.includes("/components/") || isManagedComponent(root, path)) {
    return undefined
  }
  const fileName = basename(path, extname(path))
  return fileName === "index" ? basename(dirname(path)) : fileName
}

export async function checkProject({ root = process.cwd() } = {}) {
  const projectRoot = resolve(root)
  const packagePath = resolve(projectRoot, "package.json")
  const failures = []

  if (!(await exists(packagePath))) {
    return { ok: false, failures: ["package.json not found; run the check from the project root"] }
  }

  if (!(await exists(resolve(projectRoot, "src/components/web-ui/index.ts")))) {
    failures.push("local Web UI components are missing; run npx @deslop/web-ui setup")
  }

  const packageJson = JSON.parse(await readFile(packagePath, "utf8"))
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  }

  if (!("@deslop/web-ui" in dependencies)) {
    failures.push("@deslop/web-ui is not listed in project dependencies")
  }
  for (const dependency of Object.keys(dependencies)) {
    if (forbiddenDependency.test(dependency)) {
      failures.push(`package.json includes ${dependency}; use @deslop/web-ui instead`)
    }
  }

  const files = await projectFiles(projectRoot)
  const sourceFiles = files.filter((path) => codeExtensions.has(extname(path)))
  const styleFiles = files.filter((path) => styleExtensions.has(extname(path)))
  const sources = new Map(
    await Promise.all(
      [...sourceFiles, ...styleFiles].map(async (path) => [path, await readFile(path, "utf8")])
    )
  )
  const productSourceFiles = sourceFiles.filter(
    (path) => !isManagedComponent(projectRoot, path)
  )
  const hasInterface = productSourceFiles.some((path) =>
    /<[A-Za-z][A-Za-z0-9.]*(?:\s|>|\/)/.test(sources.get(path))
  )
  const allSource = productSourceFiles.map((path) => sources.get(path)).join("\n")

  if (hasInterface && !/components\/web-ui(?:\/|["'])/.test(allSource)) {
    failures.push("interface code does not import local components from src/components/web-ui")
  }
  if (hasInterface && !allSource.includes("@deslop/web-ui/styles.css")) {
    failures.push('Web UI styles are not connected; import "@deslop/web-ui/styles.css" once in the app entry')
  }

  for (const path of sourceFiles) {
    if (isManagedComponent(projectRoot, path)) continue
    const source = sources.get(path)
    const file = relativePath(projectRoot, path)
    const duplicate = localComponentName(projectRoot, path)

    if (duplicate && componentNames.has(duplicate.replaceAll("-", "").toLowerCase())) {
      failures.push(`${file} duplicates the Web UI ${duplicate} component; import it from src/components/web-ui`)
    }
    if (forbiddenImport.test(source)) {
      failures.push(`${file} imports another UI or icon library`)
    }
    if (/from\s+["']@deslop\/web-ui(?:\/|["'])/.test(source)) {
      failures.push(`${file} imports Web UI directly; use src/components/web-ui`)
    }
    if (rawControl.test(source)) {
      failures.push(`${file} renders a raw control; use the matching Web UI component`)
    }
    if (source.includes("<svg")) {
      failures.push(`${file} contains a local SVG; use a Deslop icon`)
    }
    if (inlineStyle.test(source)) {
      failures.push(`${file} uses inline styles; use Web UI and Primitives styles`)
    }
    if (literalColor.test(source)) {
      failures.push(`${file} hardcodes a color; use a Primitives token`)
    }
    if (paletteClass.test(source)) {
      failures.push(`${file} uses a Tailwind palette color; use a Primitives token`)
    }
    if (arbitraryTailwindClass.test(source)) {
      failures.push(`${file} uses a Tailwind arbitrary value; use a Primitives token`)
    }
  }

  for (const path of styleFiles) {
    const source = sources.get(path)
    const file = relativePath(projectRoot, path)
    if (literalColor.test(source)) {
      failures.push(`${file} hardcodes a color; use a Primitives token`)
    }
    if (hardcodedMetric.test(source)) {
      failures.push(`${file} hardcodes a visual value; use a Primitives token`)
    }
  }

  return { ok: failures.length === 0, failures }
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  const result = await checkProject()
  if (!result.ok) {
    console.error(result.failures.map((failure) => `- ${failure}`).join("\n"))
    process.exit(1)
  }
  console.log("Web UI project rules passed.")
}
