# Mini App

React-компоненты для Telegram Mini Apps на основе `@deslop/primitives`.

## Подключение

```bash
npx @deslop/mini-app setup
```

Команда добавит компоненты, стили, правила для агентов и проверку перед коммитом.
Компоненты появятся в `src/components/mini-app`, исходники для чтения — в
`.deslop/mini-app/source`.

## Разработка Mini App

```bash
npm install
corepack yarn --cwd mini-app install --immutable
corepack yarn --cwd mini-app dev
```

## Проверка

```bash
npm run verify
```

Правила работы с Mini App: [AGENTS.md](AGENTS.md)
