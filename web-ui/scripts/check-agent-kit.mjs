import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { resolve } from "node:path"

import { checkProject } from "../agent/check-project.mjs"
import { setupProject } from "../bin/web-ui.mjs"

const root = await mkdtemp(resolve(tmpdir(), "deslop-web-ui-"))

try {
  await mkdir(resolve(root, "src"), { recursive: true })
  await writeFile(
    resolve(root, "package.json"),
    `${JSON.stringify({ name: "fixture", private: true, scripts: {} }, null, 2)}\n`
  )
  await writeFile(
    resolve(root, "src/main.tsx"),
    'import { App } from "./App"\n\nexport default App\n'
  )
  await writeFile(
    resolve(root, "src/App.tsx"),
    'import { Button } from "./components/web-ui"\n\nexport function App() {\n  return <Button>Save</Button>\n}\n'
  )
  execFileSync("git", ["init", "-q"], { cwd: root })

  await setupProject(root, { install: false, log: () => {} })

  const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"))
  const entry = await readFile(resolve(root, "src/main.tsx"), "utf8")
  const rules = await readFile(resolve(root, "AGENTS.md"), "utf8")
  const gateway = await readFile(
    resolve(root, "src/components/web-ui/index.ts"),
    "utf8"
  )
  const sourceReadme = await readFile(
    resolve(root, ".deslop/web-ui/source/README.md"),
    "utf8"
  )
  const hook = await readFile(resolve(root, ".git/hooks/pre-commit"), "utf8")

  assert.equal(packageJson.dependencies["@deslop/web-ui"], "^0.1.0")
  assert.equal(packageJson.scripts["check:web-ui"], "web-ui check")
  assert.match(packageJson.scripts.prepare, /web-ui hook/)
  assert.match(entry, /@deslop\/web-ui\/styles\.css/)
  assert.match(rules, /deslop-web-ui:rules:start/)
  assert.match(rules, /\.deslop\/web-ui\/COMPONENTS\.md/)
  assert.match(gateway, /\.\/ui\/button/)
  assert.match(gateway, /\.\/blocks\/dashboard/)
  assert.match(gateway, /\.\/charts\/area/)
  assert.match(sourceReadme, /Не импортируй/)
  assert.match(hook, /node_modules\/\.bin\/web-ui check/)

  const valid = await checkProject({ root })
  assert.deepEqual(valid, { ok: true, failures: [] })

  await writeFile(
    resolve(root, "src/RawButton.tsx"),
    "export function RawButton() { return <button>Wrong</button> }\n"
  )
  const invalid = await checkProject({ root })
  assert.equal(invalid.ok, false)
  assert.ok(invalid.failures.some((failure) => failure.includes("raw control")))

  console.log("Web UI agent kit passed.")
} finally {
  await rm(root, { recursive: true, force: true })
}
