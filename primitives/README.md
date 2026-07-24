# Deslop Primitives

Внутренний источник цветов, типографики, отступов, радиусов, шрифтов и иконок
для продуктов Deslop. Директория используется соседними пакетами напрямую и
не предназначена для публикации или внешней установки.

Primitives хранят базовые правила. Готовые React-компоненты находятся отдельно
в `@deslop/web-ui` и `@deslop/mini-app`.

## Состав

| Что | Где | Как использовать |
| --- | --- | --- |
| Цвета | `colors.css`, `colors.md`, `tokens.js` | CSS-переменные `--background`, `--elevation`, `--primary`, `--elevation-*`, `--accent-*` и JS-массивы токенов |
| Типографика и шрифты | `typography.css`, `TYPOGRAPHY.md` | CSS-переменные и локальные шрифты SB Sans |
| Отступы и радиусы | `layout.json`, `layout.css`, `layout.js` | CSS-переменные и JS-токены |
| Иконки | `icons/` | SVG размером 24 × 24 с понятными именами. Адаптированы из Иконостаса Ильи Пехтерева |

## Подключение напрямую

Если проект не использует библиотеку компонентов Deslop, подключите слои
Primitives один раз в корневом стиле или entry-файле:

```js
import "@deslop/primitives/colors.css";
import "@deslop/primitives/layout.css";
import "@deslop/primitives/typography.css";
```

`colors.css` выбирает тему ОС автоматически. Для явного переключения задайте `data-color-scheme="light"` или `data-color-scheme="dark"` на `html` либо на корневом контейнере.

Web UI и Mini App разрешают эти внутренние specifier-ы в `../primitives` через
настройки Vite и TypeScript. Отдельная установка пакета не требуется.

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

- В Primitives лежат `--background`, `--elevation`, `--primary`, палитры `--accent-*` и `--elevation-*`. Семантические роли задаёт библиотека компонентов конкретного продукта.
- В Mini App используйте роли из `mini-app/src/styles/theme.css`, в Web UI — shadcn-роли из `web-ui/src/index.css`. Не используйте базовый цвет напрямую внутри компонента, если для него уже есть роль продукта.
- Используйте `--ui-font-interface` для интерфейсного текста и `--ui-font-interface-caps` только для стиля Caption.
- Берите отступы из `--ui-space-*` и `--ui-layout-*`, радиусы — из `--ui-radius-*` и `--ui-component-*-radius`.
- Не добавляйте в компоненты произвольные HEX-цвета, размеры, `border-radius` или другие значения, если для них уже есть токен.
- Используйте иконки из `icons/`; все исходные SVG имеют размер 24 × 24. Не рисуйте системные шевроны символами или CSS-линиями.

## Иконки

Для статического SVG импортируйте конкретный файл. Так сборщик видит только нужную иконку:

```js
import chevronLeft from "@deslop/primitives/icons/chevron-left.svg";
```

Для React-компонентов используйте существующую настройку SVG-трансформации проекта. Не рассчитывайте, что `color: currentColor` перекрасит любой исходный SVG: часть иконок содержит заданные заливки. Проверьте результат в светлой и тёмной теме.

## Изменение токенов

- Цвета меняйте синхронно в `colors.md`, `colors.css` и `tokens.js`.
- Отступы и радиусы меняйте в `layout.json`, затем выполните `npm run tokens:generate`.
- Типографику меняйте синхронно в `TYPOGRAPHY.md`, `typography.css` и `tokens.js`.
- Новые иконки добавляйте только в размере 24 × 24 и с именем в kebab-case.

Перед передачей изменений запускайте:

```bash
npm run check
```

Проверка подтверждает синхронность layout-, color- и typography-токенов и размер SVG-иконок. После этого запустите lint и build самого продукта-потребителя.
