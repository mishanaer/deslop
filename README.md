# deslop

В репозитории лежат скилл [sasha](./sasha/SKILL.md), общие
[Primitives](./primitives/README.md), готовые компоненты для
[Telegram Mini Apps](./mini-app/README.md), инструкции для агентов
[AGENTS.md](./AGENTS.md) и [Серёга](./serega/) — готовые анимации текста

## primitives

[primitives](./primitives/README.md) — набор базовых цветов, шрифтов и иконок. Подходит для веба, мобилы и мини-аппов

## mini-apps

[mini-apps](./mini-app/README.md) — библиотека готовых React-компонентов для Telegram Mini Apps. Сделано на основе библиотеки Ильи Гришина

## sasha

[sasha](./sasha/SKILL.md) — скилл для ИИ-агентов, который помогает писать,
проверять и улучшать русские тексты для интерфейсов. Внутри — правила для
компонентов и ошибок, примеры, типографика и скрипты для поиска и проверки
UI-текстов

## AGENTS.md

[`AGENTS.md`](./AGENTS.md) задаёт общие правила работы агента: как общаться,
когда действовать самостоятельно, как менять код и проверять результат

## serega

[serega](./serega/) — два переносимых скилла для посимвольного появления
текста:

- [serega-gentle](./serega/serega-gentle/SKILL.md) — спокойный вариант для
  предложений, многострочных заголовков и длинного текста
- [serega-emotional](./serega/serega-emotional/SKILL.md) — выразительный
  вариант для коротких фраз

Скопируйте нужную папку в `.agents/skills/` проекта. Подробнее — в
[README Серёги](./serega/README.md).
