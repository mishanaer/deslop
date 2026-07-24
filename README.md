# deslop

Внутренний монорепозиторий дизайн-системы Deslop. Его пакеты не предназначены
для публикации в npm или установки во внешние проекты.

## Структура

- `primitives` — общие токены, шрифты и иконки.
- `web-ui` — React-компоненты для веб-продуктов.
- `mini-app` — React-компоненты для Telegram Mini Apps.
- `sasha` — правила для русских интерфейсных текстов.

`web-ui` и `mini-app` используют `../primitives` напрямую через алиасы Vite и
TypeScript. Формального root workspace нет: Web UI сохраняет свой pnpm lock,
а Mini App — свой Yarn lock.

## Первичная установка

Из корня репозитория:

```bash
(cd web-ui && corepack pnpm install --frozen-lockfile)
(cd mini-app && corepack yarn install --immutable)
```

Нужны Node.js с npm и Corepack. Версии pnpm и Yarn зафиксированы в
`packageManager` соответствующих пакетов и выбираются из их директорий.

## Локальная разработка

```bash
(cd web-ui && corepack pnpm dev)
(cd mini-app && corepack yarn dev)
```

## Сборка

```bash
(cd web-ui && corepack pnpm build)
(cd mini-app && corepack yarn build)
```

## Полная проверка

После установки зависимостей:

```bash
npm run verify
```

Команда проверяет primitives, правила и каталоги компонентов, TypeScript,
линтеры, Storybook-сборки и library-сборки обоих продуктов.

Общие правила работы агента находятся в [AGENTS.md](AGENTS.md).
