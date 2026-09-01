# serega

Two skills for per-character text animations.
See them in action: https://serega-skill.vercel.app

## Effects

- [serega-gentle](./serega-gentle/SKILL.md) — a gentle upward reveal without
  blur. Best for sentences, multi-line headings, and longer text.
- [serega-emotional](./serega-emotional/SKILL.md) — an expressive reveal with
  blur, rotation, and spring motion. Best for short phrases.

## Add them to an agent

Copy one or both directories into your project's `.agents/skills/` directory:

```text
.agents/skills/
├── serega-gentle/
└── serega-emotional/
```

Then name the skill in your request to the agent:

```text
Apply $serega-gentle to this text
```

```text
Apply $serega-emotional to this short phrase
```

If both skills are installed, the agent will choose an effect based on the
text length and the guidelines in the corresponding `SKILL.md`.
