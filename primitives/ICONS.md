# SVG icons

779 icons (3059 SVG files): 760 supplied in all four variants —
`round/line`, `round/solid`, `sharp/line`, and `sharp/solid` — plus 19 editor
icons supplied in `round/line`.
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
- Icons listed in `icons/round-line-only.json` use their approved `round/line`
  artwork for every shape/variant choice until other drawings are supplied.
- `fill={true}` / `fill={1}` selects solid when `variant` is omitted.
- Color inherits `currentColor`; SVG props, styles and refs are forwarded.
- Icons are decorative by default. Use `title`, `aria-label`, or
  `aria-labelledby` for a meaningful standalone icon.
- `iconNames`, `iconComponents`, and `getIconComponent(name)` expose the full
  canonical catalog. Unknown names return no component / render nothing.

Import `icons.css` for inline alignment. Rendering does not require a font or
an external request. Clipping and mask IDs are scoped per instance, so multiple icons
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

The generator validates the four filename sets, with explicit exceptions in
`icons/round-line-only.json`,
parses only the supplied SVG element/attribute vocabulary, and checks every
legacy replacement. Generated data, React exports and TypeScript declarations
must be committed together with the source SVG files.

## Editor additions

These 19 icons were drawn for [Memo](https://github.com/DISRUPT-BUILDERS/Memo)
and contributed to the main Deslop catalog. They use a 24 × 24 canvas and the
rounded 2 px line style. The heading and numbered-list glyphs adapt Telegram
editor artwork; the table and media glyphs preserve the reviewed
Memo silhouettes. See [Memo source notes](https://github.com/DISRUPT-BUILDERS/Memo/blob/1866096a8008fa4d1446454dcacf0f23e5937ad7/Resources/MemoFormattingIcons.md).
The contributed list numerals include the subsequent 30% size increase.

| Names | Meaning |
| --- | --- |
| `text-h`, `text-h1`–`text-h6` | Heading and heading levels |
| `list-numbered` | Numbered list |
| `cell-highlight`, `cell-highlight-remove` | Highlight a cell or remove its highlight |
| `cell-add-left`, `cell-add-right` | Insert a column |
| `cell-add-top`, `cell-add-bottom` | Insert a row |
| `cell-merge`, `cell-split` | Merge or split cells |
| `media-grid`, `media-carousel` | Media layouts |
| `space` | Space key |

All names are available through `Icon`, `getIconComponent` and named React
exports, such as `IconListNumbered` and `IconTextH1`. Only the supplied
`round/line` geometry is included; the fallback does not create new solid or
sharp artwork. The remove-highlight icon keeps its transparent 2 px slash
clearance on any background.
