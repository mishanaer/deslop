# Mini App

Внутренняя библиотека React-компонентов для Telegram Mini Apps. Общие токены,
шрифты и иконки подключаются напрямую из соседней директории `../primitives`;
пакет не устанавливается во внешние репозитории.

## Разработка

Из корня монорепозитория:

```bash
(cd mini-app && corepack yarn install --immutable)
(cd mini-app && corepack yarn dev)
```

## Проверка и сборка

```bash
(cd mini-app && corepack yarn lint)
(cd mini-app && corepack yarn build)
```

Каталог компонентов: [agent/COMPONENTS.md](agent/COMPONENTS.md). Правила для
изменений библиотеки: [AGENTS.md](AGENTS.md).
