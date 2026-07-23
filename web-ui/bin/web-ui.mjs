#!/usr/bin/env node

import {
  access,
  chmod,
  cp,
  copyFile,
  mkdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises"
import { spawnSync } from "node:child_process"
import { dirname, isAbsolute, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { checkProject } from "../agent/check-project.mjs"

const cliPath = fileURLToPath(import.meta.url)
const packageRoot = resolve(dirname(cliPath), "..")
const agentRoot = resolve(packageRoot, "agent")
const sourceRoot = resolve(packageRoot, "src")
const packageMetadata = JSON.parse(
  await readFile(resolve(packageRoot, "package.json"), "utf8")
)
const catalog = JSON.parse(
  await readFile(resolve(agentRoot, "components.json"), "utf8")
)
const managedComponentBanner = "// @deslop/web-ui managed component"
const rulesStart = "<!-- deslop-web-ui:rules:start -->"
const rulesEnd = "<!-- deslop-web-ui:rules:end -->"
const hookStart = "# deslop-web-ui:check:start"
const hookEnd = "# deslop-web-ui:check:end"

const exists = async (path) => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

const readIfExists = async (path) =>
  (await exists(path)) ? readFile(path, "utf8") : ""

const insertAfterDirectives = (source, imports) => {
  const directive = source.match(/^(?:#![^\n]*\n)?(?:["']use client["'];?\s*)/)
  const index = directive?.[0].length ?? 0
  return `${source.slice(0, index)}${imports}\n${source.slice(index)}`
}

const upsertMarkedBlock = (source, start, end, content) => {
  const block = `${start}\n${content.trim()}\n${end}`
  const startIndex = source.indexOf(start)
  const endIndex = source.indexOf(end)

  if (startIndex >= 0 && endIndex > startIndex) {
    return `${source.slice(0, startIndex)}${block}${source.slice(endIndex + end.length)}`
  }
  return source.trim() ? `${source.trimEnd()}\n\n${block}\n` : `${block}\n`
}

const ensureAgentFiles = async (root) => {
  const target = resolve(root, ".deslop/web-ui")
  await mkdir(target, { recursive: true })

  for (const file of ["AGENTS.md", "COMPONENTS.md", "components.json"]) {
    await copyFile(resolve(agentRoot, file), resolve(target, file))
  }

  const rules = await readFile(resolve(agentRoot, "AGENTS.md"), "utf8")
  const projectRulesPath = resolve(root, "AGENTS.md")
  const projectRules = await readIfExists(projectRulesPath)
  await writeFile(
    projectRulesPath,
    upsertMarkedBlock(projectRules, rulesStart, rulesEnd, rules),
    "utf8"
  )

  const sourceTarget = resolve(target, "source")
  await rm(sourceTarget, { recursive: true, force: true })
  await mkdir(sourceTarget, { recursive: true })
  for (const path of ["components", "hooks", "lib", "types", "index.css"]) {
    await cp(resolve(sourceRoot, path), resolve(sourceTarget, path), {
      recursive: true,
    })
  }
  await writeFile(
    resolve(sourceTarget, "README.md"),
    "# Исходники Web UI\n\nЭто читаемая копия исходников для агентов. Не импортируй файлы из этой папки: рабочие компоненты находятся в `src/components/web-ui`.\n",
    "utf8"
  )
}

const ensureLocalComponents = async (root, { overwrite = false } = {}) => {
  const target = resolve(root, "src/components/web-ui")
  const conflicts = []
  await mkdir(target, { recursive: true })

  const writeManagedComponent = async (path, content) => {
    const current = await readIfExists(path)
    if (current && !current.startsWith(managedComponentBanner) && !overwrite) {
      conflicts.push(path)
      return
    }
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, content, "utf8")
  }

  for (const module of catalog.modules) {
    await writeManagedComponent(
      resolve(target, `${module.local}.ts`),
      `${managedComponentBanner}\n// Run \`npx @deslop/web-ui setup\` to refresh this file.\nexport * from "@deslop/web-ui/${module.path}"\n`
    )
  }

  await writeManagedComponent(
    resolve(target, "index.ts"),
    `${managedComponentBanner}\n// Public local gateway for all product UI.\n${catalog.modules
      .map(({ local }) => `export * from "./${local}"`)
      .join("\n")}\n`
  )

  return { target, conflicts }
}

const ensurePackageScripts = async (root) => {
  const packagePath = resolve(root, "package.json")
  if (!(await exists(packagePath))) {
    throw new Error("package.json not found; run setup from the project root")
  }

  const projectPackage = JSON.parse(await readFile(packagePath, "utf8"))
  projectPackage.scripts ??= {}
  projectPackage.scripts["check:web-ui"] = "web-ui check"

  const hookCommand = "web-ui hook"
  const prepare = projectPackage.scripts.prepare
  if (!prepare) projectPackage.scripts.prepare = hookCommand
  else if (!prepare.includes(hookCommand)) {
    projectPackage.scripts.prepare = `${prepare} && ${hookCommand}`
  }

  const dependencies = {
    ...projectPackage.dependencies,
    ...projectPackage.devDependencies,
  }
  const hasDependency = "@deslop/web-ui" in dependencies
  projectPackage.dependencies ??= {}
  if (!hasDependency) {
    projectPackage.dependencies["@deslop/web-ui"] = `^${packageMetadata.version}`
  }

  await writeFile(packagePath, `${JSON.stringify(projectPackage, null, 2)}\n`, "utf8")
  return { dependencyAdded: !hasDependency }
}

const installProjectDependencies = async (root) => {
  let command = "npm"
  let args = ["install"]

  if (await exists(resolve(root, "pnpm-lock.yaml"))) {
    command = "corepack"
    args = ["pnpm", "install"]
  } else if (await exists(resolve(root, "yarn.lock"))) {
    command = "corepack"
    args = ["yarn", "install"]
  }

  const result = spawnSync(command, args, { cwd: root, stdio: "inherit" })
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed; install project dependencies and run setup again`
    )
  }
}

const entryCandidates = [
  "src/main.tsx",
  "src/main.jsx",
  "src/main.ts",
  "src/main.js",
  "src/index.tsx",
  "src/index.jsx",
  "src/index.ts",
  "src/index.js",
  "app/layout.tsx",
  "app/layout.jsx",
  "src/app/layout.tsx",
  "src/app/layout.jsx",
]

const ensureEntrySetup = async (root) => {
  let entryPath
  for (const candidate of entryCandidates) {
    const path = resolve(root, candidate)
    if (await exists(path)) {
      entryPath = path
      break
    }
  }

  if (!entryPath) {
    return ['Entry file was not detected; import "@deslop/web-ui/styles.css" manually']
  }

  let source = await readFile(entryPath, "utf8")
  if (!source.includes("@deslop/web-ui/styles.css")) {
    source = insertAfterDirectives(source, 'import "@deslop/web-ui/styles.css"\n')
    await writeFile(entryPath, source, "utf8")
  }
  return []
}

export async function installHook(root = process.cwd()) {
  const projectRoot = resolve(root)
  const gitCheck = spawnSync("git", ["rev-parse", "--git-dir"], {
    cwd: projectRoot,
    encoding: "utf8",
  })
  if (gitCheck.status !== 0) {
    return { installed: false, reason: "Git repository was not detected" }
  }

  const configuredHooks = spawnSync(
    "git",
    ["config", "--get", "core.hooksPath"],
    { cwd: projectRoot, encoding: "utf8" }
  ).stdout.trim()
  const gitDirectory = gitCheck.stdout.trim()
  const hooksDirectory = configuredHooks
    ? isAbsolute(configuredHooks)
      ? configuredHooks
      : resolve(projectRoot, configuredHooks)
    : resolve(
        isAbsolute(gitDirectory) ? gitDirectory : resolve(projectRoot, gitDirectory),
        "hooks"
      )
  const hookPath = resolve(hooksDirectory, "pre-commit")
  const current = await readIfExists(hookPath)

  if (current && !/^#!.*(?:sh|bash)/.test(current)) {
    return {
      installed: false,
      reason: `Existing non-shell hook was left unchanged: ${hookPath}`,
    }
  }

  const command = [
    "if [ ! -x node_modules/.bin/web-ui ]; then",
    '  echo "Web UI check is unavailable. Install project dependencies." >&2',
    "  exit 1",
    "fi",
    "node_modules/.bin/web-ui check",
  ].join("\n")
  const base = current || "#!/bin/sh\nset -eu\n"
  const next = upsertMarkedBlock(base, hookStart, hookEnd, command)
  await mkdir(hooksDirectory, { recursive: true })
  await writeFile(hookPath, next, "utf8")
  await chmod(hookPath, 0o755)

  return { installed: true, path: hookPath }
}

export async function setupProject(
  root = process.cwd(),
  { hooks = true, install = true, overwrite = false, log = console.log } = {}
) {
  const projectRoot = resolve(root)
  const { dependencyAdded } = await ensurePackageScripts(projectRoot)
  const localPackage = resolve(projectRoot, "node_modules/@deslop/web-ui/package.json")
  if (install && (dependencyAdded || !(await exists(localPackage)))) {
    await installProjectDependencies(projectRoot)
  }
  await ensureAgentFiles(projectRoot)
  const localComponents = await ensureLocalComponents(projectRoot, { overwrite })
  const notes = await ensureEntrySetup(projectRoot)
  const hook = hooks
    ? await installHook(projectRoot)
    : { installed: false, reason: "Hook installation was skipped" }

  log("Web UI setup completed:")
  log("- ready AGENTS.md rules are connected")
  log("- local components are available in src/components/web-ui")
  log("- readable component source is available in .deslop/web-ui/source")
  log("- component catalog is available in .deslop/web-ui")
  log("- npm run check:web-ui is configured")
  log(hook.installed ? "- automatic pre-commit check is enabled" : `- ${hook.reason}`)
  if (localComponents.conflicts.length > 0) {
    notes.push(
      `${localComponents.conflicts.length} local component files were preserved; rerun with --overwrite to replace them`
    )
  }
  for (const note of notes) log(`- ${note}`)

  return { dependencyAdded, hook, localComponents, notes }
}

const optionValue = (name) => {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

const printHelp = () => {
  console.log(`Web UI project integration

Usage:
  web-ui setup           install local Web UI components, rules, styles, and checks
  web-ui check           validate that the project uses only Web UI
  web-ui hook            install or refresh the local pre-commit check

Options:
  --cwd <path>           project root (defaults to the current directory)
  --no-hooks             skip hook installation during setup
  --no-install           update files without installing dependencies
  --overwrite            replace conflicting local Web UI component files`)
}

async function main() {
  const command = process.argv[2]
  const root = resolve(optionValue("--cwd") ?? process.cwd())

  if (command === "setup" || command === "init") {
    await setupProject(root, {
      hooks: !process.argv.includes("--no-hooks"),
      install: !process.argv.includes("--no-install"),
      overwrite: process.argv.includes("--overwrite"),
    })
    return
  }
  if (command === "check") {
    const result = await checkProject({ root })
    if (!result.ok) {
      console.error(result.failures.map((failure) => `- ${failure}`).join("\n"))
      process.exitCode = 1
      return
    }
    console.log("Web UI project rules passed.")
    return
  }
  if (command === "hook") {
    const result = await installHook(root)
    console.log(
      result.installed
        ? `Web UI pre-commit check installed: ${result.path}`
        : result.reason
    )
    return
  }
  printHelp()
}

const isMain = process.argv[1] && resolve(process.argv[1]) === cliPath
if (isMain) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
