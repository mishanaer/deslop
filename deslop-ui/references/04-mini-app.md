# Mini App integration

Use this reference only for Telegram Mini App tasks.

## Contents

- Sources of truth
- Consumer boundary
- Composition order
- Effect budget
- Missing capabilities
- Mini App review

## Sources of truth

- In a consumer project, read `.deslop/mini-app/COMPONENTS.md` before JSX.
- In this repository, read `mini-app/agent/COMPONENTS.md`.
- Use `mini-app/agent/components.json` for machine-readable inventory.
- Read relevant source under `.deslop/mini-app/source` in a consumer or
  `mini-app/src/components` in this repository.
- Obey the nearest Mini App `AGENTS.md`.

The live catalog owns component availability. Do not maintain a second complete
inventory in this reference.

## Consumer boundary

Prefer the unified installer:

```bash
npx @deslop/design-system setup --mini-app
```

Use `npx @deslop/mini-app setup` when the product intentionally installs only
Mini App. Either path generates the same local gateway:

```jsx
import "@deslop/mini-app/styles.css"
import { Page, RegularButton, MiniAppProvider } from "./components/mini-app/index.js"
```

Import the stylesheet once in the root entry and wrap the application in
`MiniAppProvider`. Adjust only the relative path to `src/components/mini-app/index.js`.
Do not import product components directly from `@deslop/mini-app`, and never import
working code from `.deslop/mini-app/source`.

Inside this library repository, use public exports and the existing
`mini-app/src/components` implementation boundary defined by
`mini-app/AGENTS.md`.

## Build outward from the page

Choose in this order:

1. Page and safe-area behavior.
2. App bar, panel header, tabs, or bottom navigation.
3. Sections, lists, cells, or the dominant object.
4. Inputs and primary actions.
5. Overlay and feedback behavior.
6. Optional motion or atmospheric treatment.

Prefer Mini App-native structures:

- shell: `Page`, `AppBar`, `TabBar`, `SplitView`;
- repeated content: `Cell`, `SectionList`;
- actions and input: `RegularButton`, `TextField`, `SegmentedControl`;
- overlays and feedback: `ModalView`, `Snackbar`;
- asynchronous states: `PageSkeleton`, `ErrorBoundary`;
- content: `Text`, `Markdown`, `Table`, `Gallery`, `ImageAvatar`.

These are representative choices, not an inventory. Use the live catalog for
the full set and verify exact exports before using them.

## Mini App composition

- Prefer one-handed, vertically legible flows to compressed desktop grids.
- Keep the primary action reachable without covering important content.
- Use `Cells` and `SectionList` for repeated settings and objects instead of a
  grid of web-shaped cards.
- Pair `TextField` with a persistent visible label using the available text or
  section composition. A placeholder or `aria-label` alone is not a visible
  field label.
- Use `ModalView` for contextual tasks that should preserve the screen beneath.
- Use `SplitView` only when the device and information genuinely support
  simultaneous regions.
- Treat Telegram header, viewport, safe areas, theme, and back behavior as part
  of the composition.
- Inside this library repository, route Telegram behavior through `@lib/twa`
  and preserve ordinary-browser fallback.
- In a copied consumer, use the product's existing Telegram adapter or an
  adapter exposed through the local kit gateway. `@lib/twa` is not a consumer
  package export. If no adapter is available, report a missing kit capability
  and block implementation until the user authorizes an extension.

## Effect budget

Atmospheric components require a product reason:

- `GradientBackground`;
- glass containers or borders;
- `Morph`;
- `ParticleEffect`;
- `StreamingText`;
- animated transitions.

Choose at most one family as the screen's signature. Do not combine gradient,
glass, particles, giant type, and morphing merely to increase intensity.

Use:

- motion to maintain spatial continuity;
- streaming text for genuinely incremental generation;
- particles for a rare celebratory or subject-grounded moment;
- glass only where material layering and backdrop context are meaningful;
- gradient as a semantic atmosphere or data/media-derived treatment.

Provide a reduced-motion or static outcome. The interface must remain complete
without the effect. An effect API accepting raw colors does not authorize them:
pass validated Deslop Primitive values through the existing token pattern.

## Missing capabilities

In a copied consumer kit:

1. Re-check `.deslop/mini-app/COMPONENTS.md`.
2. Do not create a local component with the same role as a Mini App component.
3. Report the missing reusable capability.
4. Extend the kit only when the user explicitly authorizes that scope.

In this library repository, add reusable behavior to `mini-app/src/components`,
export it publicly, document it in the agent catalog, add states/showcase, and
run the full verification.

## Mini App review

Inspect at least:

- 320, 375, and 414 px widths;
- light and dark appearances when supported;
- safe-area and keyboard behavior;
- ordinary-browser fallback;
- long Russian labels and dynamic content;
- loading, empty, error, and recovery;
- touch targets and pressed state;
- reduced motion.

Run the repository `npm run verify`, or `npm run check:mini-app` in a consumer.
