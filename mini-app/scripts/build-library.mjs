import { spawn } from "node:child_process"
import {
    copyFile,
    mkdir,
    mkdtemp,
    readdir,
    rename,
    rm,
    stat,
} from "node:fs/promises"
import { basename, dirname, resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
const output = resolve(root, "dist")
const temporary = await mkdtemp(resolve(root, ".dist-build-"))

const run = (entry, args, env = process.env) =>
    new Promise((resolvePromise, reject) => {
        const child = spawn(process.execPath, [entry, ...args], {
            cwd: root,
            env,
            stdio: "inherit",
        })

        child.on("error", reject)
        child.on("exit", (code, signal) => {
            if (code === 0) {
                resolvePromise()
                return
            }
            reject(
                new Error(
                    `${basename(entry)} failed${
                        signal ? ` (${signal})` : ` with exit code ${code}`
                    }`
                )
            )
        })
    })

const listFiles = async (directory) => {
    const entries = await readdir(directory, { recursive: true })
    const files = []
    for (const entry of entries) {
        const path = resolve(directory, entry)
        if ((await stat(path)).isFile()) files.push(entry)
    }
    return files
}

const publishPriority = (file) => {
    if (file.startsWith("assets/")) return 0
    if (file === "styles.css") return 2
    if (file === "library.d.ts") return 3
    if (file === "index.js") return 4
    return 1
}

const publishFile = async (file) => {
    const source = resolve(temporary, file)
    const destination = resolve(output, file)
    const staged = resolve(
        dirname(destination),
        `.${basename(destination)}.next-${process.pid}`
    )

    await mkdir(dirname(destination), { recursive: true })
    await copyFile(source, staged)
    await rename(staged, destination)
}

try {
    await run(resolve(root, "node_modules/vite/bin/vite.js"), [
        "build",
        "--config",
        "vite.lib.config.js",
        "--outDir",
        temporary,
        "--emptyOutDir",
    ])
    await run(resolve(root, "node_modules/typescript/bin/tsc"), [
        "-p",
        "tsconfig.build.json",
        "--outDir",
        temporary,
        "--declarationDir",
        temporary,
    ])
    await run(resolve(root, "scripts/check-package.mjs"), [], {
        ...process.env,
        DESLOP_DIST_DIR: temporary,
    })

    await mkdir(output, { recursive: true })
    const files = await listFiles(temporary)
    files.sort(
        (left, right) =>
            publishPriority(left) - publishPriority(right) ||
            left.localeCompare(right)
    )
    for (const file of files) await publishFile(file)

    console.log(
        `Published ${files.length} Mini App library files without clearing dist.`
    )
} finally {
    await rm(temporary, { recursive: true, force: true })
}
