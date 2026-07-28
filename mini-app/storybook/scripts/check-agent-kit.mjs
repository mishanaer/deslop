import assert from "node:assert/strict"
import { access, readFile } from "node:fs/promises"
import { resolve } from "node:path"

const storybookRoot = resolve(import.meta.dirname, "..")
const miniAppRoot = resolve(storybookRoot, "..")
const library = await readFile(resolve(miniAppRoot, "index.js"), "utf8")
const rules = await readFile(resolve(miniAppRoot, "agent/AGENTS.md"), "utf8")
const components = await readFile(
    resolve(miniAppRoot, "agent/COMPONENTS.md"),
    "utf8"
)
const catalog = JSON.parse(
    await readFile(resolve(miniAppRoot, "agent/components.json"), "utf8")
)

await access(resolve(storybookRoot, ".storybook/main.js"))
await access(resolve(storybookRoot, ".storybook/preview.jsx"))
await access(resolve(storybookRoot, "stories/components.stories.jsx"))

assert(catalog.components.length >= 40)
assert(!/\.deslop|setup|src\/components\/mini-app/.test(`${rules}\n${components}`))

const exportedNames = new Set(
    [...library.matchAll(/export\s*\{([\s\S]*?)\}\s*from/g)].flatMap(
        (match) =>
            match[1]
                .split(",")
                .map((entry) => entry.trim().split(/\s+as\s+/).at(-1))
                .filter(Boolean)
    )
)

for (const { name } of catalog.components) {
    assert(
        exportedNames.has(name),
        `${name} is documented but is not exported by mini-app/index.js`
    )
}

console.log("Mini App exports, agent catalog, and bundled Storybook are consistent.")
