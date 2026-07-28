import assert from "node:assert/strict"
import { access, readFile, readdir } from "node:fs/promises"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const packageJson = JSON.parse(
  await readFile(path.resolve(root, "package.json"), "utf8")
)

assert.equal(packageJson.private, false)
assert.equal(packageJson.publishConfig?.access, "public")
assert.match(packageJson.peerDependencies?.react ?? "", /18/)
assert.match(packageJson.peerDependencies?.react ?? "", /19/)
assert.equal(packageJson.peerDependenciesMeta?.["@shadcn/react"]?.optional, true)

async function checkTarget(target) {
  if (typeof target === "string") {
    if (!target.includes("*")) await access(path.resolve(root, target))
    return
  }

  await checkTarget(target.import)
  await checkTarget(target.types)
}

for (const target of Object.values(packageJson.exports)) {
  await checkTarget(target)
}

for (const component of ["button", "dialog", "input", "select", "sidebar", "sonner"]) {
  await access(path.resolve(root, `dist/components/ui/${component}.js`))
  await access(path.resolve(root, `dist/types/components/ui/${component}.d.ts`))
}

async function filesBelow(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name)
      return entry.isDirectory() ? filesBelow(entryPath, extension) : [entryPath]
    })
  )
  return files.flat().filter((file) => file.endsWith(extension))
}

const styles = await readFile(path.resolve(root, "dist/styles.css"), "utf8")
const reset = await readFile(path.resolve(root, "dist/reset.css"), "utf8")
const preflightSignature = "box-sizing:border-box;border:0 solid;margin:0;padding:0"
assert(!styles.includes(preflightSignature), "styles.css must not include Tailwind preflight")
assert(reset.includes(preflightSignature), "reset.css must contain the opt-in preflight")
assert(!/@apply|@theme|@custom-variant/.test(styles), "styles.css contains uncompiled Tailwind directives")

for (const file of await filesBelow(path.resolve(root, "dist"), ".js")) {
  const source = await readFile(file, "utf8")
  assert(!source.includes('from "@/'), `${file} contains an internal source alias`)
  assert(!source.includes("/Users/"), `${file} contains an absolute build path`)
}

for (const file of await filesBelow(path.resolve(root, "dist/types"), ".d.ts")) {
  const declaration = await readFile(file, "utf8")
  assert(!declaration.includes('"@/'), `${file} contains an internal type alias`)
}

const rootModule = await import("@deslop/web-ui")
const canonicalButton = await import("@deslop/web-ui/components/button")
const compatibleButton = await import("@deslop/web-ui/components/ui/button")
const toastModule = await import("@deslop/web-ui/toast")
assert.equal(typeof rootModule.cn, "function")
assert.equal(typeof canonicalButton.Button, "function")
assert.equal(canonicalButton.Button, compatibleButton.Button)
assert.equal(typeof toastModule.toast, "function")

console.log("Web UI package exports, declarations, and split CSS are consumable.")
