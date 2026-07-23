# TMA

React-компоненты для Telegram Mini Apps на основе `@deslop/primitives`.

## Подключение

```bash
npx @deslop/tma setup
```

Команда добавит компоненты, стили, правила для агентов и проверку перед коммитом.
Компоненты появятся в `src/components/tma`, исходники для чтения — в
`.deslop/tma/source`.

## Разработка TMA

```bash
npm install
corepack yarn --cwd tma install --immutable
corepack yarn --cwd tma dev
```

## Проверка

```bash
npm run verify
```

Правила работы с TMA: [AGENTS.md](AGENTS.md)
