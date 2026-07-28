import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const primitives = resolve(root, "primitives");
const miniApp = resolve(root, "mini-app");
const designSystem = resolve(root, "design-system");

const commands = [
  {
    label: "Primitives: tokens",
    cwd: primitives,
    args: ["./scripts/generate-layout-tokens.mjs", "--check"],
  },
  {
    label: "Primitives: colors",
    cwd: primitives,
    args: ["./scripts/check-color-tokens.mjs"],
  },
  {
    label: "Primitives: typography",
    cwd: primitives,
    args: ["./scripts/check-typography-tokens.mjs"],
  },
  {
    label: "Primitives: legacy SVG compatibility",
    cwd: primitives,
    args: ["./scripts/check-icons.mjs"],
  },
  {
    label: "Primitives: Material Symbols React API",
    cwd: primitives,
    args: ["./scripts/generate-react-icons.mjs", "--check"],
  },
  {
    label: "Primitives: consumer package",
    cwd: primitives,
    args: ["./scripts/check-package.mjs"],
  },
  {
    label: "Design System: CLI and adoption tests",
    cwd: designSystem,
    args: ["--test"],
  },
  {
    label: "Mini App: styling architecture",
    cwd: miniApp,
    args: ["./scripts/check-styling.mjs"],
  },
  {
    label: "Mini App: agent catalog",
    cwd: miniApp,
    args: ["./scripts/check-agent-kit.mjs"],
  },
  {
    label: "Mini App: JavaScript lint",
    cwd: miniApp,
    args: [
      "./node_modules/eslint/bin/eslint.js",
      "{src,storybook}/**/*.{js,jsx,ts,tsx}",
      "scripts/check-agent-kit.mjs",
    ],
  },
  {
    label: "Mini App: CSS lint",
    cwd: miniApp,
    args: [
      "./node_modules/stylelint/bin/stylelint.mjs",
      "{src,storybook}/**/*.css",
    ],
  },
  {
    label: "Mini App: Storybook build",
    cwd: miniApp,
    args: ["./node_modules/vite/bin/vite.js", "build"],
  },
  {
    label: "Mini App: library build",
    cwd: miniApp,
    args: ["./scripts/build-library.mjs"],
  },
  {
    label: "Mini App: consumer package contract",
    cwd: miniApp,
    args: ["./scripts/check-package.mjs"],
  },
  {
    label: "Mini App: stable library rebuild",
    cwd: miniApp,
    args: ["./scripts/check-stable-build.mjs"],
  },
  {
    label: "Consumer fixture: packed React 18 install",
    cwd: root,
    args: ["./scripts/verify-consumer-artifact.mjs"],
  },
];

const requiredMiniAppFiles = commands.flatMap(({ cwd, args }) =>
  cwd === miniApp && args[0].startsWith("./node_modules/")
    ? [resolve(miniApp, args[0])]
    : [],
);

const missingDependency = requiredMiniAppFiles.find(
  (file) => !existsSync(file),
);

if (missingDependency) {
  console.error("Mini App dependencies are not installed. Run:");
  console.error("  corepack yarn --cwd mini-app install --immutable");
  process.exit(1);
}

function run({ label, cwd, args }) {
  return new Promise((resolvePromise, reject) => {
    console.log(`\n→ ${label}`);

    const child = spawn(process.execPath, args, {
      cwd,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolvePromise();
        return;
      }

      reject(
        new Error(
          `${label} failed${signal ? ` (${signal})` : ` with exit code ${code}`}`,
        ),
      );
    });
  });
}

try {
  for (const command of commands) {
    await run(command);
  }

  console.log("\n✓ Verification passed");
} catch (error) {
  console.error(`\n✗ ${error.message}`);
  process.exit(1);
}
