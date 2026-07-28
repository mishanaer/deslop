import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const fixtureSource = path.resolve(root, "fixtures/react18-consumer")
const packageManager = process.env.DESLOP_PNPM ?? "pnpm"

function run(command, args, cwd, { capture = false } = {}) {
  return new Promise((resolvePromise, reject) => {
    const chunks = []
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit",
    })

    if (capture) child.stdout.on("data", (chunk) => chunks.push(chunk))
    child.on("error", reject)
    child.on("exit", (code) => {
      if (code === 0) {
        resolvePromise(Buffer.concat(chunks).toString("utf8").trim())
        return
      }
      reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}`))
    })
  })
}

async function pack(packageDirectory, destination) {
  const output = await run(
    packageManager,
    ["pack", "--pack-destination", destination],
    packageDirectory,
    { capture: true },
  )
  const archive = output.split("\n").filter(Boolean).at(-1)
  if (!archive) throw new Error(`Could not determine archive produced for ${packageDirectory}`)
  return path.resolve(packageDirectory, archive)
}

const temporaryRoot = await mkdtemp(path.join(tmpdir(), "deslop-consumer-"))

try {
  const archives = path.resolve(temporaryRoot, "packages")
  const consumer = path.resolve(temporaryRoot, "consumer")
  await mkdir(path.resolve(consumer, "src"), { recursive: true })
  await mkdir(archives, { recursive: true })

  const primitivesArchive = await pack(path.resolve(root, "primitives"), archives)
  const webUiArchive = await pack(path.resolve(root, "web-ui"), archives)
  const sourcePackage = JSON.parse(
    await readFile(path.resolve(fixtureSource, "package.json"), "utf8"),
  )
  sourcePackage.dependencies["@deslop/primitives"] = `file:${primitivesArchive}`
  sourcePackage.dependencies["@deslop/web-ui"] = `file:${webUiArchive}`

  await writeFile(
    path.resolve(consumer, "package.json"),
    `${JSON.stringify(sourcePackage, null, 2)}\n`,
  )
  await copyFile(
    path.resolve(fixtureSource, "tsconfig.json"),
    path.resolve(consumer, "tsconfig.json"),
  )
  await copyFile(
    path.resolve(fixtureSource, "src/App.tsx"),
    path.resolve(consumer, "src/App.tsx"),
  )
  await copyFile(
    path.resolve(fixtureSource, "src/global.d.ts"),
    path.resolve(consumer, "src/global.d.ts"),
  )

  await run(
    packageManager,
    [
      "install",
      "--ignore-scripts",
      "--frozen-lockfile=false",
      "--store-dir",
      path.resolve(root, ".pnpm-store"),
    ],
    consumer,
  )
  await run(
    process.execPath,
    [path.resolve(consumer, "node_modules/typescript/bin/tsc"), "--noEmit"],
    consumer,
  )

  console.log("React 18 consumer installs packed Deslop artifacts and typechecks public APIs.")
} finally {
  if (process.env.DESLOP_KEEP_CONSUMER_FIXTURE) {
    console.log(`Consumer fixture kept at ${temporaryRoot}`)
  } else {
    await rm(temporaryRoot, { recursive: true, force: true })
  }
}
