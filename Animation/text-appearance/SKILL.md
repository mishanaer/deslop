---
name: text-appearance
description: Apply the Pixel Point per-character-rise text animation to existing headings and phrase swaps. Use when a user asks for Text Appearance, per-character rise, letters rising from below, or this exact crisp no-blur effect in WAAPI, Motion or Framer Motion, GSAP, CSS, Remotion, or another animation stack.
---

# Text Appearance

Implement only the `per-character-rise` effect. Preserve the product's text,
typography, color, spacing, and layout unless the user asks to change them.

## Workflow

1. Identify whether the user wants a one-shot reveal or a looping phrase swap.
2. Treat a named animation library as binding; do not substitute another one.
3. Split text per grapheme while preserving spaces and punctuation. Use
   `Intl.Segmenter` when available and `Array.from` as the fallback.
4. Apply the motion contract below to every character in DOM order.
5. For exact Pixel Point playback or a non-WAAPI adapter, read
   [references/effect.json](references/effect.json).
6. For dependency-free browser code, copy
   [assets/waapi/text-appearance.js](assets/waapi/text-appearance.js) and
   [assets/waapi/text-appearance.css](assets/waapi/text-appearance.css).

## Motion contract

- Target: per character, normal left-to-right stagger.
- Enter: opacity `0 → 1`, translate Y `32px → 0`, duration `700ms`, stagger
  `24ms`, easing `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Exit: opacity `1 → 0`, translate Y `0 → -24px`, duration `420ms`, stagger
  `14ms`, easing `cubic-bezier(0.7, 0, 0.84, 0)`.
- Never animate blur. Crisp glyphs are the defining property of this effect.
- For exact website parity, multiply durations and staggers by `0.72` and
  vertical travel by `0.58`: enter `504ms / 17ms / 18.56px`; exit
  `302ms / 10ms / -13.92px`.

## Exact loop

1. Wait a random initial delay from `0` to `400ms`.
2. Enter the first phrase once, then hold for `550ms`.
3. Exit the visible phrase completely.
4. Replace it, enter the next phrase once, then wait `320ms`.
5. Repeat from the exit step. Do not enter an already-visible phrase twice.

Keep a single active phrase layer; replace content only after exit completes.
Await animation completion instead of also sleeping for its calculated duration.
Cancel animations and timers during teardown.

## Host and accessibility

- Keep the host application responsible for typography and presentation.
- Use an inline-block host with `perspective: 900px` and inline-block character
  units with `white-space: pre`, hidden backfaces, and transform origin
  `50% 55%`.
- Preserve the complete phrase as the host's accessible label and hide split
  character spans from assistive technology.
- Respect `prefers-reduced-motion` by rendering static text.

## Verification

- Confirm the existing copy is unchanged unless replacement phrases were given.
- Confirm no blur occurs at any frame.
- Confirm every phrase enters exactly once and exits before replacement.
- Confirm spaces, punctuation, emoji, and non-Latin graphemes remain intact.
- Confirm the implementation imports and calls only the requested animation
  library.
