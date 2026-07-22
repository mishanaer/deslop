# Copilot Instructions

**Refer to `AGENTS.md` in project root for comprehensive guidelines.**

## Critical Rules

- MUST: Run linting/type checks before completing tasks
- MUST: Fix all errors before submission
- MUST: Use **yarn** (not npm/pnpm)
- MUST: Keep files under **250 lines**
- MUST: Use **SCSS Modules** for styling
- MUST: Use **PropTypes** for type checking
- NEVER: Create markdown files unless explicitly asked
- NEVER: Use emojis in replies

## Tech Stack

- Platform: Web UI library and Vite Storybook; Telegram Web App is an optional adapter
- Routing: wouter with useHashLocation
- Animation: motion (framer-motion compatible)
- Styling: SCSS Modules (ComponentName.module.scss)

## React Guidelines

Read: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

Only use `useEffect` for:
- External system synchronization (APIs, DOM, third-party libs)
- Cleanup on unmount

NOT for:
- Data transformation (use variables/useMemo)
- User events (use event handlers)
- State resets on prop change (use key prop)
