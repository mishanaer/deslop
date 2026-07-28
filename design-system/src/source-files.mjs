import { readdir, readFile, stat } from "node:fs/promises"
import path from "node:path"

const ignoredDirectories = new Set([
  ".git",
  ".next",
  ".turbo",
  ".vite",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "out",
  "public",
  "storybook-static",
  "vendor",
])

const sourceExtensions = new Set([
  ".css",
  ".js",
  ".jsx",
  ".less",
  ".mjs",
  ".mts",
  ".sass",
  ".scss",
  ".ts",
  ".tsx",
])

const migrationExtensions = new Set([
  ".js",
  ".jsx",
  ".mjs",
  ".mts",
  ".ts",
  ".tsx",
])

export async function findProjectFiles(
  root,
  { extensions = sourceExtensions, maximumBytes = 1_000_000 } = {},
) {
  const files = []

  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.isSymbolicLink()) continue
      if (
        entry.isDirectory() &&
        (ignoredDirectories.has(entry.name) || entry.name.startsWith(".next"))
      ) {
        continue
      }

      const absolutePath = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        await visit(absolutePath)
        continue
      }

      if (!entry.isFile() || !extensions.has(path.extname(entry.name))) continue
      if ((await stat(absolutePath)).size > maximumBytes) continue

      files.push(absolutePath)
    }
  }

  await visit(root)
  return files.sort()
}

export async function readProjectSources(root, options) {
  const files = await findProjectFiles(root, options)

  return Promise.all(
    files.map(async (absolutePath) => ({
      absolutePath,
      path: path.relative(root, absolutePath),
      source: await readFile(absolutePath, "utf8"),
    })),
  )
}

export { migrationExtensions, sourceExtensions }
