# deslop

Deslop — компоненты и визуальные примитивы для Telegram Mini Apps.

## Состав

- [`@deslop/primitives`](./primitives/) — токены, шрифты и self-hosted
  Material Symbols с типизированным React API.
- [`@deslop/mini-app`](./mini-app/) — готовые компоненты и правила для Telegram
  Mini Apps с публичными JavaScript, CSS и TypeScript entrypoints.

## Storybook

```bash
corepack yarn --cwd mini-app install --immutable
corepack yarn --cwd mini-app dev
```

## Правила и навык микрокопии

- [Общие правила для агентов](./AGENTS.md)
- [Правила и каталог Mini App](./mini-app/agent/AGENTS.md)
- [Навык Sasha](./sasha/SKILL.md)

## Проверка

```bash
corepack yarn --cwd mini-app lint
corepack yarn --cwd mini-app build
npm --prefix primitives run check
```
