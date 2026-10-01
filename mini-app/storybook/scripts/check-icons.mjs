import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { build } from "esbuild";

// Bundle with the same React installation as Storybook; primitives are not a
// standalone npm package and do not carry their own node_modules directory.
if (!process.env.DESLOP_ICON_TEST_BUNDLE) {
  const temporary = await mkdtemp(join(tmpdir(), "deslop-icons-"));
  try {
    const outfile = join(temporary, "check.mjs");
    await build({
      entryPoints: [import.meta.filename], outfile, bundle: true,
      platform: "node", format: "esm",
      banner: { js: 'import { createRequire as createBundleRequire } from "node:module"; const require = createBundleRequire(import.meta.url);' },
      nodePaths: [resolve("node_modules")],
      define: { "process.env.DESLOP_ICON_TEST_BUNDLE": '"1"' },
    });
    const result = spawnSync(process.execPath, [outfile], { encoding: "utf8" });
    process.stdout.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
    if (result.status !== 0) process.exitCode = result.status ?? 1;
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
} else {
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { Icon, iconNames, getIconComponent } = await import("../../../primitives/icons-react.js");
  const legacy = await import("../../../primitives/material-symbols-react.js");
  const { iconData } = await import("../../../primitives/icons-data.js");
  const config = JSON.parse(await readFile("../../primitives/material-symbols.json", "utf8"));
  const render = (props) => renderToStaticMarkup(createElement(Icon, props));
  assert.equal(iconNames.length, 760);
  for (const name of iconNames) {
    assert(getIconComponent(name), name);
    for (const shape of ["round", "sharp"]) {
      for (const variant of ["line", "solid"]) {
        const html = render({ name, shape, variant });
        assert(html.startsWith("<svg"), `${name}/${shape}/${variant}`);
        assert(html.includes("<path"), name);
        assert(html.includes('aria-hidden="true"'), name);
        assert(!html.includes("undefined"), name);
      }
    }
  }
  assert.equal(render({ name: "unknown" }), "");
  assert.equal(getIconComponent("toString"), undefined);
  assert.equal(getIconComponent("unknown"), undefined);
  assert.equal(render({ name: "heart", fill: true }), render({ name: "heart", variant: "solid" }));
  assert.equal(render({ name: "heart", fill: true, variant: "line" }), render({ name: "heart" }));
  const labelled = render({ name: "heart", title: "Favorite", size: 32 });
  assert(labelled.includes('<title>Favorite</title>'));
  assert(labelled.includes('aria-label="Favorite"'));
  assert(labelled.includes('role="img"'));
  assert(labelled.includes('width="32"'));
  assert(!labelled.includes('aria-hidden="true"'));
  assert(!render({ name: "heart", weight: 700, grade: 10, opticalSize: 48 }).includes('weight='));
  assert(render({ name: "heart", size: "1em" }).includes('width="1em"'));
  for (const name of legacy.materialSymbolNames) {
    assert(legacy.getIconComponent(name), name);
    assert.equal(renderToStaticMarkup(createElement(legacy.MaterialSymbol, { name })), render({ name: config.replacements[name] }));
  }
  for (const alias of Object.keys(config.aliases)) {
    assert(renderToStaticMarkup(createElement(legacy[alias])).startsWith("<svg"), alias);
  }
  const clippedName = iconNames.find((name) => JSON.stringify(iconData[name]).includes('"clipPath"'));
  assert(clippedName, "Expected a clipping fixture");
  const repeated = renderToStaticMarkup(createElement("div", null,
    createElement(Icon, { name: clippedName }), createElement(Icon, { name: clippedName })));
  const ids = [...repeated.matchAll(/ id="([^"]+)"/g)].map((match) => match[1]);
  assert(ids.length >= 2);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, target] of repeated.matchAll(/clip-path="url\(#([^)]*)\)"/g)) assert(ids.includes(target));
  console.log("All 3040 SVG variants, 113 legacy replacements, named aliases, accessibility and scoped clipping IDs passed.");
}
