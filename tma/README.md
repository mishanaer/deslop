# TMA

TMA — библиотека React-компонентов для Telegram Mini Apps. Цвета, шрифты, отступы
и иконки берутся из `@deslop/primitives`.

## Запуск

Требования: Node.js 20.19+ или 22.12+, Yarn 4.5.3.

```bash
cd tma
yarn install --immutable
yarn dev
```

## Стили

Базовые палитры берутся из Primitives. Семантические роли TMA определены в
`src/styles/theme.css` и подключены к Tailwind в `src/styles/tailwind.css`.

`Background` используется для фона страницы, `Elevation` — для карточек и
подложек, `Primary` — для основного текста. В тёмной теме тени отключены.

## Проверка

Запустите из корня репозитория:

```bash
npm run verify
```

Команда проверяет Primitives, код и стили, затем собирает витрину и библиотеку.

Правила работы с TMA: [AGENTS.md](AGENTS.md)
