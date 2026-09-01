# Mini App UI Kit

The original set of React components for Telegram Mini Apps. It is not
published as an npm package: the `mini-app` and `primitives` directories are
copied into a project side by side. Adapted from Ilya Grishin's library.

```text
project/
├── primitives/
└── mini-app/
```

## Usage

Import the required styles once:

```js
import "./mini-app/styles/index.css"
```

Wrap the application in the provider and import components directly from the
source files:

```jsx
import MiniAppProvider from "./mini-app/MiniAppProvider"
import { RegularButton } from "./mini-app/components/Button"

export default function App() {
    return (
        <MiniAppProvider>
            <RegularButton variant="filled" label="Continue" />
        </MiniAppProvider>
    )
}
```

Import `styles/app-shell.css` separately and only when the Mini App occupies
the entire page: it defines `body` and safe-area styles. This file is not needed
when embedding the UI kit into an existing interface.

Complex components are retained, so the host React project needs their runtime
dependencies: `prop-types`, `motion`, `@lisse/core`, `@lisse/react`,
`@tanstack/react-virtual`, `calligraph`, `clsx`, `colorthief`,
`markdown-to-jsx`, and `wouter`.

## Storybook

Storybook is included in `mini-app/storybook` and is copied with the UI kit. Its
`package.json` is needed only to run Storybook: it installs Storybook itself,
verification tools, and the runtime dependencies required by the examples. The
working UI kit remains regular source code without its own package or build
step.

```bash
cd mini-app/storybook
corepack yarn install --immutable
corepack yarn dev
```

- `storybook/examples/components` — component examples;
- `storybook/examples/screens` — examples of assembled screens;
- `storybook/examples/primitives` — colors, typography, and Material Symbols.

## Documentation

- [Component catalog](agent/COMPONENTS.md)
- [Contribution guidelines](AGENTS.md)
