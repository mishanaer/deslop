# Visual critique and audit

Use this reference for `audit`, `polish`, and the final review of every visual
implementation.

## Contents

- Evidence standard
- Hard gates
- Judgment rubric
- Anti-slop signals
- Review procedure
- Output format

## Evidence standard

Separate:

- **observed:** visible in a rendered screenshot or reproduced behavior;
- **code-confirmed:** proven by source, DOM, or automated check;
- **inferred:** likely impact that still needs validation.

Do not present an inference as a rendered fact. Every finding must include:

1. Evidence: exact surface, state, viewport, file, or component.
2. Impact: user understanding, action, accessibility, or system consistency.
3. Fix: precise hierarchy, composition, component, token, or behavior change.

Avoid empty feedback such as "make it cleaner," "add whitespace," or "make it
pop."

An `observed` claim must name the surface, state, viewport, theme, and rendered
artifact or reproduced interaction. Build, lint, type, and verify commands are
code evidence; they are not visual or accessibility evidence by themselves.
A broad accessibility pass also needs DOM or accessibility-tree evidence and
keyboard reproduction; source alone supports only specific code-confirmed
claims.

If only source is available, report code-confirmed and inferred findings, but
do not issue a visual verdict or visual scores. Use `NOT ASSESSED` when the
requested evidence is unavailable. Use `BLOCKED` when a missing prerequisite or
component capability prevents completing the requested delivery.

## Hard gates

Fail delivery when an applicable gate fails:

- the primary task or action cannot be identified;
- content or controls overflow at a required width;
- keyboard focus is hidden, trapped, or ordered incorrectly;
- a control lacks an accessible name;
- required state is communicated only through color;
- a destructive action lacks clear consequence or confirmation;
- reduced-motion preference leaves the interface broken;
- loading, error, or empty state prevents recovery;
- fabricated product evidence appears as real;
- a private component duplicates an available library behavior;
- unapproved raw colors, arbitrary visual values, or icons bypass Primitives;
- dark theme makes content or state illegible;
- the claimed visual review was not actually rendered.

## Judgment rubric

Score each axis from 0 to 4:

| Axis | 0–1 | 2 | 3–4 |
|---|---|---|---|
| Product clarity | task is hidden or contradictory | discoverable with effort | task and next action are immediate |
| Hierarchy | regions compete | hierarchy exists but is weak | dominant, supporting, and utility roles are clear |
| Structural specificity | generic template | some product adaptation | structure expresses real product relationships |
| Component fit | controls used by appearance | mostly correct with friction | behavior and composition match intent |
| Density and rhythm | arbitrary or exhausting | usable but uniform | density matches task and relationships |
| Restraint | effects compete | some unnecessary treatment | one coherent signature with disciplined support |
| Responsive intent | desktop squeezed or content hidden | basic reflow | interaction model adapts deliberately |
| State coverage | critical states missing | main states present | boundary, recovery, and transitions are coherent |

Revise when:

- Product clarity or Hierarchy is below 3;
- any hard gate fails;
- two other axes are below 3;
- the result contradicts its direction card.

The score supports judgment; it does not replace evidence.

## Anti-slop signals

Review, but do not automatically fail, when:

- every section is a rounded card;
- three equal KPI cards precede a generic chart;
- a centered hero delays the actual product task;
- pills are used for ordinary labels or primary navigation;
- icons in decorative blobs precede every heading;
- nested surfaces share radius and contrast;
- gradient, glow, glass, noise, or grid exists without a product role;
- several CTAs have equal visual weight;
- every element animates into view;
- typography, color, and layout could belong to any unrelated AI product;
- sections are numbered without meaningful sequence;
- testimonial, metric, avatar, or activity data is invented;
- the only variation from an existing block is copy or color;
- desktop regions simply stack without rethinking persistence and comparison;
- a signature effect weakens familiar component affordance.

## Review procedure

1. Re-read the brief and direction card when one was established. Otherwise
   state the observed direction and judge whether it fits the product.
2. Render applicable widths, themes, and states.
3. Identify the primary task in five seconds.
4. Trace the main action and recovery path.
5. Inspect hierarchy without reading decorative copy.
6. Check product-specific structure and real content.
7. Run hard gates.
8. Score the judgment rubric.
9. Rank no more than five material subjective findings.
10. Revise, re-render, and re-check.

When subagents are available, use a fresh critic with the raw brief and artifact.
Do not reveal the intended score or suspected defects.

## Output format

For an audit:

```md
## Verdict
PASS | PASS WITH CONDITIONS | FAIL | NOT ASSESSED | BLOCKED

## Blocking findings
- [gate-id] Evidence → impact → exact fix

## Material findings
- [axis] Evidence → impact → exact fix

## Scores
| Axis | Score | Evidence |
|---|---:|---|

## Verified
- viewport, theme, state, command

## Not verified
- ...
```

Omit empty sections and unobserved rubric rows. In implementation mode, report
the material decision and verification rather than dumping the entire internal
scorecard.
