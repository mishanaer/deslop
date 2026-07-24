# Web UI integration

Use this reference only for Web UI tasks.

## Contents

- Sources of truth
- Consumer boundary
- Selection by product role and behavior
- Blocks and primitive discipline
- Product composition
- Missing capabilities
- Web review

## Sources of truth

In this repository:

- Agent catalog: `web-ui/agent/COMPONENTS.md`
- Machine-readable modules: `web-ui/agent/components.json`
- Inventory and categories: `web-ui/src/storybook/catalog.ts`
- Component behavior: `web-ui/src/components/ui`
- Example compositions: `web-ui/src/components/blocks`
- Charts: `web-ui/src/components/charts`
- Semantic roles and primitive bridge: `web-ui/src/index.css`
- Icon bridge: `web-ui/src/lib/icons.tsx`
- Repository constraints: `web-ui/AGENTS.md`

In a consumer project:

- read `.deslop/web-ui/COMPONENTS.md` before JSX;
- use `.deslop/web-ui/components.json` for the installed machine inventory;
- inspect the local `src/components/web-ui` gateway;
- read relevant implementation under `.deslop/web-ui/source`;
- obey the nearest `AGENTS.md`.

Do not assume the source repository and consumer inventories match. This
reference maps intent; it does not duplicate component APIs.

## Consumer boundary

Prefer the unified installer:

```bash
npx @deslop/design-system setup --web
```

Use `npx @deslop/web-ui setup` when the product intentionally installs only
Web UI. Either path generates the same local product boundary. Import product
controls through that gateway:

```tsx
import "@deslop/web-ui/styles.css"
import {
  Button,
  ChartAreaInteractive,
  DashboardBlock,
} from "./components/web-ui"
```

Import the stylesheet once at the product entry boundary. Do not import product
controls directly from `@deslop/web-ui`, reach into package internals, or import
working code from `.deslop/web-ui/source`. The source copy is evidence only;
`src/components/web-ui` is the product boundary.

## Select by product role

| Role | Components |
|---|---|
| Application shell | `Sidebar`, `Breadcrumb`, `Tabs` |
| Working layout | `ResizablePanelGroup`, `ScrollArea`, `Separator` |
| Primary actions | `Button`, `ButtonGroup` |
| Forms | `Field`, `Input`, `Select`, `Combobox` |
| Dense data | `Table`, `ChartContainer`, `Item`, `Badge` |
| Status and feedback | `Alert`, `Skeleton`, `Empty`, `Toaster` |
| Bounded or contextual tasks | `Dialog`, `AlertDialog`, `Sheet`, `Popover` |
| Menus and commands | `Command`, `DropdownMenu` |
| Messaging | `Message`, `Attachment` |
| Media and browsing | `Carousel`, `Avatar` |

These are representative choices, not an inventory. Use the live catalog for
the full set, then verify exact names and exports in source.

Catalog titles are families, not guaranteed export names. In particular, the
current public exports use `ChartContainer` for the `chart` family,
`ResizablePanelGroup`/`ResizablePanel`/`ResizableHandle` for `resizable`, and
`Toaster` for `sonner`. Read the source before synthesizing an import.

The current `ChartArea*` compositions contain demonstration data. For real
product data, use `ChartContainer` with a supported Recharts composition and
declare the data dependency explicitly; never ship catalog demo metrics as
product evidence.

## Behavioral selection

- Use `AlertDialog` for destructive or consequential confirmation.
- Use `Dialog` for a bounded task that does not require page context.
- Use `Sheet` for contextual detail that should preserve the underlying
  collection, especially on narrow screens.
- Use `Drawer` when the interaction is naturally bottom-anchored or mobile
  progressive disclosure.
- Use `Popover` for small contextual controls; do not place long workflows in it.
- Use `Tooltip` only for supplementary information.
- Use `Command` for expert navigation or action search, not as decorative input.
- Use `Table` when aligned comparison matters. Use `Item` or lists when it does
  not.
- Use `Empty` for a true empty or no-result state, not as general page layout.
- Use `Skeleton` when geometry is known; use `Spinner` for a bounded operation.

## Blocks are scaffolds

`DashboardBlock`, `SidebarBlock`, `LoginBlock`, and `SignupBlock` are working
examples. Reuse one only when its information architecture matches the brief.

Do not:

- assume every dashboard needs sidebar + KPI cards + area chart + table;
- reskin a block and call it a redesign;
- copy demo data into product code;
- preserve a block's hierarchy when the real user job differs.

Compose directly from UI components when the screen needs a different
fingerprint. Add a new reusable block only after the composition proves useful
across more than one concrete surface.

## Primitive discipline

Use semantic classes bridged in `web-ui/src/index.css`:

- surfaces: `background`, `card`, `popover`, `muted`, `accent`;
- text: `foreground`, `muted-foreground`;
- actions: `primary`, `secondary`, `destructive`;
- structure: `border`, `input`, `ring`;
- data: `chart-1` through `chart-5`;
- typography, spacing, and radii exposed by the Deslop bridge.

Do not add:

- Tailwind palette colors;
- arbitrary visual values;
- opacity modifiers on semantic color classes;
- locally derived colors;
- `lucide-react`;
- local SVG controls;
- a new font, icon, spacing, radius, or color hidden in product code.

Current primary action and public type roles may be intentionally constrained.
Do not bypass those constraints to satisfy an aesthetic idea. Propose or
implement a Primitives extension only when the task authorizes design-system
work.

## Product compositions

Keep page- or feature-specific composition in product code or `blocks/`.
Keep reusable control behavior and accessibility inside `components/ui`.
Keep raw visual values and icon assets inside Primitives.

Ask in this order:

1. Can hierarchy, order, grouping, density, or whitespace solve the problem?
2. Does an existing component already provide the behavior?
3. Is the missing element a reusable behavior or only this page's composition?
4. Is a new primitive genuinely required?

## Missing capabilities

In a copied consumer kit:

1. Re-check `.deslop/web-ui/COMPONENTS.md` and the local gateway.
2. Do not create a local control with the same role as a Web UI module.
3. Report the missing reusable capability.
4. Extend the kit only when the user explicitly authorizes that scope.

In this library repository, add reusable behavior to `web-ui/src/components`,
export it publicly, update the agent catalog, add states or stories, and run the
full verification.

## Web review

Inspect at least:

- 320 or 360 px narrow viewport;
- 768 px intermediate viewport;
- 1440 px desktop viewport;
- light and dark themes when both are supported;
- keyboard focus;
- long labels, Russian copy, large numbers, missing media, and empty data.

Run `pnpm verify` from `web-ui` for repository changes, or
`npm run check:web-ui` in a consumer.
