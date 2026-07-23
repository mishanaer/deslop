import { chmod } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const gitDirectory = resolve(root, ".git");
const hook = resolve(root, ".githooks/pre-push");

if (!existsSync(gitDirectory)) {
  console.log("Git hooks were not installed: this is not a Git checkout.");
  process.exit(0);
}

await chmod(hook, 0o755);

const result = spawnSync(
  "git",
  ["config", "--local", "core.hooksPath", ".githooks"],
  { cwd: root, stdio: "inherit" },
);

if (result.status !== 0) {
  console.error("Could not configure the repository Git hooks.");
  process.exit(result.status ?? 1);
}

console.log("Git pre-push verification is enabled.");
