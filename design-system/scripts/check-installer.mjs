import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { resolve } from "node:path"

import { setupDesignSystem } from "../bin/design-system.mjs"

const assertIncludes = (source, expected, label) => {
  if (!source.includes(expected)) {
    throw new Error(`${label} does not include ${expected}`)
  }
}

const testProduct = async (product) => {
  const root = await mkdtemp(resolve(tmpdir(), `deslop-${product}-`))
  try {
    await mkdir(resolve(root, "src"), { recursive: true })
    await writeFile(
      resolve(root, "package.json"),
      `${JSON.stringify({ name: `test-${product}`, private: true, scripts: {} }, null, 2)}\n`
    )
    await writeFile(
      resolve(root, "src/main.jsx"),
      'import React from "react"\nimport { createRoot } from "react-dom/client"\nconst App = () => <div />\ncreateRoot(document.getElementById("root")).render(<App />)\n'
    )

    await setupDesignSystem({
      product,
      root,
      hooks: false,
      install: false,
      log: () => {},
    })

    const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"))
    const agents = await readFile(resolve(root, "AGENTS.md"), "utf8")
    const entry = await readFile(resolve(root, "src/main.jsx"), "utf8")
    const packageName = product === "web" ? "@deslop/web-ui" : "@deslop/mini-app"
    const folder = product === "web" ? "web-ui" : "mini-app"

    if (!packageJson.dependencies?.[packageName]) {
      throw new Error(`${packageName} was not added to package.json`)
    }
    if (!packageJson.dependencies?.["@deslop/primitives"]) {
      throw new Error("@deslop/primitives was not added to package.json")
    }
    assertIncludes(agents, `deslop-${folder}:rules:start`, `${product} AGENTS.md`)
    assertIncludes(entry, `${packageName}/styles.css`, `${product} entry file`)
    await readFile(resolve(root, `.deslop/${folder}/components.json`), "utf8")
    await readFile(resolve(root, `src/components/${folder}/index.${product === "web" ? "ts" : "js"}`), "utf8")
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

await testProduct("web")
await testProduct("mini-app")
console.log("Design system installer check passed.")
