# Mini App UI Kit

Исходный набор React-компонентов для Telegram Mini Apps. Он не публикуется как
npm-пакет: папки `mini-app` и `primitives` копируются в проект рядом друг с
другом. Адаптировано из библиотеки Ильи Гришина.

```text
project/
├── primitives/
└── mini-app/
```

## Использование

Подключите обязательные стили один раз:

```js
import "./mini-app/styles/index.css"
```

Оберните приложение в provider и импортируйте компоненты напрямую из исходников:

```jsx
import MiniAppProvider from "./mini-app/MiniAppProvider"
import { RegularButton } from "./mini-app/components/Button"

export default function App() {
    return (
        <MiniAppProvider>
            <RegularButton variant="filled" label="Continue" />
        </MiniAppProvider>
    )
}
```

`styles/app-shell.css` подключается отдельно и только когда Mini App занимает
всю страницу: он задаёт стили `body` и safe-area. Для встраивания UI kit в
существующий интерфейс этот файл не нужен.

Сложные компоненты сохранены, поэтому принимающему React-проекту нужны их runtime-
зависимости: `prop-types`, `motion`, `@lisse/core`, `@lisse/react`,
`@tanstack/react-virtual`, `calligraph`, `clsx`, `colorthief`,
`markdown-to-jsx` и `wouter`.

## Storybook

Storybook входит в папку `mini-app/storybook` и копируется вместе с UI kit. Его
`package.json` нужен только для запуска Storybook: он устанавливает сам Storybook,
инструменты проверки и runtime-зависимости, необходимые примерам. Рабочий UI kit
остаётся обычным исходным кодом без собственного пакета и шага сборки.

```bash
cd mini-app/storybook
corepack yarn install --immutable
corepack yarn dev
```

- `storybook/examples/components` — примеры компонентов;
- `storybook/examples/screens` — примеры собранных экранов;
- `storybook/examples/primitives` — цвета, типографика и Material Symbols.

## Документация

- [Каталог компонентов](agent/COMPONENTS.md)
- [Правила для изменений](AGENTS.md)
