import assert from "node:assert/strict"
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { resolve } from "node:path"
import test from "node:test"

import { auditProject, formatHumanReport, runAudit } from "../src/audit.mjs"

const fixture = async (files) => {
  const root = await mkdtemp(resolve(tmpdir(), "deslop-audit-"))
  for (const [path, source] of Object.entries(files)) {
    const target = resolve(root, path)
    await mkdir(resolve(target, ".."), { recursive: true })
    await writeFile(target, source, "utf8")
  }
  return root
}

const cleanProject = {
  "package.json": `${JSON.stringify({
    name: "fixture",
    private: true,
    dependencies: { "@deslop/primitives": "0.1.0" },
  })}\n`,
  "src/App.tsx": `
import { MaterialSymbol } from "@deslop/primitives/material-symbols-react"

export function App() {
  // A documentation comment such as <button> must not become a finding.
  return <main><MaterialSymbol name="search" aria-label="Search" /></main>
}
`,
  "src/app.css": `
.product-layout {
  color: var(--primary-90);
  font: var(--ui-body-font-weight) var(--ui-body-font-size) / var(--ui-body-line-height) var(--ui-font-interface);
}
`,
}

test("a clean Deslop consumer passes strict audit", async (context) => {
  const root = await fixture(cleanProject)
  context.after(() => rm(root, { recursive: true, force: true }))

  const result = await auditProject({ cwd: root, strict: true })

  assert.equal(result.ok, true)
  assert.equal(result.pass, true)
  assert.equal(result.summary.violations, 0)
  assert.equal(result.scannedFiles, 2)
  assert.match(formatHumanReport(result), /PASS\n$/)
})

test("strict audit reports each proven Memento bypass class", async (context) => {
  const root = await fixture({
    "package.json": `${JSON.stringify({
      name: "broken-fixture",
      dependencies: { "lucide-react": "1.0.0", sonner: "1.0.0" },
    })}\n`,
    "src/components/ui/button.tsx": `export const LegacyButton = () => <button>Old</button>\n`,
    "src/App.tsx": `
import { LegacyButton } from "@/components/ui/button"
import * as RadioPrimitive from "@radix-ui/react-radio-group"
import { toast } from "sonner"

export function App() {
  toast("ready")
  return (
    <main className="bg-blue-500 text-sm tracking-wide" style={{ color: "rgb(1 2 3)" }}>
      <input style={{ color: "#fff" }} />
      <LegacyButton />
    </main>
  )
}
`,
    "src/legacy.css": `.legacy { color: var(--background); font-size: 13px; }\n`,
  })
  context.after(() => rm(root, { recursive: true, force: true }))

  const result = await auditProject({ cwd: root, strict: true })
  const rules = new Set(result.violations.map(({ rule }) => rule))

  assert.equal(result.ok, false)
  assert.equal(result.pass, false)
  for (const rule of [
    "local-ui-module",
    "local-ui-import",
    "native-control",
    "direct-ui-dependency",
    "direct-ui-import",
    "hardcoded-color",
    "tailwind-palette",
    "deprecated-token",
    "typography-escape",
  ]) {
    assert.ok(rules.has(rule), `expected ${rule}`)
  }
})

test("a reasoned, scoped allowlist suppresses only its matching finding", async (context) => {
  const root = await fixture({
    ...cleanProject,
    "src/Waveform.tsx": `export function Waveform() { return <input aria-label="Audio level" /> }\n`,
  })
  context.after(() => rm(root, { recursive: true, force: true }))

  const result = await auditProject({
    cwd: root,
    strict: true,
    allowlist: {
      allow: [
        {
          rule: "native-control",
          file: "src/Waveform.tsx",
          reason: "Audio visualization has no generic Deslop equivalent",
        },
      ],
    },
  })

  assert.equal(result.ok, true)
  assert.equal(result.allowed.length, 1)
  assert.equal(result.allowed[0].allowance.reason.includes("Audio visualization"), true)
})

test("allowlist entries without a useful reason fail strict audit", async (context) => {
  const root = await fixture(cleanProject)
  context.after(() => rm(root, { recursive: true, force: true }))

  const result = await auditProject({
    cwd: root,
    strict: true,
    allowlist: {
      allow: [{ rule: "native-control", file: "src/App.tsx", reason: "skip" }],
    },
  })

  assert.equal(result.ok, false)
  assert.equal(result.violations[0].rule, "allowlist-invalid")
})

test("runAudit emits JSON and returns a nonzero strict exit code", async (context) => {
  const root = await fixture({
    "package.json": "{\"name\":\"fixture\"}\n",
    "src/App.tsx": "export const App = () => <button>Wrong</button>\n",
  })
  context.after(() => rm(root, { recursive: true, force: true }))
  let output = ""
  let errors = ""

  const result = await runAudit({
    cwd: root,
    args: ["--strict", "--json"],
    stdout: (value) => {
      output += value
    },
    stderr: (value) => {
      errors += value
    },
  })

  assert.equal(result.exitCode, 1)
  assert.equal(errors, "")
  assert.equal(JSON.parse(output).violations[0].rule, "native-control")
})
