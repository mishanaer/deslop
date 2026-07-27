import assert from "node:assert/strict"
import { access, readFile } from "node:fs/promises"
import { resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
const packageJson = JSON.parse(
  await readFile(resolve(root, "package.json"), "utf8")
)

async function assertExportTarget(target) {
  const relativeTarget = typeof target === "string" ? target : target.import
  const typesTarget = typeof target === "string" ? undefined : target.types

  if (relativeTarget.includes("*")) return

  await assert.doesNotReject(
    access(resolve(root, relativeTarget)),
    `Missing package export target: ${relativeTarget}`
  )

  if (typesTarget) {
    await assert.doesNotReject(
      access(resolve(root, typesTarget)),
      `Missing package type target: ${typesTarget}`
    )
  }
}

for (const target of Object.values(packageJson.exports)) {
  await assertExportTarget(target)
}

for (const component of ["button", "dialog", "input", "select", "sidebar"]) {
  await access(resolve(root, `dist/components/ui/${component}.js`))
  await access(resolve(root, `dist/src/components/ui/${component}.d.ts`))
}

console.log("Web UI package exports point to built files.")
