import assert from "node:assert/strict"
import { access, readFile, readdir } from "node:fs/promises"
import { resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
const dist = process.env.DESLOP_DIST_DIR
    ? resolve(process.env.DESLOP_DIST_DIR)
    : resolve(root, "dist")
const packageJson = JSON.parse(
    await readFile(resolve(root, "package.json"), "utf8")
)

assert.equal(packageJson.private, false)
assert.equal(packageJson.main, "./dist/index.js")
assert.equal(packageJson.module, "./dist/index.js")
assert.equal(packageJson.types, "./dist/library.d.ts")
assert.equal(packageJson.style, "./dist/styles.css")
assert.equal(packageJson.exports["."].import, "./dist/index.js")
assert.equal(packageJson.exports["."].types, "./dist/library.d.ts")
assert.equal(packageJson.exports["./styles.css"], "./dist/styles.css")
assert.equal(packageJson.peerDependencies.react, ">=18 <20")
assert.equal(packageJson.peerDependencies["react-dom"], ">=18 <20")
assert.equal(packageJson.peerDependencies["@deslop/primitives"], "^0.1.0")

for (const file of [
    "agent/AGENTS.md",
    "agent/COMPONENTS.md",
    "agent/components.json",
]) {
    await access(resolve(root, file))
}
for (const file of ["index.js", "library.d.ts", "styles.css"]) {
    await access(resolve(dist, file))
}

const bundle = await readFile(resolve(dist, "index.js"), "utf8")
for (const forbidden of [
    "react/compiler-runtime",
    "react.memo_cache_sentinel",
    "useEffectEvent",
]) {
    assert.equal(
        bundle.includes(forbidden),
        false,
        `dist/index.js contains ${forbidden}`
    )
}

const workerMatch = bundle.match(
    /new URL\(["']([^"']*gradientWorker-[^"']+\.js)["']/
)
assert(workerMatch, "dist/index.js must reference the gradient worker")
assert.equal(
    workerMatch[1].startsWith("/"),
    false,
    "worker URL must be relative"
)
await access(resolve(dist, workerMatch[1]))

const declarationFiles = (await readdir(dist, { recursive: true })).filter(
    (file) => file.endsWith(".d.ts")
)
assert(
    declarationFiles.length > 40,
    "public build must contain component declarations"
)

console.log(
    "Mini App package exports, React 18 bundle, declarations, CSS, and worker are valid."
)
