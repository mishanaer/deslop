# Composition

Use this reference for `build` and `redesign`. Choose a structure from
information relationships, not from a catalog of visual themes.

## Contents

- Questions before layout
- Structural fingerprint
- Composition principles
- Macrostructure prompts
- Responsive transformation
- Failure patterns

## Questions before layout

Answer:

1. What must remain visible while the user works?
2. What is the dominant decision, action, or object?
3. What must be compared simultaneously?
4. Is the task scanned, explored, read, or completed sequentially?
5. Which information is global, local, contextual, or transient?
6. What changes often enough to deserve persistent space?
7. What should happen to simultaneous information on a narrow screen?

## Structural fingerprint

Describe the selected structure with stable axes:

```yaml
navigation: none | header | rail | tabs | bottom-bar | contextual
dominant_region: task | object | list | canvas | document | comparison
detail_reveal: inline | split | sheet | dialog | route
containment: flat | grouped | elevated | mixed
primary_action: inline | toolbar | sticky | contextual
density: low | medium | high
responsive_transform: stack | reorder | collapse | switch | sheet | route
```

Two directions count as structurally different only when at least two axes
change in a way that affects use.

## Composition principles

- Prefer one dominant region, one supporting cluster, and one utility lane over
  a grid of equally weighted cards.
- Let scale, alignment, spacing, separators, lists, and tables create grouping
  before adding another surface.
- Use `Card` when elevation or containment has meaning, not as a default wrapper.
- Keep persistent information visually stable across state changes.
- Align comparable values and actions.
- Place consequence near the action that causes it.
- Give the primary action one obvious home.
- Preserve a clear reading or working order when decoration and CSS disappear.
- Avoid nesting surfaces with the same radius and contrast.
- Let dense surfaces be dense intentionally; do not inflate every row into a
  card to appear friendly.

## Macrostructure prompts

These are decision prompts, not templates. Adapt them to the product.

### Focused task

Use for authentication, payment, creation, confirmation, and short forms.

- Visual spine: one task, one progress context, one primary action.
- Keep supporting explanation adjacent to the relevant field or decision.
- Reveal complexity progressively.
- Web: `Field`, `Form`, `Input`, `Select`, `Alert`, `Button`,
  `AlertDialog`.
- Mini App: `Page`, `AppBar`, `TextField`, `RegularButton`, `ModalView`.
- Narrow behavior: usually remains a single column.
- Avoid when users must compare several objects while acting.
- Failure: marketing hero wrapped around a routine form.

### Guided proof flow

Use when onboarding must demonstrate value before requesting setup.

- Visual spine: promise → real example → result → commitment.
- Keep one concrete product demonstration as the signature.
- Web: `Tabs` or progressive sections, `Message`, `Attachment`, `Button`.
- Mini App: `Page`, `Text`, `PageTransition`, `StreamingText`,
  `RegularButton`.
- Narrow behavior: keep the sequence; do not compress steps into a card grid.
- Failure: feature carousel with no successful outcome.

### Master-detail

Use for messages, records, catalog objects, settings, and admin entities.

- Visual spine: scannable collection plus contextual detail.
- Keep collection state while inspecting detail.
- Web: `ResizablePanelGroup`, `Item`, `Table`, `ScrollArea`, `Sheet`.
- Mini App: `SplitView`, `Cells`, `CellStack`, `ModalView`.
- Narrow behavior: route or sheet for detail; preserve return position.
- Avoid when detail is rarely needed or the collection is tiny.
- Failure: opening every item in a centered modal.

### Exception-led split workspace

Use for monitoring, operations, diagnostics, and review queues.

- Visual spine: ranked exceptions → evidence → intervention.
- Make business impact or urgency the ordering principle.
- Web: `Sidebar`, `Command`, `Tabs`, `ResizablePanelGroup`, `Table`,
  `ChartContainer`, `Alert`, `Sheet`.
- Mini App: `SectionList`, `Table`, `Badge`, `Snackbar`, `ModalView`.
- Narrow behavior: exceptions become the main screen; evidence moves to a
  route or sheet.
- Avoid when users primarily need an executive summary.
- Failure: aggregate KPI cards occupying the most valuable space.

### Command and data plane

Use for expert tools with repeated filtering, keyboard navigation, and dense
data.

- Visual spine: stable command area plus uninterrupted working plane.
- Keep filters and scope visible; make selection state unmistakable.
- Web: `Command`, `Menubar`, `ButtonGroup`, `Table`, `Pagination`,
  `ResizablePanelGroup`.
- Mini App: use cautiously; prefer native lists and segmented choices.
- Narrow behavior: move secondary filters to a sheet while preserving scope.
- Failure: large empty hero above the work area.

### Document-first

Use for reports, explanations, policies, documentation, and generated analysis.

- Visual spine: thesis → evidence → implications → actions.
- Use type, rhythm, anchors, and dividers instead of card-per-section.
- Web: `Breadcrumb`, `Tabs`, `Accordion`, `Separator`, `Table`,
  `ChartContainer`.
- Mini App: `Text`, `Markdown`, `SectionHeader`, `SectionList`.
- Narrow behavior: preserve reading order; move navigation to an index or sheet.
- Failure: fragmenting continuous reasoning into interchangeable tiles.

### Comparison matrix

Use when differences across options or periods drive the decision.

- Visual spine: shared dimensions with aligned evidence.
- Make the deciding dimensions persistent.
- Web: `Table`, `ToggleGroup`, `Tabs`, `ChartContainer`, `HoverCard`.
- Mini App: `SegmentedControl`, `Table`, `Collapsible`.
- Narrow behavior: deliberate option switching or pinned labels; never squeeze
  an unreadable desktop table.
- Avoid when the user evaluates only one object at a time.
- Failure: independent option cards that hide common dimensions.

### Timeline or stream

Use for activity, transactions, history, logs, and conversations.

- Visual spine: time, causality, or conversational turn.
- Make grouping boundaries and unread state meaningful.
- Web: `Item`, `Separator`, `ScrollArea`, `Message`, `MessageScroller`.
- Mini App: `CellStack`, `SectionList`, `StreamingText`, `Snackbar`.
- Narrow behavior: usually native vertical flow.
- Failure: decorative timeline lines that add no temporal information.

### Focused object workspace

Use for editors, builders, documents, media, and one complex object.

- Visual spine: dominant object plus contextual controls.
- Keep controls close to their effect.
- Web: `ResizablePanelGroup`, `Tabs`, `Sheet`, `Popover`, `Command`.
- Mini App: `Page`, `PanelHeader`, `SplitView`, `ModalView`.
- Narrow behavior: object first; contextual controls become sheets or modes.
- Failure: surrounding the object with equal card panels.

### Narrative progression

Use for product explanation, launch, upgrade, or an important first-run story.

- Visual spine: one argument with cumulative proof.
- Give each transition a narrative job.
- Web: compose sections from type, media, `Carousel`, `Tabs`, and actions.
- Mini App: `Page`, `Text`, `Gallery`, `PageTransition`, one atmospheric
  component.
- Narrow behavior: preserve the narrative order and keep the action reachable.
- Failure: hero → three features → testimonials → CTA regardless of subject.

## Responsive transformation

Do not describe responsiveness as "make it stack." Specify:

- what remains persistent;
- what changes order;
- what collapses behind disclosure;
- what moves to `Sheet`, `Drawer`, `ModalView`, or a route;
- what comparison becomes a deliberate switch;
- how focus and scroll position return;
- whether the primary action becomes sticky;
- how dense data remains legible.

At 320–414 px, simultaneous desktop regions usually need a change in
interaction model, not smaller typography.

## Failure patterns

Revise when:

- all regions have equal visual weight;
- the first viewport contains no real product object;
- the main task starts below decorative content;
- cards duplicate whitespace and borders without adding meaning;
- detail obscures the collection state users need to return to;
- navigation reflects implementation modules instead of user concepts;
- the desktop layout is merely squeezed on mobile;
- a unique visual treatment weakens the library component's affordance.
