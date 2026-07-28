# deslop

Deslop — дизайн-система и проверяемый workflow для ИИ-агентов. Репозиторий
содержит публичный consumer API, инструменты миграции и строгую проверку
полноты внедрения.

## Состав

- [`@deslop/primitives`](./primitives/) — токены, шрифты, SVG и типизированные
  React-иконки.
- [`@deslop/web-ui`](./web-ui/) — собранные React-компоненты и CSS, не требующие
  компиляции исходников пакета в продукте.
- [`@deslop/design-system`](./design-system/) — команды `doctor`, `migrate` и
  `audit` для существующего продукта.
- [`mini-app`](./mini-app/) — компоненты и правила для Telegram Mini Apps.
- [`sasha`](./sasha/SKILL.md) — правила русской интерфейсной микрокопии.

## Workflow для агента

Перед изменениями существующего продукта:

```bash
node ./design-system/bin/deslop.mjs doctor --cwd /path/to/product
node ./design-system/bin/deslop.mjs migrate --cwd /path/to/product --dry-run
```

После просмотра плана агент применяет только однозначные миграции:

```bash
node ./design-system/bin/deslop.mjs migrate --cwd /path/to/product
node ./design-system/bin/deslop.mjs audit --cwd /path/to/product --strict
```

Работа не считается завершённой, пока не проходят strict audit, typecheck,
production build и интерактивная проверка основных экранов в светлой, тёмной и
системной темах. Подключение только токенов или нескольких компонентов не
считается внедрением дизайн-системы.

Подробности и формат обоснованных исключений: [design-system/README.md](./design-system/README.md).

## Поддерживаемая интеграция

Web UI поддерживает React 18 и 19. Компонентный stylesheet сейчас собран на
Tailwind 4: `doctor` блокирует полную компонентную миграцию проекта на Tailwind
3, потому что одноимённые utility-селекторы могут конфликтовать. Сброс страницы
вынесен в отдельный opt-in entrypoint `@deslop/web-ui/reset.css`.

## Разработка и проверка

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm --dir web-ui verify
node --test design-system/test/*.test.mjs
node scripts/verify.mjs
```

[AGENTS.md](./AGENTS.md) задаёт общие правила работы внутри репозитория.
