import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import {
    chmod,
    mkdtemp,
    mkdir,
    readFile,
    rm,
    writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import { resolve } from "node:path"

import { checkProject } from "../agent/check-project.mjs"
import { setupProject } from "../bin/mini-app.mjs"

const root = resolve(import.meta.dirname, "..")
const packageJson = JSON.parse(
    await readFile(resolve(root, "package.json"), "utf8")
)
const library = await readFile(resolve(root, "src/library.js"), "utf8")
const rules = await readFile(resolve(root, "agent/AGENTS.md"), "utf8")
const catalog = JSON.parse(
    await readFile(resolve(root, "agent/components.json"), "utf8")
)

assert.equal(packageJson.bin["mini-app"], "./bin/mini-app.mjs")
assert(packageJson.files.includes("agent"))
assert(packageJson.files.includes("bin"))
assert(packageJson.files.includes("src"))
assert.equal(packageJson.exports["./agent/AGENTS.md"], "./agent/AGENTS.md")
assert(rules.includes(".deslop/mini-app/COMPONENTS.md"))
assert(catalog.components.length >= 40)

for (const { name } of catalog.components) {
    assert(
        library.includes(name),
        `${name} is documented in the agent catalog but is not publicly exported`
    )
}

const fixture = await mkdtemp(resolve(tmpdir(), "deslop-mini-app-agent-"))

try {
    await mkdir(resolve(fixture, "src"), { recursive: true })
    await writeFile(
        resolve(fixture, "package.json"),
        `${JSON.stringify(
            {
                name: "consumer-fixture",
                private: true,
                scripts: { prepare: "node existing-setup.mjs" },
                dependencies: {
                    react: "19.2.0",
                },
            },
            null,
            2
        )}\n`,
        "utf8"
    )
    await writeFile(
        resolve(fixture, "AGENTS.md"),
        "## Existing project rules\n\n- Keep this rule.\n",
        "utf8"
    )
    await writeFile(
        resolve(fixture, "src/main.jsx"),
        `import { createRoot } from "react-dom/client"
import { Page, Text } from "./components/mini-app/index.js"

const App = () => (
    <Page>
        <Text>Hello</Text>
    </Page>
)

createRoot(document.getElementById("root")).render(<App />)
`,
        "utf8"
    )

    const git = spawnSync("git", ["init"], { cwd: fixture, encoding: "utf8" })
    assert.equal(git.status, 0, git.stderr)

    await mkdir(resolve(fixture, "node_modules/.bin"), { recursive: true })
    const localBin = resolve(fixture, "node_modules/.bin/mini-app")
    await writeFile(
        localBin,
        `#!/bin/sh\nexec "${process.execPath}" "${resolve(root, "bin/mini-app.mjs")}" "$@"\n`,
        "utf8"
    )
    await chmod(localBin, 0o755)

    await setupProject(fixture, { install: false, log: () => {} })
    await setupProject(fixture, { install: false, log: () => {} })

    const projectRules = await readFile(resolve(fixture, "AGENTS.md"), "utf8")
    const projectPackage = JSON.parse(
        await readFile(resolve(fixture, "package.json"), "utf8")
    )
    const entry = await readFile(resolve(fixture, "src/main.jsx"), "utf8")
    const hook = await readFile(
        resolve(fixture, ".git/hooks/pre-commit"),
        "utf8"
    )
    const localPage = await readFile(
        resolve(fixture, "src/components/mini-app/Page.js"),
        "utf8"
    )
    const sourcePage = await readFile(
        resolve(fixture, ".deslop/mini-app/source/components/Page/index.js"),
        "utf8"
    )

    assert(projectRules.includes("Keep this rule."))
    assert.equal(projectRules.match(/deslop-mini-app:rules:start/g)?.length, 1)
    assert.equal(projectPackage.scripts["check:mini-app"], "mini-app check")
    assert.equal(projectPackage.scripts.prepare.match(/mini-app hook/g)?.length, 1)
    assert.equal(projectPackage.dependencies["@deslop/mini-app"], "^0.1.0")
    assert.equal(entry.match(/@deslop\/mini-app\/styles\.css/g)?.length, 1)
    assert.equal(entry.match(/import \{ MiniAppProvider \}/g)?.length, 1)
    assert(entry.includes("<MiniAppProvider><App /></MiniAppProvider>"))
    assert.equal(hook.match(/deslop-mini-app:check:start/g)?.length, 1)
    assert(hook.includes("node_modules/.bin/mini-app check"))
    assert(localPage.includes("export { Page as default, Page }"))
    assert(sourcePage.includes("const Page"))

    await writeFile(
        resolve(fixture, "src/components/mini-app/Page.js"),
        "// Product-owned Page component\n",
        "utf8"
    )
    const preserved = await setupProject(fixture, {
        install: false,
        log: () => {},
    })
    assert.equal(preserved.localComponents.conflicts.length, 1)
    assert.equal(
        await readFile(resolve(fixture, "src/components/mini-app/Page.js"), "utf8"),
        "// Product-owned Page component\n"
    )
    await setupProject(fixture, {
        install: false,
        overwrite: true,
        log: () => {},
    })
    assert(
        (
            await readFile(
                resolve(fixture, "src/components/mini-app/Page.js"),
                "utf8"
            )
        ).includes("export { Page as default, Page }")
    )

    const valid = await checkProject({ root: fixture })
    assert.deepEqual(valid.failures, [])
    const validHook = spawnSync(resolve(fixture, ".git/hooks/pre-commit"), [], {
        cwd: fixture,
        encoding: "utf8",
    })
    assert.equal(validHook.status, 0, validHook.stderr)

    await mkdir(resolve(fixture, "src/components"), { recursive: true })
    await writeFile(
        resolve(fixture, "src/components/TextField.jsx"),
        `export const TextField = () => (
    <input style={{ color: "#fff" }} />
)
`,
        "utf8"
    )

    const invalid = await checkProject({ root: fixture })
    assert.equal(invalid.ok, false)
    assert(
        invalid.failures.some((failure) =>
            failure.includes("duplicates the Mini App")
        )
    )
    assert(invalid.failures.some((failure) => failure.includes("raw control")))
    assert(
        invalid.failures.some((failure) =>
            failure.includes("hardcodes a color")
        )
    )
    const invalidHook = spawnSync(
        resolve(fixture, ".git/hooks/pre-commit"),
        [],
        {
            cwd: fixture,
            encoding: "utf8",
        }
    )
    assert.notEqual(invalidHook.status, 0)
} finally {
    await rm(fixture, { recursive: true, force: true })
}

console.log("Mini App consumer setup and checks are valid.")
