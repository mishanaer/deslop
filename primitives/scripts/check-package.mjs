import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const packageJson = JSON.parse(
  await readFile(resolve(root, "package.json"), "utf8"),
);

assert.equal(packageJson.private, false);
assert.equal(packageJson.publishConfig?.access, "public");
assert.equal(packageJson.peerDependenciesMeta?.react?.optional, true);

async function checkTarget(target) {
  if (typeof target === "string") {
    if (!target.includes("*")) await access(resolve(root, target));
    return;
  }

  await checkTarget(target.import);
  await checkTarget(target.types);
}

for (const target of Object.values(packageJson.exports)) {
  await checkTarget(target);
}

const iconFiles = (await readdir(resolve(root, "icons"))).filter((file) =>
  file.endsWith(".svg"),
);
const iconRuntime = await readFile(resolve(root, "icons-react.js"), "utf8");
const iconTypes = await readFile(resolve(root, "icons-react.d.ts"), "utf8");

assert(!iconRuntime.includes("import.meta.glob"));
assert(!iconRuntime.includes("?react"));
assert(iconRuntime.includes('from "react"'));
assert(iconTypes.includes("export type IconName"));
assert.equal(
  [...iconRuntime.matchAll(/^export const Icon[A-Za-z0-9]+ =/gm)].length,
  iconFiles.length,
);

console.log("Primitives package exports and generated React icons are consumable.");
