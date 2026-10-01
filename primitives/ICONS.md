# SVG icons

760 icons, each supplied in four variants (3040 SVG files):
`round/line`, `round/solid`, `sharp/line`, and `sharp/solid`.
The SVG export supplied for this contribution is preserved in `icons/`.
Names match the SVG filenames, including names such as `battery-100%`.

```jsx
import { Icon, IconHeart, iconNames, getIconComponent } from "./primitives/icons-react";

<Icon name="heart" />
<IconHeart size={32} shape="sharp" variant="solid" title="Favorite" />
<Icon name="logo-openai" size="1em" />
```

- `size`: number (pixels) or CSS length; defaults to 24.
- `shape`: `round` (default) or `sharp`.
- `variant`: `line` (default) or `solid`.
- `fill={true}` / `fill={1}` selects solid when `variant` is omitted.
- Color inherits `currentColor`; SVG props, styles and refs are forwarded.
- Icons are decorative by default. Use `title`, `aria-label`, or
  `aria-labelledby` for a meaningful standalone icon.
- `iconNames`, `iconComponents`, and `getIconComponent(name)` expose the full
  canonical catalog. Unknown names return no component / render nothing.

Import `icons.css` for inline alignment. Rendering does not require a font or
an external request. Clipping IDs are scoped per instance, so multiple icons
can share a page safely.

## Existing imports

`material-symbols-react` remains as a compatibility entry point. Its 113
Material Symbol names and all existing named exports render replacements from
the SVG set, using the explicit mapping in `material-symbols.json`.
`materialSymbolNames` and `materialSymbolComponents` retain the old names;
`iconNames` and `iconComponents` expose the full new catalog.

The rendered element is now `SVGSVGElement`, replacing `HTMLSpanElement`.
Update explicitly typed span refs and selectors that target icon spans.
`weight`, `grade`, and `opticalSize` are accepted for migration but have no
visual effect: the supplied SVG geometry is fixed. The legacy CSS entry point
`material-symbols.css` imports `icons.css`.

## Regeneration and verification

```sh
node primitives/scripts/generate-react-icons.mjs
node primitives/scripts/generate-react-icons.mjs --check
cd mini-app/storybook
corepack yarn check:icons
corepack yarn verify
```

The generator validates that all four variants have identical filename sets,
parses only the supplied SVG element/attribute vocabulary, and checks every
legacy replacement. Generated data, React exports and TypeScript declarations
must be committed together with the source SVG files.
