# Web UI

React-компоненты для веб-продуктов на основе `@deslop/primitives`.

## Подключение

```bash
npx @deslop/web-ui setup
```

Команда добавит компоненты, стили, правила для агентов и проверку перед коммитом.
Компоненты появятся в `src/components/web-ui`, исходники для чтения — в
`.deslop/web-ui/source`.

## Разработка Web UI

```bash
cd web-ui
pnpm install
pnpm dev
```

## Проверка

```bash
npm run verify
```

Правила работы с Web UI: [AGENTS.md](AGENTS.md)

Компоненты адаптированы из [shadcn/ui](https://github.com/shadcn-ui/ui), MIT.
