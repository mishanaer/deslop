# deslop

В репозитории лежат скилл [sasha](./sasha/SKILL.md), общие
[Primitives](./primitives/README.md), готовые компоненты для
[Telegram Mini Apps](./mini-app/README.md), инструкции для агентов
[AGENTS.md](./AGENTS.md) и готовые [анимации](./animation/)

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

## animation

[animation](./animation/) — два переносимых скилла с готовыми анимациями
появления текста:

- [soft-appearance](./animation/soft-appearance/SKILL.md) — основной вариант
  для предложений и длинного текста
- [spring-appearance](./animation/spring-appearance/SKILL.md) — акцентный вариант
  для короткой фразы, лучше `2–4` слова и не больше одного
  короткого предложения

Скопируйте нужную папку в `.agents/skills/` проекта. Подробнее — в
[описании анимаций](./animation/README.md).
