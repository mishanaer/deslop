# Web UI

Библиотека React-компонентов для веб-продуктов Deslop. Продукты подключают
собранный пакет; Tailwind нужен для разработки библиотеки, но не потребителю.

## Подключение в продукте

Подключите стили компонентов один раз в корневом entry-файле:

```ts
import "@deslop/web-ui/styles.css"
```

Этот entrypoint не содержит Tailwind Preflight и не сбрасывает стили страницы.
Для нового приложения сброс можно подключить явно до основных стилей:

```ts
import "@deslop/web-ui/reset.css"
import "@deslop/web-ui/styles.css"
```

`styles.css` собран Tailwind CSS 4. Хотя Preflight вынесен отдельно, utility-
селекторы и служебные custom properties Tailwind пока не namespaced. Поэтому
не подключайте этот entrypoint вместе с полной Tailwind CSS 3-сборкой продукта:
это неподдерживаемая комбинация, которую интеграционный doctor должен отклонять.

Компоненты импортируются через публичные subpath-ы без внутреннего сегмента
`ui`:

```ts
import { Button } from "@deslop/web-ui/components/button"
import { Toaster } from "@deslop/web-ui/components/sonner"
import { toast } from "@deslop/web-ui/toast"
```

Пакет поддерживает React 18 и 19. `message-scroller` использует опциональный
peer dependency `@shadcn/react`, которому требуется React 19; устанавливайте
его только если продукт импортирует этот компонент.

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
