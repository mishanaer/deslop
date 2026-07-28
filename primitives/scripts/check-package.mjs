import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const packageJson = JSON.parse(
  await readFile(resolve(root, "package.json"), "utf8"),
);

assert.equal(packageJson.private, false);
assert.equal(packageJson.publishConfig?.access, "public");
assert.equal(packageJson.peerDependenciesMeta?.react?.optional, true);
assert(packageJson.exports["./material-symbols-react"]);
assert.equal(packageJson.exports["./material-symbols.css"], "./material-symbols.css");

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

const iconRuntime = await readFile(resolve(root, "icons-react.js"), "utf8");
const iconTypes = await readFile(resolve(root, "icons-react.d.ts"), "utf8");
const iconCss = await readFile(resolve(root, "material-symbols.css"), "utf8");
const iconFont = await readFile(
  resolve(root, "fonts/MaterialSymbolsRounded-Variable.woff2"),
);
const iconLicense = await readFile(
  resolve(root, "MATERIAL_SYMBOLS_LICENSE.txt"),
  "utf8",
);
const iconConfig = JSON.parse(
  await readFile(resolve(root, "material-symbols.json"), "utf8"),
);
const iconFontManifest = JSON.parse(
  await readFile(resolve(root, "material-symbols-font.json"), "utf8"),
);

assert(!iconRuntime.includes("import.meta.glob"));
assert(!iconRuntime.includes("?react"));
assert(iconRuntime.includes('from "react"'));
assert(iconRuntime.includes("export const MaterialSymbol"));
assert(iconTypes.includes("export type MaterialSymbolName"));
assert(iconTypes.includes("opticalSize?: number"));
assert(iconCss.includes('url("./fonts/MaterialSymbolsRounded-Variable.woff2")'));
assert.equal(iconFont.subarray(0, 4).toString("ascii"), "wOF2");
assert(iconFont.length < 200_000, "Material Symbols subset unexpectedly exceeds 200 KB");
assert(iconLicense.includes("Apache License"));
assert.equal(new Set(iconConfig.names).size, iconConfig.names.length);
const approvedNames = [...iconConfig.names].sort();
const digest = (value) => createHash("sha256").update(value).digest("hex");
assert.equal(iconFontManifest.names, approvedNames.length);
assert.equal(iconFontManifest.family, iconConfig.family);
assert.equal(iconFontManifest.registryHash, digest(JSON.stringify(approvedNames)));
assert.equal(iconFontManifest.fontHash, digest(iconFont));
assert.equal(iconFontManifest.byteLength, iconFont.length);
assert.equal(
  [...iconRuntime.matchAll(/^export const Icon[A-Za-z0-9]+ =/gm)].length,
  Object.keys(iconConfig.aliases).length,
);

console.log("Primitives package exports self-hosted Material Symbols and React bindings.");
