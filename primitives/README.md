# Deslop Primitives

Источник цветов, типографики, отступов, радиусов, шрифтов и иконок для
продуктов Deslop. Продукты подключают версионированный пакет, не исходники
соседней директории.

Primitives хранят базовые правила. Готовые React-компоненты находятся отдельно
в `@deslop/mini-app`.

## Состав

| Что | Где | Как использовать |
| --- | --- | --- |
| Цвета | `colors.css`, `colors.md`, `tokens.js` | CSS-переменные `--white`, `--black`, `--background-primary`, `--background-secondary`, `--primary`, `--primary-*`, `--accent-*` и JS-массивы токенов |
| Типографика и шрифты | `typography.css`, `TYPOGRAPHY.md` | CSS-переменные и локальные шрифты SB Sans |
| Отступы и радиусы | `layout.json`, `layout.css`, `layout.js` | CSS-переменные и JS-токены |
| Иконки | `material-symbols.css`, `material-symbols.json` | Self-hosted Material Symbols Rounded и одобренный набор имён. Исходник — Google Material Symbols |

## Подключение

Если проект не использует библиотеку компонентов Deslop, подключите слои
Primitives один раз в корневом стиле или entry-файле:

```js
import "@deslop/primitives/colors.css";
import "@deslop/primitives/layout.css";
import "@deslop/primitives/typography.css";
```

`colors.css` выбирает тему ОС автоматически. Для явного переключения задайте `data-color-scheme="light"` или `data-color-scheme="dark"` на `html` либо на корневом контейнере.

Mini App использует эти же публичные пути пакета.

## Внутри Mini App

Mini App уже подключает Primitives через `src/styles/tailwind.css`. В компонентах
используйте семантические Tailwind-классы, а не прямые импорты и не новые CSS
Modules:

```jsx
<section className="rounded-section bg-background p-content text-foreground">
  <button className="rounded-button bg-action-primary px-20 py-12 text-on-action">
    Продолжить
  </button>
</section>
```

Полный порядок работы описан в [Mini App README](../mini-app/README.md#стили).

## Правила применения

- В Primitives лежат постоянные `--white` и `--black`, тематические `--background-primary`, `--background-secondary`, `--primary`, палитры `--accent-*` и `--primary-*`. Старые `--background`, `--surface` и `--elevation-4…90` временно сохранены как алиасы для Mini Apps. Семантические роли задаёт библиотека компонентов конкретного продукта.
- Компоненты Mini App используют цветовые токены Primitives напрямую. В `mini-app/src/styles/theme.css` остаются только продуктовые роли, которым недостаточно одного токена (например, story и heatmap).
- Используйте `--ui-font-interface` для интерфейсного текста и `--ui-font-interface-caps` только для стиля Caption.
- Берите отступы из `--ui-space-*` и `--ui-layout-*`, радиусы — из `--ui-radius-*` и `--ui-component-*-radius`.
- Не добавляйте в компоненты произвольные HEX-цвета, размеры, `border-radius` или другие значения, если для них уже есть токен.
- Используйте `MaterialSymbol` из Primitives. Не подключайте Lucide, локальные SVG или Google Fonts CDN напрямую.

## Иконки

Один раз подключите self-hosted font stylesheet в корне приложения:

```css
@import "@deslop/primitives/material-symbols.css";
```

Используйте универсальный React-компонент. Все четыре оси Material Symbols
доступны через props:

```tsx
import { MaterialSymbol } from "@deslop/primitives/material-symbols-react";

<MaterialSymbol name="chevron_left" aria-label="Назад" />
<MaterialSymbol
  name="favorite"
  fill
  weight={500}
  grade={100}
  opticalSize={24}
/>
```

По умолчанию используются `fill={false}`, `weight={400}`, `grade={0}` и
`opticalSize`, равный числовому `size`. Цвет наследуется через `currentColor`.
`materialSymbolNames` содержит одобренный базовый набор и одновременно является
типом допустимых имён. Это гарантирует, что glyph действительно входит в
self-hosted font subset.

Старые SVG и путь `icons-react` временно сохранены как совместимый слой. Новый
код должен использовать `material-symbols-react`; SVG больше не являются
каноническим источником иконок.

## Изменение токенов

- Цвета меняйте синхронно в `colors.md`, `colors.css` и `tokens.js`.
- Отступы и радиусы меняйте в `layout.json`, затем выполните `npm run tokens:generate`.
- Типографику меняйте синхронно в `TYPOGRAPHY.md`, `typography.css` и `tokens.js`.
- Новую иконку сначала ищите в Material Symbols. Если она нужна нескольким
  продуктам, добавьте ligature-имя в `material-symbols.json` и обновите React API
  вместе с font subset командой `npm run icons:generate`.

Перед передачей изменений запускайте:

```bash
npm run check
```

Проверка подтверждает синхронность токенов, Material Symbols registry и React
API. После этого запустите lint и build самого продукта-потребителя.
