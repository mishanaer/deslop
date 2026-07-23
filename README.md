# deslop

Дизайн-система для веб-продуктов и Telegram Mini Apps.

## Подключение

Запустите одну команду в папке проекта:

```bash
npx @deslop/design-system setup
```

Выберите тип продукта — веб или Telegram Mini App. Установщик подключит
Primitives, нужные компоненты, правила для агента и локальные проверки.

Тип продукта можно указать сразу:

```bash
npx @deslop/design-system setup --web
npx @deslop/design-system setup --mini-app
```

## Состав

- [AGENTS.md](./AGENTS.md) — общие правила работы агента.
- [sasha](./sasha/SKILL.md) — правила работы с русскими текстами в интерфейсе.

Компоненты Mini Apps сделаны на основе проекта
[wallet_animations](https://github.com/IlyaGrshin/wallet_animations) Ильи Гришина.
