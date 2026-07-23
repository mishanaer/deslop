# Design memory

Use this reference when a project already has `DESIGN.md`, when the user asks to
establish a reusable design direction, or when several surfaces must share one
language.

## Contents

- Principles and conflict order
- What to record
- Suggested document
- Diversification memory
- Update protocol

## Principles

- Treat `DESIGN.md` as persistent product intent.
- Treat Deslop Primitives and live component catalogs as implementation truth.
- Record decisions that should affect future screens, not transient experiments.
- Explain why a choice exists, not only its value.
- Keep screen-specific exceptions close to the relevant surface.
- Do not silently rewrite established direction during an unrelated task.

Prefer compatibility with the open Google `DESIGN.md` format when the project
uses it. Use its validator rather than inventing a conflicting schema.
When its CLI is already available, validate with:

```bash
npx @google/design.md lint DESIGN.md
```

The format is evolving. Inspect the project-pinned version before adding
machine-readable keys, and do not install or upgrade it merely to complete a
one-off visual task.

## Read

Before designing:

1. Read YAML tokens and the human rationale.
2. Resolve conflicts in this order:
   - explicit current user instruction;
   - applicable product behavior and accessibility;
   - current `DESIGN.md`;
   - Deslop component and primitive contracts;
   - this skill's aesthetic guidance.
3. Name any unavoidable conflict before implementation.

## Record

Persist:

- product mode and primary user jobs;
- visual thesis;
- structural fingerprints used across the product;
- density and hierarchy rules;
- navigation and detail-reveal behavior;
- typography roles and semantic accent choices;
- signature element or interaction;
- responsive transformations;
- preferred component compositions;
- repeated anti-goals;
- authorized exceptions to the default component language.

Do not persist:

- a one-off screenshot experiment;
- temporary campaign copy;
- fabricated style names;
- exhaustive component APIs;
- duplicated copies of the live component inventory;
- arbitrary raw values already owned by Primitives.

## Suggested document

Keep the machine-readable section compatible with the project's chosen
`DESIGN.md` specification. Put Deslop-specific intent in the prose:

```md
---
name: Product name
---

## Overview

Product mode, audience, user jobs, and visual thesis.

## Colors

Semantic roles and any product-level mapping to validated Deslop accents.

## Typography

Roles, hierarchy, and allowed type voices. Reference Primitives as the source.

## Layout

Structural fingerprints, density, persistence, and responsive transformations.

## Components

Preferred compositions and explicit component behavior exceptions.

## Do's and Don'ts

Signature, restraint rule, and repeated anti-goals.
```

If exact tokens are present, keep them synchronized with the implementation.

## Diversification memory

When a project repeatedly generates new surfaces, optionally keep a small
project-local history of the last structural fingerprints and signatures. Use
it to notice accidental repetition, not to force random variation.

Record only:

```json
{
  "surface": "campaign diagnostics",
  "fingerprint": "exception-led split workspace",
  "signature": "impact rail",
  "density": "high"
}
```

The brief and product language always outrank diversification. Do not change a
correct structure merely because it appeared before.

## Update protocol

1. Show the persistent decision being added or changed.
2. Explain which future surfaces it affects.
3. Preserve unrelated document sections.
4. Validate the document when a compatible tool is available.
5. Review the implementation and memory together for drift.
