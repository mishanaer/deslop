import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import {
  accentColors,
  avatarGradients,
  baseColors,
  primaryColors,
  warmColors,
} from "../tokens.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const [markdown, css] = await Promise.all([
  readFile(`${root}/colors.md`, "utf8"),
  readFile(`${root}/colors.css`, "utf8"),
]);

const errors = [];
const tokenKey = (name) => name.toLowerCase().replaceAll(" ", "-");
const normalizeColor = (value) => value.trim().toUpperCase();
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const codeFence = String.fromCharCode(96).repeat(3);

const report = (message) => errors.push(message);

const markdownSection = (sectionName) => {
  const match = markdown.match(
    new RegExp(
      `^${escapeRegExp(sectionName)}:\\n([\\s\\S]*?)(?=^[a-z][a-z-]*:\\n|^${codeFence})`,
      "m",
    ),
  );

  if (!match) {
    report(`colors.md is missing the ${sectionName} section`);
    return "";
  }

  return match[1];
};

const markdownValues = (sectionName, name, properties) => {
  const section = markdownSection(sectionName);
  const key = tokenKey(name);
  const match = section.match(
    new RegExp(`^  ${escapeRegExp(key)}:\\n((?:    [a-z-]+: ".*"\\n?)+)`, "m"),
  );

  if (!match) {
    report(`colors.md is missing ${sectionName}.${key}`);
    return {};
  }

  const values = Object.fromEntries(
    [...match[1].matchAll(/^    ([a-z-]+): "([^"]+)"$/gm)].map(
      ([, property, value]) => [property, value],
    ),
  );

  for (const property of properties) {
    if (!values[property]) {
      report(`colors.md is missing ${sectionName}.${key}.${property}`);
    }
  }

  return values;
};

const parseDeclarations = (block, label) => {
  if (!block) {
    report(`colors.css is missing the ${label} declaration block`);
    return new Map();
  }

  return new Map(
    [...block.matchAll(/^\s*(--[a-z0-9-]+):\s*([^;]+);$/gm)].map(
      ([, name, value]) => [name, value.trim()],
    ),
  );
};

const staticDeclarations = parseDeclarations(
  css.match(/:root \{\n([\s\S]*?)\n\}\n\n:root,/s)?.[1],
  "static",
);
const lightDeclarations = parseDeclarations(
  css.match(
    /:root,\n:where\(\[data-color-scheme="light"\]\) \{([\s\S]*?)\n\}\n\n@media/s,
  )?.[1],
  "light",
);
const darkDeclarations = parseDeclarations(
  /:root\[data-color-scheme="dark"\],\n:where\(\[data-color-scheme="dark"\]\) \{([\s\S]*?)\n\}\s*$/s.exec(
    css,
  )?.[1],
  "dark",
);

const resolveColor = (token, themeDeclarations, seen = new Set()) => {
  if (seen.has(token)) {
    report(`colors.css has a circular reference at ${token}`);
    return "";
  }

  const value = themeDeclarations.get(token) ?? staticDeclarations.get(token);
  if (!value) {
    report(`colors.css is missing ${token}`);
    return "";
  }

  const reference = value.match(/^var\((--[a-z0-9-]+)\)$/);
  if (reference) {
    return resolveColor(reference[1], themeDeclarations, new Set([...seen, token]));
  }

  return normalizeColor(value);
};

const checkPair = ({ section, cssToken, documentationName, source, properties }) => {
  const documented = markdownValues(
    section,
    documentationName ?? source.name,
    properties,
  );

  for (const property of properties) {
    const expected = normalizeColor(source[property]);
    const actual = normalizeColor(documented[property] ?? "");

    if (actual !== expected) {
      report(
        `colors.md ${section}.${tokenKey(source.name)}.${property} is ${actual || "missing"}; expected ${expected}`,
      );
    }
  }

  if (!cssToken) return;

  const themes = {
    light: lightDeclarations,
    dark: darkDeclarations,
  };

  for (const theme of ["light", "dark"]) {
    const expected = normalizeColor(source[theme]);
    const actual = resolveColor(cssToken, themes[theme]);

    if (actual !== expected) {
      report(
        `colors.css ${cssToken} in ${theme} is ${actual || "missing"}; expected ${expected}`,
      );
    }
  }
};

for (const color of accentColors) {
  checkPair({
    section: "accent-colors",
    cssToken: `--accent-${tokenKey(color.name)}`,
    source: color,
    properties: ["light", "dark"],
  });
}

for (const color of baseColors) {
  checkPair({
    section: "base-colors",
    cssToken: `--${tokenKey(color.name)}`,
    source: color,
    properties: ["light", "dark"],
  });
}

for (const color of primaryColors) {
  checkPair({
    section: "primary-colors",
    cssToken:
      color.name === "Primary" ? "--primary" : `--${tokenKey(color.name)}`,
    source: color,
    properties: ["light", "dark"],
  });
}

for (const color of warmColors) {
  checkPair({
    section: "warm-colors",
    cssToken: `--${tokenKey(color.name)}`,
    source: color,
    properties: ["light", "dark"],
  });
  const peer = primaryColors.find((item) => item.name === color.name.replace("Warm", "Primary"));
  if (!peer) report(`Warm step has no Primary counterpart: ${color.name}`);
  for (const theme of ["light", "dark"]) {
    if (!/^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/i.test(color[theme])) report(`Invalid Warm color: ${color[theme]}`);
    if (peer && color[theme].slice(7) !== peer[theme].slice(7)) report(`Warm alpha differs from Primary: ${color.name} ${theme}`);
  }
}
if (warmColors.length !== primaryColors.length) report("Warm and Primary must have the same steps");

// Lock the rendered targets, not their raw RGB: alpha is composited over white.
for (const [step, target] of [[5, "FBFAF9"], [10, "F6F4EF"], [20, "EAE6DD"]]) {
  const value = warmColors.find((color) => color.name === `Warm ${step}`)?.light;
  if (!value) { report(`Missing Warm ${step}`); continue; }
  const alpha = parseInt(value.slice(7), 16) / 255;
  const composite = [1, 3, 5].map((offset) =>
    Math.round(parseInt(value.slice(offset, offset + 2), 16) * alpha + 255 * (1 - alpha))
      .toString(16).padStart(2, "0")).join("").toUpperCase();
  if (composite !== target) report(`Warm ${step} composites to ${composite}; expected ${target}`);
}

const systemDarkDeclarations = parseDeclarations(
  css.match(/@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-color-scheme="light"\]\) \{([\s\S]*?)\n  \}/)?.[1],
  "system dark",
);
for (const color of warmColors) {
  if (resolveColor(`--${tokenKey(color.name)}`, systemDarkDeclarations) !== normalizeColor(color.dark)) {
    report(`System dark differs from explicit dark: ${color.name}`);
  }
}

for (const gradient of avatarGradients) {
  const documented = markdownValues("avatar-gradients", gradient.name, ["top", "bottom"]);
  const name = tokenKey(gradient.name);

  for (const edge of ["top", "bottom"]) {
    const expected = normalizeColor(gradient[edge]);
    const fromMarkdown = normalizeColor(documented[edge] ?? "");
    const fromCss = resolveColor(`--avatar-${name}-${edge}`, lightDeclarations);

    if (fromMarkdown !== expected) {
      report(
        `colors.md avatar-gradients.${name}.${edge} is ${fromMarkdown || "missing"}; expected ${expected}`,
      );
    }

    if (fromCss !== expected) {
      report(
        `colors.css --avatar-${name}-${edge} is ${fromCss || "missing"}; expected ${expected}`,
      );
    }
  }
}

const productSemanticDeclaration =
  /--(?:action|control|fill|glass|heatmap|material|press|separator|story|text|toast)[a-z0-9-]*\s*:/;

if (productSemanticDeclaration.test(css)) {
  report(
    "colors.css contains a product semantic token; keep product roles in Mini App",
  );
}

if (errors.length) {
  console.error("Color token check failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("Color tokens are in sync.");
}
