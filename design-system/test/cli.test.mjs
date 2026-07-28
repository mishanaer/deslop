import assert from "node:assert/strict"
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import test from "node:test"

import { main, runCli } from "../src/cli.mjs"

async function fixture(files) {
  const root = await mkdtemp(path.join(tmpdir(), "deslop-cli-"))
  for (const [relativePath, source] of Object.entries(files)) {
    const target = path.join(root, relativePath)
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, source, "utf8")
  }
  return root
}

function capture() {
  let value = ""
  return {
    stream: { write: (chunk) => (value += chunk) },
    read: () => value,
  }
}

test("CLI dispatches doctor without changing the project", async (context) => {
  const root = await fixture({
    "package.json": '{"name":"cli-fixture","dependencies":{"react":"19"}}\n',
    "src/App.tsx": "export const App = () => <main />\n",
  })
  context.after(() => rm(root, { recursive: true, force: true }))
  const stdout = capture()

  const exitCode = await runCli(["doctor", "--cwd", root], {
    stdout: stdout.stream,
    stderr: capture().stream,
  })

  assert.equal(exitCode, 0)
  assert.equal(JSON.parse(stdout.read()).package.name, "cli-fixture")
})

test("CLI propagates strict audit failure", async (context) => {
  const root = await fixture({
    "package.json": '{"name":"cli-audit-fixture"}\n',
    "src/App.tsx": "export const App = () => <button>Wrong</button>\n",
  })
  context.after(() => rm(root, { recursive: true, force: true }))
  const stdout = capture()

  const exitCode = await runCli(
    ["audit", "--cwd", root, "--strict", "--json"],
    { stdout: stdout.stream, stderr: capture().stream },
  )

  assert.equal(exitCode, 1)
  assert.equal(JSON.parse(stdout.read()).violations[0].rule, "native-control")
})

test("main reports invalid commands as usage errors", async () => {
  const stderr = capture()

  const exitCode = await main(["unknown"], {
    stdout: capture().stream,
    stderr: stderr.stream,
  })

  assert.equal(exitCode, 2)
  assert.match(stderr.read(), /Unknown command/)
})
