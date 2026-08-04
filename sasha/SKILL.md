---
name: sasha
description: "Write, rewrite, edit, review, or localize Russian text for interfaces, marketing materials, and documentation, or generate an interface component that contains Russian text. Use only for UI copy; marketing copy such as landing pages, product pages, ads, promotional emails, campaign messages, and promotional social posts; and documentation such as user guides, technical documentation, instructions, README files, help content, and API references. Do not use for ordinary answers, explanations, discussions, correspondence, meeting notes, support replies, editorial articles, or other Russian text outside interface, marketing, and documentation work."
---

# sasha

## Scope

- Use only for Russian interface copy, marketing copy, and documentation.
- Treat landing pages, product pages, ads, promotional emails, campaign messages, and promotional social posts as marketing copy.
- Treat user and technical guides, instructions, README files, help content, API references, and internal procedures as documentation.
- Do not trigger merely because a task or conversation contains Russian text.
- Exclude ordinary answers, explanations, discussions, correspondence, meeting notes, editorial articles, and support replies unless the text is part of an interface, marketing campaign, or documentation set.

## Core Principles

- Text must help the user complete the current task.
- Prefer removing unnecessary copy or improving UI structure over explaining a weak interface.
- Write plainly, concretely, and neutrally.
- Put the important fact or action first.
- Do not soften bad news with jokes, hype, excessive apologies, or vague positivity.
- For errors, say what happened, what the user can do, and what to expect next if known.
- Clickable controls usually sound like the user's action.
- Labels and placeholders usually name the data, not the act of typing it.
- Tooltips and hints add context; mandatory information belongs on the screen.
- Treat legal-sensitive UI copy as constrained: suggest variants and mark `needs legal review` when meaning may change.
- For documentation, preserve factual meaning, commands, examples, links, and identifiers. Do not invent product behavior; flag missing or conflicting sources.

## Workflow

1. Detect the context: `interface`, `marketing`, or `documentation`. For interface copy, identify the component type. For marketing copy, identify the format and placement. For documentation, identify the document type and source of truth.
2. Identify the user's job: what they already know, what action is expected, and what happens next. For marketing copy, also identify the audience, offer, channel, and verifiable claim. For documentation, identify the audience, prerequisites, task, and expected result.
3. Decide whether copy is the right fix. If layout, state, affordance, validation, component choice, document structure, or missing factual context is the real issue, call that out.
4. Apply rules in this order: user task, format pattern, factual accuracy, clarity, brevity, neutral tone, typography, i18n safety.
5. For code edits, change only the requested UI strings or documentation files unless the user explicitly asks for component or implementation changes.

## Code Editing Rules

- Inspect the project first: package manager, localization format, component framework, and existing naming conventions.
- Preserve localization keys unless a key is clearly wrong and the user agrees.
- Preserve variables and formatting syntax: `{name}`, `%{count}`, `{{value}}`, ICU plural/select, JSX interpolation, HTML entities, markdown links, and escaped characters.
- Do not rewrite legal copy aggressively. Add a note instead.
- If useful, run `scripts/extract_ui_strings.py` to find candidate strings and `scripts/ui_text_lint.py` for heuristic warnings.
- Run available project checks when commands are obvious from lockfiles/scripts.

## Review Output

For review tasks, keep findings specific and grouped:

```md
## Критичные проблемы
- ...

## Замечания sasha
- ...

## Типографика
- ...

## Предложенная версия
| Было | Стало | Почему |
|---|---|---|
| ... | ... | ... |

## Что проверить отдельно
- ...
```

Omit empty sections for small reviews.

## Generation Output

For interface generation tasks, return 2-4 options:

- `Безопасный`: clear default for production.
- `Короткий`: for tight UI space.
- `Более явный`: when the consequence must be explicit.
- `Для узкого места`: only when character space is likely constrained.

Then state the recommended option and the reason in one or two sentences.

For marketing copy, return 2-3 variants when alternatives are useful. For documentation, return one recommended version unless the user asks for variants.

## Supporting References

- Read `references/01-principles.md` for general UI writing judgment.
- Read `references/02-components.md` for component-specific patterns.
- Read `references/03-errors.md` for error states and recovery copy.
- Read `references/04-typography.md` for Russian UI typography and safe normalizations.
- Read `references/05-code-review.md` before editing localization files or strings in code.
- Read `references/06-examples.md` for quick before/after examples.
- Use `references/rules.json` as the machine-readable rule set for scripts or audits.

## Scripts

`scripts/extract_ui_strings.py` extracts likely Russian UI strings from `.json`, `.yml`, `.yaml`, `.ts`, `.tsx`, `.js`, `.jsx`, and `.vue`.

```bash
python3 sasha/scripts/extract_ui_strings.py src/locales/ru.json --format json
python3 sasha/scripts/extract_ui_strings.py src --include '*.tsx' --format md
```

`scripts/ui_text_lint.py` reports heuristic sasha warnings. Treat results as review prompts, not automatic truth.

```bash
python3 sasha/scripts/ui_text_lint.py src/locales/ru.json
python3 sasha/scripts/ui_text_lint.py src --format json --component button
```
