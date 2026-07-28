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

assert.equal(packageJson.private, false)
assert.equal(packageJson.bin, undefined)
assert.equal(typeof packageJson.exports, "object")
assert.equal(catalog.schemaVersion, 2)
assert.equal(catalog.publicImportPattern, "@deslop/web-ui/{path}")
assert.equal(catalog.adoption.genericUiSource, "exclusive")
assert.equal(catalog.adoption.nativeControlPolicy, "replace")
assert.deepEqual(catalog.adoption.allowlist.requiredFields, ["rule", "file", "reason"])
assert.equal(catalog.nativeControlReplacements.button, "components/button")
assert.equal(catalog.nativeControlReplacements.select, "components/native-select")
assert.equal(catalog.directDependencyReplacements.sonner, "components/sonner")
assert.equal(catalog.directDependencyReplacements["lucide-react"], "@deslop/primitives/material-symbols-react")
assert.equal(catalog.deprecatedTokens["--background"], "--background-primary")
assert(catalog.modules.length >= 60)
assert(!/\.deslop|setup|src\/components\/web-ui/.test(`${rules}\n${components}`))

const modulePaths = new Set(catalog.modules.map(({ path }) => path))
for (const contract of catalog.compoundContracts) {
  assert.equal(typeof contract.child, "string")
  assert.equal(typeof contract.ancestor, "string")
  assert(
    modulePaths.has(contract.module),
    `${contract.child} contract references unknown module ${contract.module}`
  )
}

for (const { path, local, category } of catalog.modules) {
  assert.equal(typeof path, "string")
  assert.equal(typeof category, "string")
  const source = resolve(root, "src/components", `${local}.tsx`)
  await assert.doesNotReject(
    access(source),
    `${local} is documented in the agent catalog but ${source} does not exist`
  )
}

console.log("Web UI agent catalog is consistent with internal sources.")
