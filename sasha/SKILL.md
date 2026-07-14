---
name: sasha
description: "UX writing for Russian interface microcopy. Use to draft, rewrite, review, lint, or localize Russian UI strings in product interfaces: i18n locale files such as ru.json/ru.yml, React/Vue/mobile/frontend strings, headings, buttons, links, alerts, errors, labels, placeholders, tooltips, hints, legal copy inside UI, empty states, loading states, code entry screens, dates, currencies, numbers, and short interface typography. Do not use as a generic Russian proofreader or for marketing, articles, PR, social media, API docs, brand strategy, or English-only UX writing."
---

# sasha

## Scope

Use this skill only for product interface microcopy in Russian: short strings that guide a user through a UI flow. If the text is marketing, editorial, PR, social, API documentation, legal contracts outside UI, or general proofreading, say that this skill is UI-focused and use only broad writing judgment.

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

## Workflow

1. Detect the text type: `heading`, `subheading`, `button`, `link`, `alert`, `error`, `label`, `placeholder`, `tooltip`, `hint`, `toggle`, `legal`, `empty_state`, `loading_state`, `code_entry`, or `unknown_ui_string`.
2. Identify the user's job: where they are in the flow, what they already know, what action is expected, and what happens after tapping/clicking/typing.
3. Decide whether copy is the right fix. If layout, state, affordance, validation, or component choice is the real issue, call that out.
4. Apply rules in this order: user task, component pattern, clarity, brevity, neutral tone, typography, i18n safety.
5. For code edits, change only UI strings unless the user explicitly asks for component changes.

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

For generation tasks, return 2-4 options:

- `Безопасный`: clear default for production.
- `Короткий`: for tight UI space.
- `Более явный`: when the consequence must be explicit.
- `Для узкого места`: only when character space is likely constrained.

Then state the recommended option and the reason in one or two sentences.

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
