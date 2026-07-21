import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import {
  accentColors,
  avatarGradients,
  elevationColors,
  semanticColors,
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
    [...block.matchAll(/^\s*(--ui-[a-z0-9-]+):\s*([^;]+);$/gm)].map(
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

  const reference = value.match(/^var\((--ui-[a-z0-9-]+)\)$/);
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
    cssToken: `--ui-accent-${tokenKey(color.name)}`,
    source: color,
    properties: ["light", "dark"],
  });
}

for (const color of elevationColors) {
  checkPair({
    section: "elevation-colors",
    cssToken: `--ui-elevation-${tokenKey(color.name).replace(/^elevation-/, "")}`,
    source: color,
    properties: ["light", "dark"],
  });
}

const semanticCssTokens = {
  "Action Primary Background": "--ui-action-primary-background",
  "Action Primary Foreground": "--ui-action-primary-foreground",
  Background: "--ui-background",
  Surface: "--ui-surface",
  "Bottom Bar": "--ui-surface-bottom-bar",
  "Text Primary": "--ui-text-primary",
  "Text Secondary": "--ui-text-secondary",
  "Section Text": "--ui-text-section",
  Separator: "--ui-separator",
  "Control Active": "--ui-control-active",
  "Control Disabled": "--ui-control-disabled",
  "Text Disabled": "--ui-text-disabled",
};

const semanticDocumentationNames = {
  "Bottom Bar": "surface-bottom-bar",
  "Section Text": "text-section",
};

for (const color of semanticColors) {
  checkPair({
    section: "semantic-colors",
    cssToken: semanticCssTokens[color.name],
    documentationName: semanticDocumentationNames[color.name],
    source: color,
    properties: ["light", "dark"],
  });
}

for (const gradient of avatarGradients) {
  const documented = markdownValues("avatar-gradients", gradient.name, ["top", "bottom"]);
  const name = tokenKey(gradient.name);

  for (const edge of ["top", "bottom"]) {
    const expected = normalizeColor(gradient[edge]);
    const fromMarkdown = normalizeColor(documented[edge] ?? "");
    const fromCss = resolveColor(`--ui-avatar-${name}-${edge}`, lightDeclarations);

    if (fromMarkdown !== expected) {
      report(
        `colors.md avatar-gradients.${name}.${edge} is ${fromMarkdown || "missing"}; expected ${expected}`,
      );
    }

    if (fromCss !== expected) {
      report(
        `colors.css --ui-avatar-${name}-${edge} is ${fromCss || "missing"}; expected ${expected}`,
      );
    }
  }
}

if (errors.length) {
  console.error("Color token check failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("Color tokens are in sync.");
}
