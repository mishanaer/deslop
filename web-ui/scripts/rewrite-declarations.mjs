import assert from "node:assert/strict"
import { access, readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const typesRoot = path.resolve(root, "dist/types")

async function declarationFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name)
      return entry.isDirectory() ? declarationFiles(entryPath) : [entryPath]
    })
  )

  return files.flat().filter((file) => file.endsWith(".d.ts"))
}

function publicRelativeSpecifier(file, aliasPath) {
  const target = path.resolve(typesRoot, aliasPath)
  let relative = path.relative(path.dirname(file), target).replaceAll(path.sep, "/")
  if (!relative.startsWith(".")) relative = `./${relative}`
  return relative.endsWith(".js") ? relative : `${relative}.js`
}

for (const file of await declarationFiles(typesRoot)) {
  let declaration = await readFile(file, "utf8")
  declaration = declaration.replace(
    /(["'])@\/([^"']+)\1/g,
    (_match, quote, aliasPath) =>
      `${quote}${publicRelativeSpecifier(file, aliasPath)}${quote}`
  )

  if (file === path.resolve(typesRoot, "index.d.ts")) {
    declaration = declaration.replace(/^import\s+["']\.\/index\.css["'];?\s*$/m, "")
  }

  await writeFile(file, declaration)
}

for (const file of await declarationFiles(typesRoot)) {
  const declaration = await readFile(file, "utf8")
  assert(!declaration.includes('"@/'))
  assert(!declaration.includes("'@/"))

  for (const [, specifier] of declaration.matchAll(
    /(?:from\s+|import\()?["'](\.[^"']+\.js)["']/g
  )) {
    const target = path.resolve(path.dirname(file), specifier.replace(/\.js$/, ".d.ts"))
    await assert.doesNotReject(
      access(target),
      `${file} points to missing declaration ${target}`
    )
  }
}

console.log("Web UI declarations use portable relative imports.")
