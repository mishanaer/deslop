# States, motion, and responsive behavior

Use this reference for every interactive implementation and for state or
responsive audits.

## Contents

- State matrix
- Forms and actions
- Data and asynchronous content
- Responsive transformation
- Motion
- Test content

## State matrix

Identify applicable states before polishing:

| State | Required question | Preferred response |
|---|---|---|
| initial | What is possible before interaction? | orient with real content and one primary action |
| hover | Does pointer hover add useful preview? | reinforce affordance without moving layout |
| focus | Can keyboard users locate control and context? | visible focus, logical order, no trap |
| active/pressed | Is the action acknowledged immediately? | stable pressed feedback |
| disabled | Why is action unavailable? | preserve label; explain only when needed |
| loading | Is geometry or duration known? | skeleton for known layout; bounded indicator otherwise |
| partial | Can useful content render before everything arrives? | show available content and local loading |
| empty | Is the dataset truly empty or only filtered? | distinguish first-use, no-results, and cleared states |
| validation error | Which field and recovery step? | place specific guidance next to the field |
| system error | What failed and what remains safe? | explain recovery, retry, or preserved work |
| success | What changed and what happens next? | confirm outcome; offer undo when safe |
| offline/stale | Is displayed data current? | expose freshness and safe available actions |
| permission | What access is missing? | explain reason and next step without dead end |

Do not build every possible state blindly. Include states that can occur in the
actual flow, plus boundary cases that protect the layout.

## Forms and actions

- Keep labels persistent; do not use placeholder as the only label.
- Put validation near the affected control and preserve entered values.
- Disable submission only when the reason is obvious or explained.
- Keep action naming consistent through button, progress, success, and error.
- Use explicit confirmation for destructive or irreversible actions.
- Prevent repeated activation from submitting a destructive or expensive
  mutation twice.
- Return focus after dialogs, sheets, and menus close.
- Do not block paste, password managers, autofill, or expected keyboard input.
- Keep one primary action per decision region.

Use `sasha` for substantive Russian microcopy decisions.

## Data and asynchronous content

- Preserve layout geometry during loading to reduce movement.
- Avoid fake placeholder metrics that can be mistaken for real data.
- Show partial data when it remains trustworthy and useful.
- Distinguish "no data exists" from "filters returned no results."
- Keep filters, sort, selection, and scroll context across refreshes when safe.
- Handle cancellation and out-of-order responses so stale results cannot
  replace newer state. Deduplicate retries and roll back optimistic updates
  when the server rejects them.
- Format numbers for comparison: align, group digits, use tabular numerals when
  available, and show units.
- Give charts a question and an honest scale; do not add a chart because the
  layout has an empty region.
- Keep tables readable with long labels, large values, and missing fields.

## Responsive transformation

For each breakpoint, document:

- regions that remain persistent;
- regions that change order;
- controls that collapse or move to an overlay;
- comparisons that become a switch;
- actions that become sticky;
- navigation that changes model;
- how focus, selection, and scroll context survive.

Minimum review widths:

- Web UI: 320 or 360, 768, and 1440 px.
- Mini App: 320, 375, and 414 px.

Choose the applicable state × viewport × theme cells before testing and record
the exact cells inspected. One state, one viewport, and one theme tested
separately do not prove their combinations.

Avoid:

- scaling down a desktop canvas until it is technically visible;
- hiding critical information without an alternate path;
- horizontal page overflow;
- unreadably narrow tables;
- fixed elements covering focused inputs;
- mobile actions far from the object they affect.

## Motion

Classify motion:

1. **Feedback:** pressed, success, loading, or state acknowledgement.
2. **Orientation:** route, sheet, expanded detail, or object continuity.
3. **Explanation:** sequence or data change that is easier to understand in
   motion.
4. **Delight:** rare signature moment that remains optional.

Prioritize in that order. Use transform and opacity where possible. Avoid
animating layout continuously, transition-all behavior, and simultaneous
entrances on every element.

Respect reduced motion:

- remove parallax, looping ambience, and large spatial travel;
- preserve the final state and essential feedback;
- never require animation to understand or complete the task.

## Test content

Exercise:

- long Russian and English labels;
- 200% text zoom where practical;
- large, negative, zero, and missing numeric values;
- long names and unbroken identifiers;
- no avatar or broken media;
- zero, one, and many items;
- slow and failed network;
- keyboard-only navigation;
- touch without hover;
- light and dark themes.
