---
name: deslop-design-system
description: Apply the Deslop web design system to web interfaces. Use when building or refactoring a web UI in a repository that contains Deslop Primitives or its installed package; select shared colors, typography, spacing, radii, icons, and Web UI components and verify light and dark themes.
---

# Deslop web design system

Use the shared design system as the only source for visual decisions. Keep base assets in `primitives`; use `@deslop/web-ui` for ready React components when that package is available.

## Locate the kit

1. Find `primitives/README.md` in the repository. In this repository, use `../../primitives` relative to this skill.
2. Read `primitives/README.md` and only the source relevant to the task:
   - `colors.md` and `colors.css` for colour work;
   - `TYPOGRAPHY.md` and `typography.css` for text;
   - `layout.json` for spacing and radius;
   - `icons/` for icons.
3. Check whether the product already imports `@deslop/primitives/colors.css`, `layout.css`, and `typography.css`. Add missing imports at the app entry point instead of importing them in individual components.
4. If the kit or a required token is unavailable, report the gap. Do not recreate a parallel design system or introduce a raw substitute token.

## Apply tokens

- Use semantic colour tokens first: `--ui-background`, `--ui-surface`, `--ui-text-primary`, `--ui-text-secondary`, `--ui-separator`.
- Use `--ui-action-primary-background` and `--ui-action-primary-foreground` for the primary action. Do not hard-code green or black inside a component.
- Use `--ui-font-interface` for interface text. Use `--ui-font-interface-caps` only with the Caption style.
- Use `--ui-space-*`, `--ui-layout-*`, `--ui-radius-*`, and `--ui-component-*-radius` instead of ad hoc pixel values.
- Use the title, body, subtitle, and caption values exposed by `typography.css`. Keep the font size, line height, weight, and letter spacing together.
- Use a named SVG from `primitives/icons/`. Keep its displayed size at 24 × 24 unless the component explicitly documents another size.

## Build or change a component

1. Prefer an existing `@deslop/web-ui` component over a duplicate implementation.
2. If a component must be new, compose it from Primitives tokens only. Keep product-specific layout and behaviour outside the design system.
3. Use `data-color-scheme="light"` or `data-color-scheme="dark"` only to explicitly control the theme. Otherwise retain the operating-system preference.
4. Check both themes. Confirm that text, surfaces, separators, active controls, and icons remain readable.
5. Do not assume a source SVG follows `currentColor`: inspect the file or the rendered result before relying on CSS recolouring.

## Change the design system deliberately

- Change colours in `primitives/colors.md`, `primitives/colors.css`, and `primitives/tokens.js` together.
- Change spacing or radii in `primitives/layout.json`, then run `npm run tokens:generate` from `primitives`.
- Change typography in `primitives/TYPOGRAPHY.md`, `primitives/typography.css`, and `primitives/tokens.js` together.
- Add SVG icons only in kebab-case and at 24 × 24.
- Preserve the package as private until a maintainer selects a distribution method and confirms font redistribution rights.

## Verify

Run these checks from `primitives` after changing the base layer:

```bash
npm run check
```

Then run the consuming product's lint and build commands. For visual changes, open the affected view in both themes and compare the result with the required component state.
