# TMA

A reusable React component library with a Vite Storybook for components,
animations and full prototype flows. Telegram Mini Apps support is optional;
the same components are safe to render in a regular browser.

## Stack

- **Vite 7** SPA, **React 19** with the **React Compiler** (auto-memoization)
- **wouter** routing in hash mode (`useHashLocation`) for the standalone
  Storybook
- **Tailwind CSS 4** with the first-party Vite plugin
- Semantic Tailwind utilities generated directly from `@deslop/primitives`
- **motion v12** (framer-motion-compatible), **calligraph** and
  **markdown-to-jsx**
- Optional Telegram Web App integration via the internal `@lib/twa` wrapper
- Type checking via **PropTypes**
- Package manager: **Yarn 4** (`yarn@4.5.3`)

## Quick start

```bash
# Install dependencies from this directory. The canonical
# @deslop/primitives package lives one level up in ../primitives.
yarn install
yarn dev        # http://localhost:3000
```

Node 20+ is required (Vite 7).

## Environment

The build's base path is set by `base: './'` in `vite.config.js`, which emits
relative asset URLs so the Storybook works from any static sub-path or embedded
WebView. Change it there if you deploy under a fixed prefix.

The repository ships an `.env` with `PUBLIC_URL=.` — a leftover from the old
Create React App setup. Vite does not read it, so it currently has no effect;
configure the base path through `vite.config.js` instead.

## Scripts

| Command                 | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| `yarn dev`              | Vite dev server on port 3000 (entry: `src/index.js`)          |
| `yarn build`            | Build the showcase into `build/` and the library into `dist/` |
| `yarn build:storybook`  | Build only the component showcase into `build/`               |
| `yarn build:lib`        | Build only the reusable `@deslop/tma` package into `dist/`    |
| `yarn preview`          | Preview the production build locally                          |
| `yarn lint`             | Check styling architecture and lint JS + CSS                  |
| `yarn check:styles`     | Prevent Sass and new CSS Modules; validate Tailwind setup     |
| `yarn lint:js`          | ESLint only                                                   |
| `yarn lint:css`         | Stylelint only                                                |
| `yarn format`           | Prettier write over `src/`                                    |
| `yarn screenshot:story` | Render story screenshots (`scripts/screenshot-story.js`)      |

## Project layout

- `src/components/<Name>/` — `index.js` (default export) + optional
  `*.showcase.js`. Old components can still contain a compatibility
  `<Name>.module.css`, but new CSS Modules are rejected by verification.
- `storybook/config.js` — single config that drives both routing and the
  catalog; adding a page = a component plus one entry here
- `src/pages/prototypes/` — full app prototypes (Wallet, Onboarding,
  Trading, Navigation…)
- `src/pages/showcases/` — optional Telegram SDK integration demos
  (NavigationBar, BottomBar, HapticFeedback)
- `storybook/components/CatalogPage/` — auto-generated catalog from `storybook/config.js`
- `storybook/router/` — config-driven routing with lazy loading
- `src/library.js` — public exports for the `@deslop/tma` package
- `src/hooks/` — `DeviceProvider` (platform) and `AppearanceProvider` (theme)
- `src/lib/twa/` — wrapper around the Telegram WebApp SDK
- `src/icons/`, `src/images/`, `src/utils/`

## Primitives

Colors, typography, fonts and icons come from the single canonical package at
`../primitives`. TMA does not keep a second copy. The Storybook resolves
that package directly, so local Primitives changes are reflected without copying
files.

## Styling

`src/styles/tailwind.css` is the only Tailwind theme entry point. It maps the
Primitives tokens to semantic utilities, so light and dark themes switch through
the same class names:

```jsx
<section className="rounded-section bg-surface p-content text-foreground">
    <button className="rounded-button bg-action-primary px-20 py-12 text-on-action">
        Continue
    </button>
</section>
```

Use `cn` from `@utils/cn` for conditional class names. Prefer semantic classes
such as `bg-background`, `bg-surface`, `text-foreground`, `text-muted`,
`bg-action-primary`, spacing classes like `gap-12`, and component radii like
`rounded-button`. Avatar gradients are available as `bg-avatar-red`,
`bg-avatar-orange`, and the other named variants. Do not use Tailwind's generic
color palette or hard-code a token value in a component.

The migration keeps a fixed list of legacy `*.module.css` files only to preserve
the current component visuals. Do not create new modules; when touching a legacy
component, move the affected styles into Tailwind utilities and delete the module
once it is empty. The allowlist lives in `scripts/legacy-css-modules.txt`, and
`yarn check:styles` enforces this boundary.

## Library usage

```jsx
import { Cell, RegularButton, TMAProvider } from "@deslop/tma"
import "@deslop/tma/styles.css"

export function App() {
    return (
        <TMAProvider>
            <Cell>Account</Cell>
            <RegularButton label="Continue" />
        </TMAProvider>
    )
}
```

Consumers do not need to install or configure Tailwind. The published
`@deslop/tma/styles.css` already contains the generated utilities and Primitives
styles required by the components.

`Text` accepts direct `variant`, `weight`, `caps`, `chevron` and `arrow` props;
the old `apple`/`material` Text API is not supported. Some legacy components
still contain internal Apple/Material branches behind `DeviceProvider`. They are
compatibility code rather than a public styling choice and should disappear as
those components move to Tailwind.

## Telegram integration

Telegram-specific adapters live in `src/lib/twa/` and gracefully fall back to
browser-safe no-op implementations. A Telegram Mini App should provide the
official `Telegram.WebApp` global in its host application; the TMA package and
Storybook do not load the Telegram SDK.

## Build configuration

- Code splitting into `react`, `react-vendors`, `vendors` and app chunks
- SVG imported as React components via `?react` (`vite-plugin-svgr`):
    ```js
    import Icon from "./icon.svg?react"
    ```
- `babel.config.js` enables the React Compiler and strips PropTypes in
  production
- Bundle stats reported to RelativeCI in CI

## Conventions

See `AGENTS.md` for the small set of rules that complements the repository-wide
agent instructions.

## Verification

Run the complete repository check from the repository root:

```bash
npm run verify
```

It validates Primitives tokens and icons, the Tailwind architecture, JavaScript
and CSS, then builds both the Storybook and the reusable library.

## License

Released under the [MIT License](LICENSE).
