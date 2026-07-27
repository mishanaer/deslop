# Web UI

Библиотека React-компонентов для веб-продуктов Deslop. Общие токены, шрифты и
иконки берутся из `@deslop/primitives`. Репозиторий Deslop остаётся источником
истины, а продукты подключают собранную версию пакета.

## Подключение в продукте

Подключите общие стили один раз в корневом entry-файле:

```ts
import "@deslop/web-ui/styles.css"
```

Компоненты импортируются по публичным subpath-ам:

```ts
import { Button } from "@deslop/web-ui/components/ui/button"
```

Пакет поддерживает React 18 и 19. Компонент `message-scroller` пока является
исключением: его типы требуют `@shadcn/react` и React 19. Остальные публичные
subpath-импорты не зависят от него.

## Разработка

Из корня монорепозитория:

```bash
(cd web-ui && corepack pnpm install --frozen-lockfile)
(cd web-ui && corepack pnpm dev)
```

## Проверка и сборка

```bash
(cd web-ui && corepack pnpm verify)
(cd web-ui && corepack pnpm build)
```

Каталог компонентов: [agent/COMPONENTS.md](agent/COMPONENTS.md). Правила для
изменений библиотеки: [AGENTS.md](AGENTS.md).

Компоненты адаптированы из [shadcn/ui](https://github.com/shadcn-ui/ui), MIT.
