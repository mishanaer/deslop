import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"))
const library = await readFile(resolve(root, "src/library.js"), "utf8")
const rules = await readFile(resolve(root, "agent/AGENTS.md"), "utf8")
const components = await readFile(resolve(root, "agent/COMPONENTS.md"), "utf8")
const catalog = JSON.parse(
  await readFile(resolve(root, "agent/components.json"), "utf8")
)

assert.equal(packageJson.private, true)
assert.equal(packageJson.bin, undefined)
assert.equal(packageJson.exports, undefined)
assert(catalog.components.length >= 40)
assert(!/\.deslop|setup|src\/components\/mini-app/.test(`${rules}\n${components}`))

const exportedNames = new Set(
  [...library.matchAll(/export\s*\{([\s\S]*?)\}\s*from/g)].flatMap((match) =>
    match[1]
      .split(",")
      .map((entry) => entry.trim().split(/\s+as\s+/).at(-1))
      .filter(Boolean)
  )
)

for (const { name } of catalog.components) {
  assert(
    exportedNames.has(name),
    `${name} is documented in the agent catalog but is not exported by src/library.js`
  )
}

console.log("Mini App agent catalog is consistent with internal sources.")
