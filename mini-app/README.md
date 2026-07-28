# Mini App

Публичная библиотека React-компонентов для Telegram Mini Apps. Поддерживает
React 18 и 19; общие токены, шрифты и Material Symbols поставляет
`@deslop/primitives`.

## Подключение

```jsx
import "@deslop/mini-app/styles.css"

import { MiniAppProvider, Page, RegularButton } from "@deslop/mini-app"

export function App() {
    return (
        <MiniAppProvider>
            <Page>
                <RegularButton label="Продолжить" />
            </Page>
        </MiniAppProvider>
    )
}
```

Не импортируй файлы из `src`: JavaScript, CSS и declarations доступны только
через публичные exports пакета.

## Разработка

Из корня монорепозитория:

```bash
(cd mini-app && corepack yarn install --immutable)
(cd mini-app && corepack yarn dev)
```

## Проверка и сборка

```bash
(cd mini-app && corepack yarn lint)
(cd mini-app && corepack yarn verify)
```

Каталог компонентов: [agent/COMPONENTS.md](agent/COMPONENTS.md). Правила для
изменений библиотеки: [AGENTS.md](AGENTS.md).
