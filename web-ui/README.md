# Web UI

A reusable web component library with a Vite Storybook for components,
animations and full prototype flows. Telegram Mini Apps are supported through
an optional integration layer rather than defining the whole library.

## Stack

- **Vite 7** SPA, **React 19** with the **React Compiler** (auto-memoization)
- **wouter** routing in hash mode (`useHashLocation`) for the standalone
  Storybook
- **SCSS Modules** (`<Name>.module.scss`)
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
| `yarn build:lib`        | Build only the reusable `@deslop/web-ui` package into `dist/` |
| `yarn preview`          | Preview the production build locally                          |
| `yarn lint`             | Lint JS + SCSS — run before declaring a task done             |
| `yarn lint:js`          | ESLint only                                                   |
| `yarn lint:scss`        | Stylelint only                                                |
| `yarn format`           | Prettier write over `src/`                                    |
| `yarn screenshot:story` | Render story screenshots (`scripts/screenshot-story.js`)      |

## Project layout

- `src/components/<Name>/` — `index.js` (default export) +
  `<Name>.module.scss` + optional `*.showcase.js`
- `storybook/config.js` — single config that drives both routing and the
  catalog; adding a page = a component plus one entry here
- `src/pages/prototypes/` — full app prototypes (Wallet, Onboarding,
  Trading, Navigation…)
- `src/pages/showcases/` — optional Telegram SDK integration demos
  (NavigationBar, BottomBar, HapticFeedback)
- `storybook/components/CatalogPage/` — auto-generated catalog from `storybook/config.js`
- `storybook/router/` — config-driven routing with lazy loading
- `src/library.js` — public exports for the `@deslop/web-ui` package
- `src/hooks/` — `DeviceProvider` (platform) and `AppearanceProvider` (theme)
- `src/lib/twa/` — wrapper around the Telegram WebApp SDK
- `src/icons/`, `src/images/`, `src/utils/`

## Primitives

Colors, typography, fonts and icons come from the single canonical package at
`../primitives`. Web UI does not keep a second copy. The Storybook resolves
that package directly, so local Primitives changes are reflected without copying
files.

## Library usage

```jsx
import { Cell, RegularButton, WebUIProvider } from "@deslop/web-ui"
import "@deslop/web-ui/styles.css"

export function App() {
    return (
        <WebUIProvider>
            <Cell>Account</Cell>
            <RegularButton label="Continue" />
        </WebUIProvider>
    )
}
```

The visual system is unified and Apple-based. `Text` accepts direct
`variant`, `weight`, `caps`, `chevron` and `arrow` props; the old
`apple`/`material` API is not supported.

## Telegram integration

Telegram-specific adapters live in `src/lib/twa/` and gracefully fall back to
browser-safe no-op implementations. A Telegram Mini App should provide the
official `Telegram.WebApp` global in its host application; the general Web UI
package and Storybook do not load the Telegram SDK.

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

See `AGENTS.md` for the full contributor rules — file size limits, animation
performance tiers, the SCSS-Modules-only policy, and project primitives to
reuse (`Button`, `Text`, `GlassContainer`, `Page`, `PageTransition`).

## License

Released under the [MIT License](LICENSE).
