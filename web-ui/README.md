# Web UI

Библиотека React-компонентов для веб-продуктов. Основана на shadcn/ui и
использует цвета, типографику, отступы, радиусы и иконки из Deslop Primitives.

Базовые палитры берутся из Primitives, а семантические роли shadcn определены в
`src/index.css` с префиксом `--web-*`.

`Background` используется для фона страницы, `Elevation` — для карточек и
всплывающих элементов, `Primary` — для основного текста. В тёмной теме тени
отключены.

Компоненты хранятся в `src/components/ui`, витрина — в `src/storybook`.

## Запуск

```bash
pnpm install
pnpm storybook
```

## Проверка

```bash
pnpm verify
```

## Источник

Компоненты адаптированы из [shadcn/ui](https://github.com/shadcn-ui/ui), MIT.
