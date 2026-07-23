# deslop

Библиотека компонентов и правила для агентской разработки

## design-system

[design-system](./design-system/README.md) устанавливает дизайн-систему одной
командой:

```bash
npx @deslop/design-system setup
```

Команда предложит выбрать веб-продукт или Telegram Mini App и подключит
Primitives, нужные компоненты, правила для агента и локальные проверки.

## AGENTS.md

[AGENTS.md](./AGENTS.md) задаёт общие правила работы агента: как общаться,
действовать самостоятельно, менять код и проверять результат

## primitives

[primitives](./primitives/README.md) — набор базовых элементов: цветов,
шрифтов, отступов, скруглений и иконок

## web-ui

[web-ui](./web-ui/README.md) — библиотека React-компонентов для веб-продуктов.
Команда `npx @deslop/web-ui setup` переносит компоненты и правила для агентов
прямо в продуктовый проект

## mini-apps

[mini-apps](./mini-app/README.md) — библиотека готовых React-компонентов для Telegram Mini
Apps. Команда `npx @deslop/mini-app setup` переносит компоненты и правила для агентов
прямо в продуктовый проект

Сделана на основе проекта
[wallet_animations](https://github.com/IlyaGrshin/wallet_animations) Ильи Гришина

## sasha

[sasha](./sasha/SKILL.md) — скилл для ИИ-агентов, который помогает писать,
проверять и улучшать русские тексты в интерфейсе
