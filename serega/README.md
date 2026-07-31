# serega

Два переносимых скилла для посимвольной анимации текста. Внутри каждого —
инструкция для агента, точные параметры и готовый код для браузера.

## Выбрать эффект

- [serega-gentle](./serega-gentle/SKILL.md) — спокойное появление снизу без
  размытия. Подходит для предложений, многострочных заголовков и длинного текста
- [serega-emotional](./serega-emotional/SKILL.md) — выразительное появление с
  подъёмом, размытием, поворотом и мягкой пружиной. Подходит для коротких фраз

Если сомневаетесь, выбирайте `serega-gentle`: он легче для браузера и не
перетягивает внимание на анимацию.

## Подключить к агенту

Скопируйте одну или обе папки в `.agents/skills/` своего проекта:

```text
.agents/skills/
├── serega-gentle/
└── serega-emotional/
```

После этого укажите скилл в запросе к агенту:

```text
Примени $serega-gentle к этому тексту
```

```text
Примени $serega-emotional к этой короткой фразе
```

Если установлены оба скилла, агент выберет эффект по длине текста и правилам
из соответствующего `SKILL.md`.

## Подключить вручную

Для версии без зависимостей скопируйте WAAPI-адаптер нужного эффекта:

- `serega-gentle/assets/waapi/serega-gentle.js` и
  `serega-gentle/assets/waapi/serega-gentle.css`
- `serega-emotional/assets/waapi/serega-emotional.js` и
  `serega-emotional/assets/waapi/serega-emotional.css`

Если в проекте уже есть Motion, для пружинного эффекта можно использовать
`serega-emotional/assets/motion/serega-emotional.js`.

WAAPI-версии работают через встроенный браузерный API анимаций.

## Открыть демо

[Демо](./storybook/) показывает оба эффекта: Gentle для длинного текста и
Emotional для короткой фразы. Нажмите на Серёгу, чтобы перезапустить выбранную
анимацию.

Для локального запуска нужны зависимости из `mini-app/storybook`:

```sh
cd mini-app/storybook
yarn install
cd ../..
mini-app/storybook/node_modules/.bin/vite serega/storybook --host 127.0.0.1 --port 4173
```

Откройте `http://127.0.0.1:4173/serega/storybook/`.
