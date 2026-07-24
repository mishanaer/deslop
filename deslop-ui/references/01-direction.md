# Product direction

Use this reference for `build` and `redesign`, and whenever an existing surface
looks competent but generic.

## Contents

- Product grounding
- Product modes
- Direction card
- Variation and selection
- Visual grammar
- Default rejection
- Examples

## Product grounding

Begin with the product's world rather than a style label. Identify:

- the concrete subject and its vocabulary;
- the person using the surface and their level of expertise;
- the decision, action, or understanding the surface must enable;
- the dominant objects: campaign, document, conversation, transaction, route,
  media item, task, or something else;
- the product's tempo: urgent, repeated, contemplative, exploratory, or
  celebratory;
- the consequences of error.

Turn those facts into visual decisions. A financial control room may need
aligned numbers, exception emphasis, and dense comparison. A guided family flow
may need calm pacing, clear progress, and one action at a time. Neither direction
comes from choosing "modern SaaS."

Use real domain language and plausible content. Generic copy makes a specific
layout feel generic.

## Product modes

Choose one primary mode. A surface may contain secondary moments, but do not
optimize every region for a different mode.

| Mode | Optimize for | Common surfaces | Typical failure |
|---|---|---|---|
| `operate` | scanning, control, repetition, state | dashboards, settings, queues | oversized marketing hierarchy |
| `decide` | comparison, consequence, confidence | checkout, approval, pricing, review | equal emphasis on unequal options |
| `explain` | comprehension, sequence, recall | reports, help, analysis, education | card-per-paragraph fragmentation |
| `persuade` | narrative, proof, commitment | onboarding, upgrade, landing | unsupported claims and generic hero |
| `explore` | discovery, spatial memory, curiosity | catalogs, media, creative tools | novelty that hides navigation |

## Direction card

Write this compact internal contract before JSX:

```yaml
mode:
subject:
audience:
user_job:
success_moment:
dominant_object:
hierarchy_anchor:
visual_thesis:
structural_fingerprint:
density: low | medium | high
variance: low | medium | high
motion: low | medium | high
signature:
avoid:
  -
  -
  -
```

Make `visual_thesis` concrete and product-specific.

Weak:

> Clean modern dashboard with bold cards and a green accent.

Strong:

> An exception-led control room where affected campaigns and the next safe
> action are visible before aggregate performance.

## Variation and selection

For an underspecified blank slate, compare three directions that differ in
hierarchy and structure:

1. Give each direction a different dominant object.
2. Change what remains persistent versus contextual.
3. Change how detail is revealed.
4. Keep the same product facts and component constraints.
5. Reject any candidate that is only a palette change.

Select against:

- speed of the primary task;
- visibility of consequence and state;
- amount and volatility of information;
- expected device and input;
- fit with existing product language;
- implementation cost within the current component library.

When the brief already chooses a direction, do not spend time manufacturing
alternatives. Clarify only missing decisions that materially affect the result.

## Visual grammar

Create character using the available system:

- **Hierarchy:** Use meaningful scale jumps, contrast, alignment, and position.
- **Rhythm:** Vary spacing by information relationship, not decoration.
- **Density:** Let expert repeated tasks be dense; let consequential sequential
  tasks breathe.
- **Containment:** Add a surface only when it communicates grouping, elevation,
  interaction, or persistence.
- **Type:** Use display scale for a real focal statement, interface type for
  control, caps for short utility labels, and mono for data or identifiers.
- **Color:** Give accent a job: action, status, data distinction, or emphasis.
  Do not let one accent perform all four jobs on the same screen.
- **Motion:** Orient, explain state change, or create one memorable moment.
  Motion without a product role is noise.

Spend boldness once. Choose one carrier of character: macrostructure, dominant
content object, typography scale, imagery, or a motion transition. Keep the
surrounding interface disciplined enough for that decision to remain legible.

## Default rejection

Treat these as review prompts, not universal bans:

- centered badge + giant heading + two pill CTAs;
- three equal KPI cards above a generic chart;
- a bento grid whose boxes do not encode relationships;
- every section wrapped in the same rounded card;
- decorative `01 / 02 / 03` markers when order has no meaning;
- icons inside colored blobs before every heading;
- aurora, glow, glass, noise, or grid overlays without a product reason;
- the same spacing between every hierarchy level;
- several loud gradients or effects competing for attention;
- fake activity, testimonials, metrics, integrations, or users;
- a dark surface with one acid accent used regardless of subject;
- novelty achieved only by color.

Ask: "Would this exact direction plausibly appear for an unrelated brief?" If
yes, revise the dominant object, hierarchy, or structure before polishing.

## Examples

### Advertising operations

```yaml
mode: operate
user_job: find why CPA increased and choose campaigns for intervention
dominant_object: ranked anomaly queue linked to campaign evidence
hierarchy_anchor: expected business impact
visual_thesis: exceptions before aggregates
structural_fingerprint: exception-led split workspace
density: high
variance: medium
motion: low
signature: persistent impact rail connecting anomaly, evidence, and action
avoid:
  - three equal KPI cards
  - chart gallery without a diagnostic question
  - status represented only by color
```

### AI assistant onboarding

```yaml
mode: persuade
user_job: understand the assistant's boundary and complete the first useful task
dominant_object: a real task preview
hierarchy_anchor: first successful outcome
visual_thesis: demonstrate capability before requesting setup
structural_fingerprint: guided proof flow
density: low
variance: medium
motion: medium
signature: one transition from example request to completed result
avoid:
  - abstract orb as the only product evidence
  - feature bento
  - fabricated productivity statistics
```
