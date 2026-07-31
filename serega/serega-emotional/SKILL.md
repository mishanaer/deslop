---
name: serega-emotional
description: Apply an expressive per-character reveal with rise, blur, vertical compression, rotation, and a damped overshoot. Use for short accent copy, ideally 2–4 words and no more than one short sentence. For multiline or longer text, or pages with several simultaneous reveals, use serega-gentle instead.
---

# Serega Emotional

Apply a one-shot spring reveal to short accent copy. Preserve the product's
text, typography, color, spacing, and layout unless the user asks to change
them.

## Choose the effect

- Use Serega Emotional for a short heading, label, or phrase: ideally `2–4`
  words and no more than one short sentence.
- Use [Serega Gentle](../serega-gentle/SKILL.md) for multiline headings,
  longer copy, or several animated blocks on one page.
- Do not loop this effect. Per-character blur is deliberately expressive and
  more expensive to render.

## Workflow

1. Treat a requested animation library as binding; do not substitute another.
2. Split text per grapheme while preserving spaces and punctuation. Use
   `Intl.Segmenter` when available and `Array.from` as the fallback.
3. Group character units into non-breaking word wrappers. Keep trailing
   whitespace with the preceding word so lines wrap only between words.
4. Apply the selector formula and property mapping below to every character in
   normal DOM order.
5. Read [references/effect.json](references/effect.json) for the supplied
   After Effects source preset or when translating to another renderer.
6. For projects with Motion, copy
   [assets/motion/serega-emotional.js](assets/motion/serega-emotional.js).
7. For dependency-free browser code, copy
   [assets/waapi/serega-emotional.js](assets/waapi/serega-emotional.js) and
   [assets/waapi/serega-emotional.css](assets/waapi/serega-emotional.css).

## Motion contract

- Target: per character, left-to-right stagger.
- Delay: `1.5` frames per character at `60fps`: the first character starts
  after `25ms`, and every next character starts another `25ms` later.
- Linear phase: selector amount `100% → 0%` over `180ms`.
- Spring: after the linear phase, use frequency `1Hz` and decay `10` until
  `680ms` total local time.
- Start state: `translateY(32px)`, `scaleY(0.78)`, `rotate(12deg)`, opacity
  `0`, and CSS blur `10px`.
- End state: natural position, scale, rotation, opacity, and no blur.
- Allow the selector amount to become negative during the overshoot. Clamp
  opacity and blur, but not position, scale, or rotation.
- Exit: none. Do not invent an exit animation unless the user requests one.

Do not replace the selector formula with `type: "spring"` when exact parity is
required. In Motion, pass sampled arrays with matching `times` and
`ease: "linear"`.

For local time `t` in seconds and `w = 2π × frequency`, calculate normalized
selector strength `p`:

```text
t <= 0:       p = 1
t < 0.18:     p = 1 - t / 0.18
t >= 0.18:    p = (-1 / 0.18) × sin((t - 0.18) × w)
                  / (exp(10 × (t - 0.18)) × w)
```

Map `p` to `y = 32p`, `scaleY = 1 - 0.22p`, `rotation = 12p`,
`opacity = clamp(1 - p, 0, 1)`, and `blur = 10 × max(p, 0)`.

## Performance

- Keep this effect to short copy. CSS blur can require repainting every
  character throughout the reveal.
- Start animations only when they enter the viewport. Avoid several long
  Serega Emotional blocks running at the same time.
- Render static text for `prefers-reduced-motion`.
- Use Serega Gentle when performance or text length is uncertain.

## Host and accessibility

- Keep the host application responsible for typography and presentation.
- Use non-breaking inline-block word wrappers and inline-block character units
  with `white-space: pre` and a transform origin near the glyph center.
- Preserve the complete phrase as the host's accessible label and hide split
  character spans from assistive technology.
- Cancel retained animations during replay, stop, and teardown.

## Verification

- Confirm position, vertical scale, rotation, opacity, and blur are animated.
- At `180ms` local time, confirm the character reaches its natural state.
- Around `269ms`, confirm the first overshoot is near `-6.2px`, `104%`
  vertical scale, and `-2.3deg` rotation.
- At `680ms`, confirm every property is reset exactly.
- Confirm the first character waits `25ms` and every next character waits
  another `25ms` at `60fps`.
- Confirm spaces, punctuation, emoji, and non-Latin graphemes remain intact.
- Confirm multiline text wraps only between words, never inside a word.
- Confirm no exit animation runs unless explicitly requested.
