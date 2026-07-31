---
name: soft-appearance
description: Apply a lightweight per-character text reveal with crisp letters rising into place. Use for headings, sentences, multiline text, longer copy, or pages with several text animations. Prefer this effect when the text is longer than one short sentence; reserve spring-appearance for short accent copy.
---

# Soft Appearance

Apply a calm, one-shot character reveal. Preserve the product's copy,
typography, color, spacing, and layout unless the user asks to change them.

## Choose the effect

- Use Soft Appearance for sentences, multiline headings, longer text, and
  pages where several reveals may run.
- Use [Spring Appearance](../spring-appearance/SKILL.md) only for short accent
  copy: ideally `2–4` words and no more than one short sentence.
- Choose Soft Appearance when uncertain. It animates only transform and
  opacity, so it is the safer default for performance and readability.

## Workflow

1. Identify whether the user wants a one-shot reveal or a looping phrase swap.
2. Treat a named animation library as binding; do not substitute another one.
3. Split text per grapheme while preserving spaces and punctuation. Use
   `Intl.Segmenter` when available and `Array.from` as the fallback.
4. Apply the motion contract below to every character in DOM order.
5. Read [references/effect.json](references/effect.json) when the original
   Pixel Point recipe or a non-WAAPI adapter is needed.
6. For dependency-free browser code, copy
   [assets/waapi/soft-appearance.js](assets/waapi/soft-appearance.js) and
   [assets/waapi/soft-appearance.css](assets/waapi/soft-appearance.css).

## Motion contract

- Target: per character, normal left-to-right stagger.
- Enter: opacity `0 → 1`, translate Y `15px → 0`, duration `500ms`,
  stagger `15ms`, easing `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Exit for phrase swaps: opacity `1 → 0`, translate Y `0 → -13.92px`,
  duration `302ms`, stagger `10ms`, easing
  `cubic-bezier(0.7, 0, 0.84, 0)`.
- Never animate blur. Crisp glyphs are the defining property of this effect.
- Do not add an exit to a one-shot reveal.

## Phrase swaps

1. Enter the first phrase once, then hold for `550ms`.
2. Exit the visible phrase completely.
3. Replace it, enter the next phrase once, then wait `320ms`.
4. Repeat from the exit step. Do not enter an already-visible phrase twice.

Keep a single active phrase layer. Replace content only after exit completes.
Await animation completion instead of also sleeping for its calculated
duration. Cancel animations and timers during teardown.

## Host and accessibility

- Keep the host application responsible for typography and presentation.
- Use an inline-block host and inline-block character units with
  `white-space: pre`.
- Preserve the complete phrase as the host's accessible label and hide split
  character spans from assistive technology.
- Respect `prefers-reduced-motion` by rendering static text.
- Start the reveal only when it enters the viewport if several animations
  exist on the page.

## Verification

- Confirm the existing copy is unchanged unless replacement phrases were given.
- Confirm no blur occurs at any frame.
- Confirm every phrase enters exactly once and exits before replacement.
- Confirm spaces, punctuation, emoji, and non-Latin graphemes remain intact.
- Confirm the implementation imports and calls only the requested library.
