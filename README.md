# deslop

В репозитории лежат скилл [sasha](./sasha/SKILL.md), общие
[Primitives](./primitives/README.md), готовые компоненты для
[Telegram Mini Apps](./mini-app/README.md), инструкции для агентов
[AGENTS.md](./AGENTS.md) и переносимые [анимации](./Animation/).

## primitives

[primitives](./primitives/README.md) — единый набор токенов, шрифтов и иконок
для продуктов.

## mini-apps

[mini-apps](./mini-app/README.md) — библиотека готовых React-компонентов и
Storybook для Telegram Mini Apps.

## sasha

[sasha](./sasha/SKILL.md) — скилл для ИИ-агентов, который помогает писать,
проверять и улучшать русские тексты для интерфейсов. Внутри — правила для
компонентов и ошибок, примеры, типографика и скрипты для поиска и проверки
UI-текстов.

## AGENTS.md

[`AGENTS.md`](./AGENTS.md) задаёт общие правила работы агента: как общаться,
когда действовать самостоятельно, как менять код и проверять результат.

## animation

[animation](./Animation/) — коллекция готовых интерфейсных анимаций.
Пока здесь есть только [Text Appearance](./Animation/text-appearance/SKILL.md): она по очереди проявляет символы текста снизу вверх.

Подключить анимацию можно двумя способами:

- **Как скилл для агента.** Скопируйте папку `text-appearance` в
  `.agents/skills/` своего проекта.

- **Как готовый код для сайта.** Скопируйте файлы
  `assets/waapi/text-appearance.js` и `assets/waapi/text-appearance.css`.
