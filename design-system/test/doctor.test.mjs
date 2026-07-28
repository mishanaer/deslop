import assert from "node:assert/strict"
import { access, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import test from "node:test"

import { inspectProject, runDoctor } from "../src/doctor.mjs"

async function fixture(files) {
  const root = await mkdtemp(path.join(tmpdir(), "deslop-doctor-"))

  for (const [relativePath, source] of Object.entries(files)) {
    const target = path.join(root, relativePath)
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, source, "utf8")
  }

  return root
}

const projectFiles = {
  "package.json": `${JSON.stringify({
    name: "doctor-fixture",
    packageManager: "pnpm@10.0.0",
    dependencies: {
      next: "^15.0.0",
      react: "^19.0.0",
      "react-dom": "^19.0.0",
      "lucide-react": "^1.0.0",
      sonner: "^2.0.0",
    },
    devDependencies: {
      postcss: "^8.0.0",
      tailwindcss: "^3.4.0",
    },
  })}\n`,
  "postcss.config.mjs": "export default { plugins: {} }\n",
  "tailwind.config.ts": "export default { content: ['./src/**/*.{ts,tsx}'] }\n",
  "src/App.tsx": `
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function App() {
  return <><Button>Save</Button><input aria-label="Search" /><button><Search /></button>{/* <button>old</button> */}</>
}
`,
  "src/globals.css": `
@tailwind base;
:root { --background: #fff; --primary: rgb(1 2 3); }
body { margin: 0; }
`,
  ".next-custom/static/generated.css": `
:root { --background: #000; }
.generated { color: #abcdef; }
`,
  "public/generated.css": `
:root { --primary: #000; }
`,
}

test("doctor detects the consumer environment and migration risks", async (context) => {
  const root = await fixture(projectFiles)
  context.after(() => rm(root, { recursive: true, force: true }))

  const plan = await inspectProject({ cwd: root })

  assert.deepEqual(plan.environment.frameworks, [{ name: "next", version: "^15.0.0" }])
  assert.equal(plan.environment.react.installed, true)
  assert.equal(plan.environment.tailwind.major, 3)
  assert.deepEqual(plan.environment.postcss.configFiles, ["postcss.config.mjs"])
  assert.equal(plan.package.packageManager.name, "pnpm")
  assert.deepEqual(
    plan.existingUi.map(({ name }) => name),
    ["lucide-react", "sonner"],
  )
  assert.equal(plan.source.nativeControls.total, 2)
  assert.equal(plan.source.imports.localUi.count, 1)
  assert.equal(plan.source.imports.lucide.count, 1)
  assert.deepEqual(
    plan.tokenCollisions.map(({ token }) => token),
    ["--background", "--primary"],
  )
  assert.equal(plan.source.hardcodedVisuals.files, 1)
  assert.equal(plan.recommendation.strategy, "primitives-and-review")
  assert.equal(plan.recommendation.blockers.length, 0)
  assert.deepEqual(plan.recommendation.nextCommands, [
    "deslop migrate --dry-run",
    "deslop migrate",
    "deslop audit --strict",
  ])
})

test("doctor prints by default and writes only with explicit output", async (context) => {
  const root = await fixture(projectFiles)
  context.after(() => rm(root, { recursive: true, force: true }))
  let output = ""

  await runDoctor({
    cwd: root,
    stdout: { write: (value) => (output += value) },
  })

  assert.equal(JSON.parse(output).package.name, "doctor-fixture")
  await assert.rejects(access(path.join(root, "deslop-plan.json")))

  await runDoctor({
    cwd: root,
    output: "deslop-plan.json",
    stdout: { write() {} },
  })

  const saved = JSON.parse(await readFile(path.join(root, "deslop-plan.json"), "utf8"))
  assert.equal(saved.package.name, "doctor-fixture")
})
