import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const primitives = resolve(root, 'primitives');
const tma = resolve(root, 'tma');

const commands = [
  {
    label: 'Primitives: tokens',
    cwd: primitives,
    args: ['./scripts/generate-layout-tokens.mjs', '--check'],
  },
  {
    label: 'Primitives: colors',
    cwd: primitives,
    args: ['./scripts/check-color-tokens.mjs'],
  },
  {
    label: 'Primitives: typography',
    cwd: primitives,
    args: ['./scripts/check-typography-tokens.mjs'],
  },
  {
    label: 'Primitives: icons',
    cwd: primitives,
    args: ['./scripts/check-icons.mjs'],
  },
  {
    label: 'TMA: JavaScript lint',
    cwd: tma,
    args: [
      './node_modules/eslint/bin/eslint.js',
      '{src,storybook}/**/*.{js,jsx,ts,tsx}',
    ],
  },
  {
    label: 'TMA: SCSS lint',
    cwd: tma,
    args: [
      './node_modules/stylelint/bin/stylelint.mjs',
      '{src,storybook}/**/*.scss',
    ],
  },
  {
    label: 'TMA: Storybook build',
    cwd: tma,
    args: ['./node_modules/vite/bin/vite.js', 'build'],
  },
  {
    label: 'TMA: library build',
    cwd: tma,
    args: ['./node_modules/vite/bin/vite.js', 'build', '--config', 'vite.lib.config.js'],
  },
];

const requiredTmaFiles = commands
  .slice(4)
  .map(({ args }) => resolve(tma, args[0]));

const missingDependency = requiredTmaFiles.find((file) => !existsSync(file));

if (missingDependency) {
  console.error('TMA dependencies are not installed. Run:');
  console.error('  corepack yarn --cwd tma install --immutable');
  process.exit(1);
}

function run({ label, cwd, args }) {
  return new Promise((resolvePromise, reject) => {
    console.log(`\n→ ${label}`);

    const child = spawn(process.execPath, args, {
      cwd,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code, signal) => {
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

  console.log('\n✓ Verification passed');
} catch (error) {
  console.error(`\n✗ ${error.message}`);
  process.exit(1);
}
