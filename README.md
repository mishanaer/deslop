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

Подробнее — в [документации design-system](./design-system/README.md).

## Для агентов

- [AGENTS.md](./AGENTS.md) — общие правила работы со всем репозиторием.
- [sasha](./sasha/SKILL.md) — правила работы с русскими текстами в интерфейсе.
