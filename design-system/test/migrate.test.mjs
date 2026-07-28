import assert from "node:assert/strict"
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import test from "node:test"

import {
  loadMigrationRegistry,
  migrateProject,
  transformSource,
} from "../src/migrate.mjs"

async function fixture(source) {
  const root = await mkdtemp(path.join(tmpdir(), "deslop-migrate-"))
  await mkdir(path.join(root, "src"), { recursive: true })
  await writeFile(path.join(root, "package.json"), '{"name":"fixture"}\n', "utf8")
  await writeFile(path.join(root, "src/App.tsx"), source, "utf8")
  return root
}

const input = `import { Button } from "@/components/ui/button"
import { Search as Find, Camera } from "lucide-react"
import { toast, Toaster as ProductToaster } from "sonner"

export function App() {
  toast("Ready")
  return <Button><Find /><Camera /><ProductToaster /></Button>
}
`

test("migration transforms only registry-backed imports and reports the rest", async () => {
  const registry = await loadMigrationRegistry()
  const result = transformSource(input, { registry, file: "src/App.tsx" })

  assert.equal(result.changed, true)
  assert.match(
    result.source,
    /from "@deslop\/web-ui\/components\/button"/,
  )
  assert.match(
    result.source,
    /import \{ IconSearch as Find \} from "@deslop\/primitives\/icons-react"/,
  )
  assert.match(result.source, /import \{ Camera \} from "lucide-react"/)
  assert.match(result.source, /from "@deslop\/web-ui\/toast"/)
  assert.match(result.source, /from "@deslop\/web-ui\/components\/sonner"/)
  assert.deepEqual(
    result.reviewItems.map(({ symbol }) => symbol),
    ["Camera"],
  )

  const secondPass = transformSource(result.source, {
    registry,
    file: "src/App.tsx",
  })
  assert.equal(secondPass.changed, false)
  assert.equal(secondPass.source, result.source)
})

test("every registered icon migration targets a real public export", async () => {
  const registry = await loadMigrationRegistry()
  const iconRuntime = await readFile(
    new URL("../../primitives/icons-react.js", import.meta.url),
    "utf8",
  )

  for (const mapping of Object.values(registry.packageImports["lucide-react"])) {
    assert.match(
      iconRuntime,
      new RegExp(`export const ${mapping.import}\\b`),
      `${mapping.import} is not exported by @deslop/primitives/icons-react`,
    )
  }
})

test("dry-run is non-mutating and write mode is idempotent", async (context) => {
  const root = await fixture(input)
  context.after(() => rm(root, { recursive: true, force: true }))
  const sourcePath = path.join(root, "src/App.tsx")

  const dryRun = await migrateProject({ cwd: root, dryRun: true })
  assert.equal(dryRun.summary.changedFiles, 1)
  assert.equal(await readFile(sourcePath, "utf8"), input)

  const write = await migrateProject({ cwd: root })
  const migrated = await readFile(sourcePath, "utf8")
  assert.equal(write.mode, "write")
  assert.notEqual(migrated, input)

  const repeat = await migrateProject({ cwd: root })
  assert.equal(repeat.summary.changedFiles, 0)
  assert.equal(await readFile(sourcePath, "utf8"), migrated)
})

test("unknown local UI modules stay unchanged and become review items", async () => {
  const registry = await loadMigrationRegistry()
  const source = 'import { Timeline } from "@/components/ui/timeline"\n'
  const result = transformSource(source, { registry, file: "src/App.tsx" })

  assert.equal(result.changed, false)
  assert.equal(result.source, source)
  assert.equal(result.reviewItems[0].kind, "unknown-local-ui-module")
})
