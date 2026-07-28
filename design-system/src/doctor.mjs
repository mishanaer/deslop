import { access, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import { readProjectSources } from "./source-files.mjs"

const packageManagerLocks = [
  ["pnpm", "pnpm-lock.yaml"],
  ["yarn", "yarn.lock"],
  ["npm", "package-lock.json"],
  ["bun", "bun.lockb"],
  ["bun", "bun.lock"],
]

const configurationFiles = {
  postcss: [
    "postcss.config.js",
    "postcss.config.cjs",
    "postcss.config.mjs",
    "postcss.config.ts",
  ],
  tailwind: [
    "tailwind.config.js",
    "tailwind.config.cjs",
    "tailwind.config.mjs",
    "tailwind.config.ts",
  ],
  tauri: ["src-tauri/tauri.conf.json", "src-tauri/tauri.conf.json5"],
}

const uiDependencyMatchers = [
  ["lucide-react", (name) => name === "lucide-react"],
  ["sonner", (name) => name === "sonner"],
  ["cmdk", (name) => name === "cmdk"],
  ["radix", (name) => name === "radix-ui" || name.startsWith("@radix-ui/")],
  ["shadcn", (name) => name === "@shadcn/ui" || name === "shadcn"],
  ["base-ui", (name) => name === "@base-ui/react"],
  ["material-ui", (name) => name.startsWith("@mui/")],
  ["chakra-ui", (name) => name.startsWith("@chakra-ui/")],
  ["ant-design", (name) => name === "antd"],
]

const collisionTokens = new Set([
  "--accent",
  "--background",
  "--border",
  "--card",
  "--destructive",
  "--foreground",
  "--input",
  "--muted",
  "--popover",
  "--primary",
  "--radius",
  "--ring",
  "--secondary",
  "--sidebar",
])

const nativeControlPattern = /<(button|input|select|textarea)(?=[\s/>])/g
const maskComments = (source) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, " "))
    .replace(/^[\t ]*\/\/.*$/gm, (comment) => comment.replace(/[^\n]/g, " "))
const importPatterns = {
  lucide: /(?:from\s*|import\s*)["']lucide-react["']/g,
  sonner: /(?:from\s*|import\s*)["']sonner["']/g,
  radix: /(?:from\s*|import\s*)["'](?:radix-ui|@radix-ui\/[^"']+)["']/g,
  cmdk: /(?:from\s*|import\s*)["']cmdk["']/g,
  localUi:
    /(?:from\s*|import\s*)["'](?:@\/|~\/|@)?components\/ui\/[^"']+["']/g,
}

async function existingFiles(root, candidates) {
  const matches = []

  for (const candidate of candidates) {
    try {
      await access(path.join(root, candidate))
      matches.push(candidate)
    } catch {
      // Missing optional configuration is an expected result.
    }
  }

  return matches
}

async function readRuntimeSources(root) {
  const sourceRoots = await existingFiles(root, ["src", "app", "pages"])
  if (sourceRoots.length === 0) return readProjectSources(root)

  const groups = await Promise.all(
    sourceRoots.map(async (sourceRoot) => {
      const absoluteRoot = path.join(root, sourceRoot)
      const sources = await readProjectSources(absoluteRoot)
      return sources.map((source) => ({
        ...source,
        path: path.relative(root, source.absolutePath),
      }))
    }),
  )

  return groups.flat()
}

function majorVersion(range) {
  const match = String(range ?? "").match(/\d+/)
  return match ? Number(match[0]) : null
}

function allDependencies(packageJson) {
  return {
    ...packageJson.devDependencies,
    ...packageJson.peerDependencies,
    ...packageJson.optionalDependencies,
    ...packageJson.dependencies,
  }
}

function detectFrameworks(dependencies) {
  const frameworks = []

  if (dependencies.next) {
    frameworks.push({ name: "next", version: dependencies.next })
  }
  if (dependencies.vite) {
    frameworks.push({ name: "vite", version: dependencies.vite })
  }
  if (dependencies["react-scripts"]) {
    frameworks.push({ name: "create-react-app", version: dependencies["react-scripts"] })
  }
  if (dependencies["@remix-run/react"]) {
    frameworks.push({ name: "remix", version: dependencies["@remix-run/react"] })
  }

  return frameworks
}

function detectUiDependencies(dependencies) {
  return Object.entries(dependencies)
    .flatMap(([name, version]) =>
      uiDependencyMatchers
        .filter(([, matches]) => matches(name))
        .map(([family]) => ({ family, name, version })),
    )
    .sort((left, right) => left.name.localeCompare(right.name))
}

function relativeExamples(matches, maximum = 8) {
  return [...matches].sort().slice(0, maximum)
}

function inspectSources(sources) {
  const controls = { button: 0, input: 0, select: 0, textarea: 0 }
  const controlFiles = new Set()
  const imports = Object.fromEntries(
    Object.keys(importPatterns).map((name) => [name, { count: 0, files: new Set() }]),
  )
  const tokenOccurrences = new Map()
  const hardcodedVisualFiles = new Set()
  const globalStyleSignals = new Set()

  for (const file of sources) {
    const source = maskComments(file.source)

    for (const match of source.matchAll(nativeControlPattern)) {
      controls[match[1]] += 1
      controlFiles.add(file.path)
    }

    for (const [name, pattern] of Object.entries(importPatterns)) {
      pattern.lastIndex = 0
      const count = [...source.matchAll(pattern)].length
      imports[name].count += count
      if (count > 0) imports[name].files.add(file.path)
    }

    for (const match of source.matchAll(/(--[a-z0-9-]+)\s*:/gi)) {
      const token = match[1].toLowerCase()
      if (!collisionTokens.has(token)) continue

      const occurrence = tokenOccurrences.get(token) ?? { count: 0, files: new Set() }
      occurrence.count += 1
      occurrence.files.add(file.path)
      tokenOccurrences.set(token, occurrence)
    }

    if (
      /#[0-9a-f]{3,8}\b|\b(?:rgb|hsl|oklch)\s*\(/i.test(source) &&
      !file.path.endsWith(".json")
    ) {
      hardcodedVisualFiles.add(file.path)
    }

    if (/@import\s+["']tailwindcss["']|@tailwind\s+(?:base|components|utilities)/.test(source)) {
      globalStyleSignals.add(`${file.path}:tailwind-global-layer`)
    }
    if (/(?:^|[}\n])\s*(?:\*|body|html)\s*(?:,|\{)/m.test(source)) {
      globalStyleSignals.add(`${file.path}:global-selector`)
    }
  }

  return {
    filesScanned: sources.length,
    nativeControls: {
      total: Object.values(controls).reduce((total, count) => total + count, 0),
      byTag: controls,
      files: relativeExamples(controlFiles),
    },
    imports: Object.fromEntries(
      Object.entries(imports).map(([name, result]) => [
        name,
        { count: result.count, files: relativeExamples(result.files) },
      ]),
    ),
    hardcodedVisuals: {
      files: hardcodedVisualFiles.size,
      examples: relativeExamples(hardcodedVisualFiles),
    },
    globalStyleSignals: relativeExamples(globalStyleSignals, 16),
    tokenCollisions: [...tokenOccurrences.entries()]
      .map(([token, result]) => ({
        token,
        definitions: result.count,
        files: relativeExamples(result.files),
      }))
      .sort((left, right) => left.token.localeCompare(right.token)),
  }
}

async function detectPackageManager(root, packageJson) {
  if (packageJson.packageManager) {
    return {
      name: packageJson.packageManager.split("@")[0],
      declaration: packageJson.packageManager,
      evidence: "package.json#packageManager",
    }
  }

  for (const [name, lockfile] of packageManagerLocks) {
    if ((await existingFiles(root, [lockfile])).length > 0) {
      return { name, declaration: null, evidence: lockfile }
    }
  }

  return { name: "unknown", declaration: null, evidence: null }
}

export async function inspectProject({ cwd = process.cwd() } = {}) {
  const root = path.resolve(cwd)
  const packagePath = path.join(root, "package.json")
  let packageJson

  try {
    packageJson = JSON.parse(await readFile(packagePath, "utf8"))
  } catch (error) {
    throw new Error(`Cannot read ${packagePath}: ${error.message}`)
  }

  const dependencies = allDependencies(packageJson)
  const [postcssConfigs, tailwindConfigs, tauriConfigs, sources] = await Promise.all([
    existingFiles(root, configurationFiles.postcss),
    existingFiles(root, configurationFiles.tailwind),
    existingFiles(root, configurationFiles.tauri),
    readRuntimeSources(root),
  ])
  const sourceInspection = inspectSources(sources)
  const tailwindVersion = dependencies.tailwindcss ?? null
  const tailwindMajor = majorVersion(tailwindVersion)
  const existingUi = detectUiDependencies(dependencies)
  const frameworks = detectFrameworks(dependencies)
  const warnings = []

  if (tailwindMajor !== null && tailwindMajor < 4) {
    warnings.push(`Tailwind ${tailwindMajor} is incompatible with the current Web UI utility layer.`)
  }
  if (sourceInspection.tokenCollisions.length > 0) {
    warnings.push(
      `${sourceInspection.tokenCollisions.length} generic CSS token names may collide with Deslop compatibility aliases.`,
    )
  }
  if (sourceInspection.globalStyleSignals.length > 0) {
    warnings.push("Existing global CSS/reset layers require visual regression checks.")
  }

  const hasReact = Boolean(dependencies.react)
  const blockers = []
  if (!hasReact) {
    blockers.push(
      "React is not declared in package.json; automatic component migration is disabled.",
    )
  }
  if (tailwindMajor !== null && tailwindMajor < 4) {
    blockers.push(
      `Tailwind ${tailwindMajor} cannot consume the current Web UI stylesheet safely. Upgrade to Tailwind 4 before migration or use Primitives without claiming component adoption.`,
    )
  }

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    root,
    package: {
      name: packageJson.name ?? null,
      private: packageJson.private ?? false,
      packageManager: await detectPackageManager(root, packageJson),
    },
    environment: {
      frameworks,
      react: {
        installed: hasReact,
        version: dependencies.react ?? null,
        reactDomVersion: dependencies["react-dom"] ?? null,
      },
      runtime: {
        tauri: tauriConfigs.length > 0 || Boolean(dependencies["@tauri-apps/api"]),
        configFiles: tauriConfigs,
      },
      tailwind: {
        installed: tailwindVersion !== null,
        version: tailwindVersion,
        major: tailwindMajor,
        configFiles: tailwindConfigs,
        vitePlugin: dependencies["@tailwindcss/vite"] ?? null,
        postcssPlugin: dependencies["@tailwindcss/postcss"] ?? null,
      },
      postcss: {
        installed: Boolean(dependencies.postcss || dependencies["@tailwindcss/postcss"]),
        version: dependencies.postcss ?? null,
        configFiles: postcssConfigs,
      },
    },
    existingUi,
    source: {
      filesScanned: sourceInspection.filesScanned,
      nativeControls: sourceInspection.nativeControls,
      imports: sourceInspection.imports,
      hardcodedVisuals: sourceInspection.hardcodedVisuals,
      globalStyleSignals: sourceInspection.globalStyleSignals,
    },
    tokenCollisions: sourceInspection.tokenCollisions,
    recommendation: {
      strategy:
        tailwindMajor !== null && tailwindMajor < 4
          ? "blocked-tailwind-upgrade-required"
          : "precompiled-css",
      blockers,
      warnings,
      nextCommands: blockers.length
        ? []
        : ["deslop migrate --dry-run", "deslop migrate", "deslop audit --strict"],
    },
  }
}

export async function runDoctor({ cwd = process.cwd(), output, stdout = process.stdout } = {}) {
  const plan = await inspectProject({ cwd })
  const serialized = `${JSON.stringify(plan, null, 2)}\n`

  if (output) {
    const outputPath = path.resolve(cwd, output)
    await writeFile(outputPath, serialized, "utf8")
    stdout.write(`Wrote ${outputPath}\n`)
  } else {
    stdout.write(serialized)
  }

  return plan
}
