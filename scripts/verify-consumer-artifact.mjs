import assert from "node:assert/strict";
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixtureSource = path.resolve(root, "fixtures/react18-consumer");
const miniApp = path.resolve(root, "mini-app");
const packageManager = process.env.DESLOP_PNPM ?? "pnpm";

function run(command, args, cwd, { capture = false } = {}) {
  return new Promise((resolvePromise, reject) => {
    const chunks = [];
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit",
    });

    if (capture) child.stdout.on("data", (chunk) => chunks.push(chunk));
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolvePromise(Buffer.concat(chunks).toString("utf8").trim());
        return;
      }
      reject(
        new Error(`${command} ${args.join(" ")} failed with exit code ${code}`),
      );
    });
  });
}

async function pack(packageDirectory, destination) {
  const output = await run(
    packageManager,
    ["pack", "--config.ignore-scripts=true", "--pack-destination", destination],
    packageDirectory,
    { capture: true },
  );
  const archive = output.split("\n").filter(Boolean).at(-1);
  if (!archive)
    throw new Error(
      `Could not determine archive produced for ${packageDirectory}`,
    );
  return path.resolve(packageDirectory, archive);
}

const temporaryRoot = await mkdtemp(path.join(tmpdir(), "deslop-consumer-"));

try {
  const archives = path.resolve(temporaryRoot, "packages");
  const consumer = path.resolve(temporaryRoot, "consumer");
  await mkdir(path.resolve(consumer, "src"), { recursive: true });
  await mkdir(archives, { recursive: true });

  await run(
    process.execPath,
    [path.resolve(miniApp, "scripts/build-library.mjs")],
    miniApp,
  );
  await run(
    process.execPath,
    [path.resolve(miniApp, "scripts/check-package.mjs")],
    miniApp,
  );

  const primitivesArchive = await pack(
    path.resolve(root, "primitives"),
    archives,
  );
  const miniAppArchive = await pack(miniApp, archives);
  const sourcePackage = JSON.parse(
    await readFile(path.resolve(fixtureSource, "package.json"), "utf8"),
  );
  sourcePackage.dependencies["@deslop/primitives"] =
    `file:${primitivesArchive}`;
  sourcePackage.dependencies["@deslop/mini-app"] = `file:${miniAppArchive}`;

  await writeFile(
    path.resolve(consumer, "package.json"),
    `${JSON.stringify(sourcePackage, null, 2)}\n`,
  );
  await copyFile(
    path.resolve(fixtureSource, "tsconfig.json"),
    path.resolve(consumer, "tsconfig.json"),
  );
  await copyFile(
    path.resolve(fixtureSource, "src/App.tsx"),
    path.resolve(consumer, "src/App.tsx"),
  );
  await copyFile(
    path.resolve(fixtureSource, "src/global.d.ts"),
    path.resolve(consumer, "src/global.d.ts"),
  );
  await copyFile(
    path.resolve(fixtureSource, "src/main.tsx"),
    path.resolve(consumer, "src/main.tsx"),
  );
  await copyFile(
    path.resolve(fixtureSource, "src/ssr.mjs"),
    path.resolve(consumer, "src/ssr.mjs"),
  );
  await copyFile(
    path.resolve(fixtureSource, "index.html"),
    path.resolve(consumer, "index.html"),
  );

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
  );
  await run(
    process.execPath,
    [path.resolve(consumer, "node_modules/typescript/bin/tsc"), "--noEmit"],
    consumer,
  );
  await run(
    process.execPath,
    [
      path.resolve(consumer, "node_modules/vite/bin/vite.js"),
      "build",
      "--logLevel",
      "error",
    ],
    consumer,
  );
  await run(
    process.execPath,
    [path.resolve(consumer, "src/ssr.mjs")],
    consumer,
  );

  const builtAssets = await readdir(path.resolve(consumer, "dist", "assets"));
  const bundledJavaScript = (
    await Promise.all(
      builtAssets
        .filter((file) => file.endsWith(".js"))
        .map((file) =>
          readFile(path.resolve(consumer, "dist", "assets", file), "utf8"),
        ),
    )
  ).join("\n");
  const hasWorkerFile = builtAssets.some((file) =>
    /^gradientWorker-.*\.js$/.test(file),
  );
  const hasInlinedWorker =
    bundledJavaScript.includes("new Worker") &&
    bundledJavaScript.includes("data:text/javascript;base64");
  assert(
    hasWorkerFile || hasInlinedWorker,
    "consumer bundle must resolve the Mini App gradient worker as a file or inline URL",
  );

  console.log(
    "React 18 consumer installs, typechecks, bundles, and hydrates the packed Mini App.",
  );
} finally {
  if (process.env.DESLOP_KEEP_CONSUMER_FIXTURE) {
    console.log(`Consumer fixture kept at ${temporaryRoot}`);
  } else {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}
