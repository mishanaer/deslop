import { spawn } from "node:child_process"
import { access } from "node:fs/promises"
import { resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
const buildScript = resolve(root, "scripts/build-library.mjs")
const publicEntries = [
    resolve(root, "dist/index.js"),
    resolve(root, "dist/styles.css"),
    resolve(root, "dist/library.d.ts"),
]
const delay = (milliseconds) =>
    new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds))

const runBuild = () =>
    new Promise((resolvePromise, reject) => {
        const child = spawn(process.execPath, [buildScript], {
            cwd: root,
            stdio: "inherit",
        })
        child.on("error", reject)
        child.on("exit", (code, signal) => {
            if (code === 0) resolvePromise()
            else
                reject(
                    new Error(
                        `stable build failed${
                            signal ? ` (${signal})` : ` with exit code ${code}`
                        }`
                    )
                )
        })
    })

for (const entry of publicEntries) await access(entry)

let running = true
let missingEntry = null
const build = runBuild().finally(() => {
    running = false
})

while (running && !missingEntry) {
    for (const entry of publicEntries) {
        try {
            await access(entry)
        } catch {
            missingEntry = entry
            break
        }
    }
    await delay(2)
}

await build
if (missingEntry) {
    throw new Error(`public entry disappeared during rebuild: ${missingEntry}`)
}

console.log("Mini App public entries remain available throughout a rebuild.")
