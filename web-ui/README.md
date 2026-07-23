# Web UI

Библиотека React-компонентов для веб-продуктов. Основана на shadcn/ui и
использует цвета, типографику, отступы, радиусы и иконки из Deslop Primitives.

Базовые палитры берутся из Primitives, а семантические роли shadcn определены в
`src/index.css` с префиксом `--web-*`. Компоненты используют готовые значения
Primitives без локальных палитр и производных оттенков.

`Background` используется для фона страницы, `Elevation` — для карточек и
всплывающих элементов, `Elevation 5` — для нейтральных hover-состояний,
`Primary` — для основного текста. В тёмной теме тени отключены.

Базовые компоненты хранятся в `src/components/ui`, готовые композиции — в
`src/components/blocks`, графики — в `src/components/charts`. Витрина находится
в `src/storybook`. `ImageAvatar`, `InitialsAvatar` и `Badge` адаптированы из
библиотеки TMA.

```tsx
import { DashboardBlock } from "@deslop/web-ui/blocks/dashboard"
import { ChartAreaInteractive } from "@deslop/web-ui/charts/area"
```

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
