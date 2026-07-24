import assert from "node:assert/strict"
import { access, readFile } from "node:fs/promises"
import { resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"))
const rules = await readFile(resolve(root, "agent/AGENTS.md"), "utf8")
const components = await readFile(resolve(root, "agent/COMPONENTS.md"), "utf8")
const catalog = JSON.parse(
  await readFile(resolve(root, "agent/components.json"), "utf8")
)

assert.equal(packageJson.private, true)
assert.equal(packageJson.bin, undefined)
assert.equal(packageJson.exports, undefined)
assert(catalog.modules.length >= 60)
assert(!/\.deslop|setup|src\/components\/web-ui/.test(`${rules}\n${components}`))

for (const { local } of catalog.modules) {
  const source = resolve(root, "src/components", `${local}.tsx`)
  await assert.doesNotReject(
    access(source),
    `${local} is documented in the agent catalog but ${source} does not exist`
  )
}

console.log("Web UI agent catalog is consistent with internal sources.")
