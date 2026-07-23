#!/usr/bin/env node

import { access, readFile, writeFile } from "node:fs/promises"
import { createInterface } from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process"
import { dirname, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const cliPath = fileURLToPath(import.meta.url)
const packageRoot = resolve(dirname(cliPath), "..")

const exists = async (path) => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

const optionValue = (name) => {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

const printHelp = () => {
  console.log(`Deslop design system setup

Usage:
  design-system setup                 choose a product interactively
  design-system setup --web           connect Web UI and Primitives
  design-system setup --mini-app      connect Mini App and Primitives

Options:
  --cwd <path>                        project root (defaults to the current directory)
  --no-hooks                          skip the automatic pre-commit check
  --no-install                        update files without installing dependencies
  --overwrite                         replace conflicting managed component files`)
}

const chooseProduct = async () => {
  const web = process.argv.includes("--web")
  const miniApp =
    process.argv.includes("--mini-app") || process.argv.includes("--mini-apps")

  if (web && miniApp) {
    throw new Error("Choose only one product: --web or --mini-app")
  }
  if (web) return "web"
  if (miniApp) return "mini-app"

  if (!input.isTTY || !output.isTTY) {
    throw new Error("Choose a product with --web or --mini-app")
  }

  const prompt = createInterface({ input, output })
  try {
    const answer = await prompt.question(
      "What are you building?\n  1. Web product\n  2. Telegram Mini App\nChoose 1 or 2: "
    )
    if (answer.trim() === "1") return "web"
    if (answer.trim() === "2") return "mini-app"
    throw new Error("Enter 1 for Web product or 2 for Telegram Mini App")
  } finally {
    prompt.close()
  }
}

const loadSetup = async (product) => {
  const localPath = resolve(
    packageRoot,
    product === "web" ? "../web-ui/bin/web-ui.mjs" : "../mini-app/bin/mini-app.mjs"
  )
  const specifier = (await exists(localPath))
    ? pathToFileURL(localPath).href
    : product === "web"
      ? "@deslop/web-ui/setup"
      : "@deslop/mini-app/setup"
  return import(specifier)
}

const ensurePrimitivesDependency = async (root) => {
  const packagePath = resolve(root, "package.json")
  const projectPackage = JSON.parse(await readFile(packagePath, "utf8"))
  const dependencies = {
    ...projectPackage.dependencies,
    ...projectPackage.devDependencies,
  }

  if ("@deslop/primitives" in dependencies) return false
  projectPackage.dependencies ??= {}
  projectPackage.dependencies["@deslop/primitives"] = "^0.1.0"
  await writeFile(packagePath, `${JSON.stringify(projectPackage, null, 2)}\n`, "utf8")
  return true
}

export async function setupDesignSystem({
  product,
  root = process.cwd(),
  hooks = true,
  install = true,
  overwrite = false,
  log = console.log,
} = {}) {
  if (!product || !["web", "mini-app"].includes(product)) {
    throw new Error('product must be "web" or "mini-app"')
  }

  await ensurePrimitivesDependency(resolve(root))
  const { setupProject } = await loadSetup(product)
  log(
    product === "web"
      ? "Connecting Web UI and Primitives..."
      : "Connecting Mini App and Primitives..."
  )
  return setupProject(resolve(root), { hooks, install, overwrite, log })
}

async function main() {
  const command = process.argv[2]
  if (command === "--help" || command === "-h" || command === "help") {
    printHelp()
    return
  }
  if (command && command !== "setup" && command !== "init") {
    printHelp()
    process.exitCode = 1
    return
  }

  const product = await chooseProduct()
  await setupDesignSystem({
    product,
    root: optionValue("--cwd") ?? process.cwd(),
    hooks: !process.argv.includes("--no-hooks"),
    install: !process.argv.includes("--no-install"),
    overwrite: process.argv.includes("--overwrite"),
  })
}

const isMain = process.argv[1] && resolve(process.argv[1]) === cliPath
if (isMain) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
