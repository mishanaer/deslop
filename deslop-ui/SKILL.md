---
name: deslop-ui
description: "Design, build, redesign, audit, or visually polish distinctive product interfaces with Deslop Primitives and the existing Web UI or Mini App component libraries. Use for new screens and flows, page composition, visual hierarchy, responsive behavior, design-system conformance, screenshot or URL reference studies, UI critique, state coverage, and anti-slop refinement. Do not use for isolated Russian microcopy-only work, generic frontend fixes without a visual consequence, standalone brand strategy, or non-interface graphic design."
---

# deslop-ui

Design the product surface, not a decorative skin. Treat Deslop tokens and
components as the visual grammar; create specificity through information
hierarchy, macrostructure, density, rhythm, content, and one justified signature.

## Contract

- Solve the user's job before styling the surface.
- Obey the nearest `AGENTS.md`, existing behavior, data contracts, routes, and
  the selected component library.
- Reuse existing controls before creating new ones. Custom composition is
  allowed; private replacements for available library controls are not. A
  genuinely missing product-local capability is an explicit, reported
  exception, never a disguised duplicate.
- Preserve real content, actions, navigation, and product capabilities unless
  the user explicitly authorizes product changes.
- Never fabricate metrics, testimonials, people, logos, integrations, or
  product capabilities.
- Use `sasha/SKILL.md` separately when Russian interface copy needs substantive
  work.
- Do not claim visual quality from code inspection alone. Render and inspect
  whenever the environment supports it.

## Select a mode

- `build`: Create a new screen or flow. Establish direction and macrostructure
  before writing UI code.
- `redesign`: Change the visual and interaction structure while preserving the
  product requirements, content intent, routes, and data behavior.
- `audit`: Return prioritized findings and exact fixes without editing.
- `polish`: Preserve information architecture and behavior; improve hierarchy,
  spacing, typography, component fit, states, responsiveness, and finish.

Infer the mode from the request. If `redesign` and `polish` are both plausible,
use `polish` unless structural change was clearly authorized.

## Inspect before designing

1. Read every applicable `AGENTS.md`.
2. Inspect the current surface, neighboring screens, routes, real content,
   interactive states, and existing conventions.
3. Read `DESIGN.md` when present. Do not create or update persistent design
   memory for a one-off change unless the user asks.
4. Detect the platform and inventory:
   - In this repository, read `web-ui/agent/COMPONENTS.md`, its machine catalog,
     and relevant sources under `web-ui/src/components` for Web UI.
   - In a Web UI consumer, read `.deslop/web-ui/COMPONENTS.md`, inspect the
     local `src/components/web-ui` gateway, and use `.deslop/web-ui/source`
     only as readable implementation evidence.
   - In this repository, read `mini-app/agent/COMPONENTS.md` for Mini App.
   - In a Mini App consumer, read `.deslop/mini-app/COMPONENTS.md`.
5. Identify the primary user job, success moment, dominant content object,
   primary action, persistent information, and applicable failure states.

Do not infer component APIs or availability from memory.

## Establish direction

For `build` and `redesign`, read `references/01-direction.md` and
`references/02-composition.md`. Create a compact direction card before coding:

- product mode: `operate`, `decide`, `explain`, `persuade`, or `explore`;
- user job and success moment;
- dominant content object and hierarchy anchor;
- visual thesis grounded in the product domain;
- structural fingerprint;
- density, variance, and motion, each with a reason;
- one signature element;
- three generic defaults to avoid.

For a broad blank-slate brief, compare three structurally different directions,
not three palettes. Select one against the user job and constraints. When the
user already supplied a clear direction, honor it instead of manufacturing
alternatives.

If the request includes a screenshot, URL, competitor, or named visual
reference, also read `references/08-reference-study.md`.

For `polish`, read `references/01-direction.md` when the current surface has no
usable direction or looks interchangeable with unrelated products. Infer a
compact direction from product facts and existing constraints; do not invent
three alternatives or authorize structural change.

## Compose with Deslop

Read only the platform reference needed:

- Web UI: `references/03-web-ui.md`
- Mini App: `references/04-mini-app.md`

Choose components by behavior and product role, not visual resemblance. Treat
complete blocks as working examples and acceleration points, not mandatory page
templates. Changing a block's copy and accent is not a redesign.

When a capability is missing:

1. Check the live catalog and source again.
2. Decide whether the need is composition, a reusable behavior, or a new token.
3. Solve composition locally with existing components and tokens.
4. Add reusable behavior to the library only when the task authorizes library
   work.
5. Add colors, icons, type roles, spacing, or radii to Primitives first; never
   hide a new primitive inside product code.
6. In a copied Web UI or Mini App consumer kit, report the missing reusable
   capability and stop. Implement a product-local exception only when the user
   explicitly authorizes divergence from the kit; name the exception and never
   duplicate behavior that the live catalog already provides.

## Implement the whole state

For implementation modes, read `references/05-states-and-responsive.md`. Also
read it when an `audit` explicitly covers interaction states, accessibility,
motion, or responsive behavior.

1. Build the macrostructure and real content hierarchy first.
2. Compose existing controls and feedback components.
3. Exercise applicable default, hover, focus, active, disabled, loading,
   partial, empty, error, success, offline, and permission states.
4. Define a responsive transformation; do not merely shrink desktop UI.
5. Keep one signature move. Remove effects that compete with it.

## Critique before handoff

Read `references/06-critique.md` for `audit`, `polish`, and every implemented
visual change.

- Inspect rendered output at the prescribed widths and in supported themes.
- Compare the result with the direction card, not with generic notions of
  beauty.
- Use a fresh critic when subagents are available and the task is safe to
  forward-test. Give the critic the raw artifact and brief, not the intended
  verdict.
- Revise material failures at least once before delivery.
- In `audit` mode, provide evidence, user impact, and an exact
  component-, hierarchy-, or token-level fix. Do not edit.

## Persist intentional systems

Read `references/07-design-memory.md` when a project has `DESIGN.md`, when the
user asks to establish a reusable direction, or when several screens must share
one design language. Do not persist transient experiments.

## Verify

Run checks for the changed scope:

- `web-ui/**`: run `pnpm verify` from `web-ui`.
- `primitives/**` or `mini-app/**`: run `npm run verify` from the repository root.
- Primitives consumed by Web UI: run both commands.
- A product containing the copied Web UI kit: run `npm run check:web-ui`.
- A product containing the copied Mini App kit: run `npm run check:mini-app`.
- Changes to this skill or its references: run `npm run verify:deslop-ui` from
  the repository root and the skill validator.

The current code checks enforce contracts and compilation; they do not prove
visual quality. Never report screenshot, accessibility, dark-theme, or
responsive review unless it was actually performed.

## Report

State:

- selected mode and platform;
- direction and structural fingerprint when established or observed;
- reused or added components and primitives;
- rendered states and viewports actually inspected;
- checks run and their results;
- anything not visually or behaviorally verified.
