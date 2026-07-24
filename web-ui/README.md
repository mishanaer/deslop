# Web UI

Внутренняя библиотека React-компонентов для веб-продуктов Deslop. Общие
токены, шрифты и иконки подключаются напрямую из соседней директории
`../primitives`; пакет не устанавливается во внешние репозитории.

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
