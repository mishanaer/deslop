# Studying a visual reference

Use this reference when the user supplies a screenshot, URL, competitor, or
named interface as visual input.

## Goal

Extract transferable design logic without cloning pixels, protected brand
assets, proprietary content, or a marketplace template.

## Clarify intent

Determine whether the user wants:

- diagnosis only;
- a fresh design informed by the reference;
- a redesign of existing content;
- persistent design memory.

When intent is obvious from the request, proceed. Otherwise ask one focused
question.

## Extract design DNA

Analyze:

- product mode and primary task;
- information hierarchy;
- macrostructure and structural fingerprint;
- persistent versus contextual regions;
- alignment, rhythm, and density;
- typography roles and scale relationships;
- surface, border, and elevation treatment;
- color roles rather than only hex values;
- image and illustration strategy;
- motion and interaction grammar;
- responsive transformation;
- one memorable mechanism;
- accessibility or usability tradeoffs.

Separate:

- **transferable decisions:** hierarchy, relationships, rhythm, interaction;
- **replaceable styling:** palette, typeface, imagery;
- **non-transferable material:** trademarks, logos, illustrations, copy,
  proprietary data, and paid template assets.

## Map to Deslop

For every adopted decision, name:

1. The product purpose it serves.
2. The Deslop component or composition that expresses it.
3. The semantic token role it needs.
4. The responsive and state behavior.
5. Any missing library capability.

Do not bypass existing component behavior to achieve closer visual similarity.

## Reference report

```md
## What makes the reference work
- ...

## Transferable DNA
| Decision | Product role | Deslop mapping |
|---|---|---|

## Do not copy
- ...

## Proposed direction
- thesis
- fingerprint
- signature
- responsive transformation

## Missing capability
- ...
```

## Guardrails

- Do not reproduce a reference pixel-for-pixel.
- Do not claim exact rhythm or behavior from HTML alone.
- Do not use a third-party font, image, or icon without verified rights.
- Do not import a new library merely because the reference uses it.
- Do not let the reference override the user's content, accessibility, platform
  conventions, or established product direction.
- When the source is inaccessible or auth-gated, request a screenshot rather
  than guessing.
