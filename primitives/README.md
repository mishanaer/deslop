# Deslop Primitives

Единый источник цветов, типографики, отступов, радиусов, шрифтов и иконок для веб-продуктов Deslop.

Primitives хранят базовые правила. Готовые React-компоненты находятся отдельно в `@deslop/tma`.

## Состав

| Что | Где | Как использовать |
| --- | --- | --- |
| Цвета | `colors.css`, `colors.md`, `tokens.js` | CSS-переменные `--ui-*` и JS-массивы токенов |
| Типографика и шрифты | `typography.css`, `TYPOGRAPHY.md` | CSS-переменные и локальные шрифты SB Sans |
| Отступы и радиусы | `layout.json`, `layout.css`, `layout.js` | CSS-переменные и JS-токены |
| Иконки | `icons/` | SVG размером 24 × 24 с понятными именами |

## Подключение в веб-проекте

В проекте, где пакет уже доступен как `@deslop/primitives`, подключите слои один раз в корневом стиле или entry-файле:

```js
import "@deslop/primitives/colors.css";
import "@deslop/primitives/layout.css";
import "@deslop/primitives/typography.css";
```

`colors.css` выбирает тему ОС автоматически. Для явного переключения задайте `data-color-scheme="light"` или `data-color-scheme="dark"` на `html` либо на корневом контейнере.

Пакет пока приватный: текущий TMA подключает его локально через `link:../primitives`. Перед установкой в независимый проект нужно выбрать способ распространения — приватный registry, Git-зависимость или монорепозиторий — и отдельно подтвердить право на распространение файлов из `fonts/`.

## Правила применения

- Используйте семантические цвета для интерфейса: `--ui-background`, `--ui-surface`, `--ui-text-primary`, `--ui-text-secondary`, `--ui-separator`.
- Для основной кнопки используйте `--ui-action-primary-background` и `--ui-action-primary-foreground`. Этот токен уже связан с акцентным зелёным цветом в обеих темах.
- Используйте `--ui-font-interface` для интерфейсного текста и `--ui-font-interface-caps` только для стиля Caption.
- Берите отступы из `--ui-space-*` и `--ui-layout-*`, радиусы — из `--ui-radius-*` и `--ui-component-*-radius`.
- Не добавляйте в компоненты произвольные HEX-цвета, размеры, `border-radius` или другие значения, если для них уже есть токен.
- Используйте иконки из `icons/`; все исходные SVG имеют размер 24 × 24. Не рисуйте системные шевроны символами или CSS-линиями.

Минимальный пример:

```css
.primaryButton {
  padding: var(--ui-space-12) var(--ui-space-16);
  border: 0;
  border-radius: var(--ui-component-button-regular-radius);
  background: var(--ui-action-primary-background);
  color: var(--ui-action-primary-foreground);
  font-family: var(--ui-font-interface);
  font-size: var(--ui-body-font-size);
  font-weight: 600;
  line-height: var(--ui-body-line-height);
}
```

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

## Для агентов

В репозитории есть переносимый скилл [deslop-design-system](../skills/deslop-design-system/SKILL.md). Он задаёт рабочий порядок: сначала найти Primitives и подключённые стили, затем использовать токены и проверить обе темы.

Чтобы правило работало в новом продукте, добавьте в его корневой `AGENTS.md` этот блок. Он дополняет другие правила проекта, а не заменяет их:

```md
## Deslop design system

Если пользователь явно не попросил иначе, используй только готовые компоненты
из `@deslop/tma` и токены, шрифты и иконки из `@deslop/primitives`.

Перед созданием компонента проверь `@deslop/tma`. Не создавай в продукте
локальный дубликат существующего компонента. Если нужного компонента нет,
добавь его сначала в `@deslop/tma` на основе Primitives.
```
