# Backlog интеграции Deslop

Живая заметка о проблемах, которые нужно исправлять в оригинальной
дизайн-системе, а не обходить локально в продуктах-потребителях.

## Правило ведения

- Записывать только подтверждённые интеграцией проблемы.
- Для каждой проблемы фиксировать продуктовый эффект, причину, необходимое
  изменение в Deslop и проверяемый критерий готовности.
- Локальный workaround в продукте не считается закрытием проблемы.
- После исправления указывать commit или версию Deslop и переводить пункт в
  статус «Исправлено».

Статусы: `Нужно исправить`, `В работе`, `Исправлено`, `Решение не принято`.

## DS-001. Mini App не оформлен как потребляемый пакет

**Статус:** Исправлено локально, ожидает публикации
**Приоритет:** P0

### Эффект

Продукт не может надёжно подключить `@deslop/mini-app` как обычную зависимость:
точки входа, стили и TypeScript declarations не описаны публичным контрактом.
Интеграция начинает зависеть от внутренней структуры репозитория и ручной
сборки `dist`.

### Причина

В `mini-app/package.json` отсутствуют `exports`, `main`/`module`, `types`,
`style`, `files`, `sideEffects` и peer dependencies React. Library build не
генерирует declarations.

### Что изменить в Deslop

- Описать публичные JS, CSS и type entrypoints.
- Генерировать declarations отдельным `tsconfig.build.json`.
- Объявить React и React DOM peer dependencies согласно реальной матрице
  совместимости.
- Добавить проверку содержимого устанавливаемого package output.

### Готово, когда

Чистый consumer устанавливает пакет без обращения к `src` и импортирует
компоненты, стили и типы только через публичные exports.

## DS-002. Worker публикуется с абсолютным `/assets` URL

**Статус:** Исправлено локально, ожидает публикации
**Приоритет:** P0

### Эффект

Next.js-потребитель не компилируется: сборщик ищет
`/assets/gradientWorker-*.js` в корне приложения, а не внутри пакета.

### Причина

Library build Mini App использует стандартную абсолютную базу Vite. Worker
попадает в `dist/assets`, но ссылка в `dist/index.js` начинается с `/assets`.

### Что изменить в Deslop

Задать относительную базу для library build (`base: "./"`) и сохранить worker
в составе публикуемого package output.

### Готово, когда

Собранный JS содержит относительный URL `assets/gradientWorker-*.js`, файл
присутствует в пакете, а Next.js consumer компилируется без alias и копирования
assets в `public`.

## DS-003. Заявленная поддержка React 18 не определена

**Статус:** Исправлено локально, ожидает публикации
**Приоритет:** P0

### Эффект

Нельзя обещать совместимость Mini App с Memento на React 18: часть компонентов
использует React 19 API (`Activity`, `useEffectEvent`). Даже если основной экран
запускается, импорт или render таких компонентов может упасть позднее.

### Причина

Mini App разрабатывается на React 19, но отдельной матрицы совместимости и
consumer-проверки для пакета нет.

### Что решить в Deslop

Выбрать один контракт:

1. Поддерживать React 18: заменить React 19-only API совместимыми реализациями
   и закрепить `react >=18 <20` в peer dependencies.
2. Поддерживать только React 19: явно закрепить это в peer dependencies и
   документации; React 18-продукты должны обновиться до подключения Mini App.

Для Memento предпочтителен первый вариант: обновление React и Next.js не должно
быть скрытой ценой подключения дизайн-системы.

### Решение

Публичный пакет поддерживает React 18 и 19: peer dependencies закреплены как
`react >=18 <20` и `react-dom >=18 <20`, а React 19-only API удалены из
публичного runtime. Минимальная версия проверяется отдельным React 18 consumer.

### Готово, когда

Версия React в peer dependencies соответствует исходникам, а consumer-тест
рендерит каждый публичный компонент на минимально поддерживаемой версии React.

## DS-004. React Compiler попадает в React 18 library bundle

**Статус:** Исправлено локально, ожидает публикации
**Приоритет:** P0

### Эффект

SSR падает внутри `react/compiler-runtime`: скомпилированные компоненты требуют
runtime React 19, которого нет в React 18 consumer.

### Причина

`vite.lib.config.js` читает общий Babel config с
`babel-plugin-react-compiler`. Один и тот же pipeline используется для
собственного приложения Deslop и распространяемого library bundle.

### Что изменить в Deslop

- Оставить React Compiler для собственного app/storybook build.
- Для совместимого library build использовать стандартный automatic JSX
  transform без `react/compiler-runtime`.

### Готово, когда

В `dist/index.js` нет импорта `react/compiler-runtime` и
`react.memo_cache_sentinel`, а React 18 consumer рендерит provider и базовые
компоненты без runtime error.

## DS-005. Portal-компоненты не поддерживают SSR

**Статус:** Исправлено локально, ожидает публикации
**Приоритет:** P0

### Эффект

Next.js компилирует пакет, но серверный render падает с
`ReferenceError: document is not defined`.

### Причина

`SnackbarHost`, `ModalView`, `DropdownMenu` и `Tooltip` обращаются к
`document.body` во время render без проверки DOM-окружения.

### Что изменить в Deslop

Добавить единый SSR-safe portal primitive или DOM guard и перевести на него все
portal-компоненты. Не размножать разные локальные проверки по компонентам.

### Готово, когда

Provider и все закрытые portal-компоненты проходят `renderToString` без DOM;
после hydration открытые компоненты монтируются в `document.body` и сохраняют
фокус, анимацию и закрытие.

## DS-006. React 18 fixture не проверяет Mini App и SSR

**Статус:** Исправлено локально, ожидает публикации
**Приоритет:** P0

### Эффект

Регрессии DS-002–DS-005 проходят незамеченными: текущий fixture проверяет
TypeScript только для Primitives и прежнего компонентного пакета.

### Причина

`fixtures/react18-consumer` не зависит от `@deslop/mini-app`, не запускает
реальный bundler и не выполняет server render.

### Что изменить в Deslop

- Добавить Mini App в consumer fixture.
- Проверять публичные импорты JS, CSS и types.
- Добавить production build Next.js consumer либо эквивалентный bundler smoke
  test.
- Добавить SSR smoke test для provider и portal-компонентов.
- Проверять наличие и разрешение worker asset.

### Готово, когда

Одна команда воспроизводит установку, typecheck, production bundle и SSR render
на минимально поддерживаемой версии React и падает при возврате любого из
подтверждённых дефектов.

## DS-007. Сборка пакета не является атомарной для dev consumer

**Статус:** Исправлено локально, ожидает публикации
**Приоритет:** P1

### Эффект

Во время пересборки Vite очищает `dist`, а запущенный Next.js consumer временно
получает `ENOENT` на `dist/styles.css`. Это создаёт ложный error overlay и может
оставить dev-приложение в неконсистентном состоянии до полного reload.

### Что изменить в Deslop

Собирать пакет во временную директорию и атомарно заменять готовый `dist` либо
настроить dev consumption напрямую из source с отдельным стабильным CSS
entrypoint.

### Решение

Library build выполняется во временную директорию, валидирует полный output и
публикует файлы атомарным `rename` без предварительной очистки `dist`. Хешированные
assets публикуются раньше entrypoints, а `index.js` — последним; старые assets
сохраняются, поэтому уже загруженный consumer не получает битую ссылку во время
пересборки. Отдельный stress-check непрерывно читает JS, CSS и declarations во
время повторного build.

### Готово, когда

Повторная сборка Mini App при запущенном consumer не создаёт промежутка, в
котором публичные exports отсутствуют.

## DS-008. Проверки `typeof document` недостаточно для hydration

**Статус:** Исправлено локально, ожидает публикации
**Приоритет:** P0

### Эффект

После устранения SSR-crash приложение открывается, но React показывает
hydration error: сервер не рендерит portal, а первый клиентский render сразу
добавляет host-элементы в `body`. Пользователь видит error overlay вместо
интерфейса.

### Причина

DOM guard решает только доступ к `document` на сервере. Он не гарантирует
одинаковую разметку на сервере и во время первого клиентского render.
`SnackbarHost` всегда создаёт верхний и нижний host `<div>` сразу после
появления `document`, даже когда уведомлений нет.

### Что изменить в Deslop

- Создать общий hydration-safe portal primitive.
- На сервере и первом клиентском render возвращать `null`.
- Разрешать `createPortal` только после mount effect.
- Перевести на primitive Snackbar, Modal, Dropdown и Tooltip.

### Готово, когда

Next.js consumer проходит SSR и hydration без warning/error; пустой provider не
добавляет portal hosts до завершения hydration, а последующее открытие каждого
portal-компонента работает штатно.

## DS-009. Интерактивный `Cell` наследует центрирование нативной кнопки

**Статус:** Исправлено локально, ожидает публикации
**Приоритет:** P1

### Эффект

Когда consumer использует штатный API `<Cell as="button">`, заголовок и
описание строки выравниваются по центру вместо принятого в дизайн-системе
выравнивания по началу строки. Один компонент выглядит по-разному в зависимости
от выбранного HTML-элемента.

### Причина

`Cell.module.css` задаёт layout для `.root` и `.body`, но не закрепляет
`text-align`. Нативный `<button>` имеет центрирование текста, которое наследуют
вложенные `Cell.Text`. Вариант с обычным `<div>` этот дефект не показывает.

### Что изменить в Deslop

- Закрепить в корне `Cell` семантическое выравнивание `text-align: start`.
- Проверить направления LTR и RTL.
- Добавить showcase/test для `Cell` как `button` и `a`, а не только как `div`.

### Готово, когда

`Cell.Text` визуально совпадает для `div`, `button` и `a`; в LTR текст
выравнивается влево, в RTL — вправо, без локальных CSS overrides consumer-а.

### Решение

В корне `Cell` добавлено `text-align: start`. Это нейтрализует нативное
центрирование `<button>` и сохраняет корректное направление текста в LTR/RTL.

## DS-010. Mini App использует React 19 API при заявленной поддержке React 18

**Статус:** Исправлено локально, ожидает публикации
**Приоритет:** P0

### Эффект

React 18 consumer не может собрать пакет: `Gallery` и gradient hooks импортируют
`useEffectEvent`, а `GradientBackground` — `Activity`, которых нет в React 18.
Обычный typecheck библиотеки не выявляет несовместимость с peer dependency.

### Причина

Исходники приложения Mini App и публичный library entrypoint разделяют один
runtime-код, но не проверяются на минимальной заявленной версии React.

### Что изменить в Deslop

- Не экспортировать React 19-only API из React 18 package build.
- Использовать совместимые `useCallback` и условный render либо разделить
  React 18/19 entrypoints.
- Закрепить это consumer fixture из DS-006.

### Готово, когда

Пакет собирается и запускается в чистом React 18 consumer, а публичный bundle
не содержит импортов `useEffectEvent`, `Activity` или `react/compiler-runtime`.

## DS-011. Mini App не покрывал desktop-сценарии внутреннего экрана

**Статус:** Решение не принято
**Приоритет:** P1

### Эффект

Продукт, мигрированный на Mini App, вынужден сохранять второй UI kit для
диалогов, checkbox, select, progress, slider, accordion, popover и command
сценариев. В результате главный экран выглядит как Mini App, а внутренняя
страница — как прежний UI kit.

### Причина

В публичном Mini App API не было части controls, необходимых desktop consumer-у,
а существующие `RegularButton`, `TextField`, `Switch` и Snackbar не принимали
стандартные React-события и controlled props.

### Что изменить в Deslop

- Сначала определить продуктовую границу: должны ли desktop controls входить в
  Mini App или жить в отдельном пакете. Автоматический перенос прежних desktop-controls в Mini App
  не считается принятым решением.
- После решения определить точный список компонентов и публичный API.
- Закрепить единый controlled API, клавиатурную доступность и focus management.
- Добавить showcase и interaction tests до публикации.

### Готово, когда

Внутренний экран Memento не импортирует удалённый компонентный пакет, все новые controls
имеют публичные types/showcase/tests, а клавиатурные сценарии и SSR проходят в
React 18 consumer fixture.

## DS-012. Controlled DropdownMenu обращается к удалённому setter

**Статус:** Исправлено локально, ожидает публикации
**Приоритет:** P0

### Эффект

При монтировании `DropdownMenu` приложение падает с
`ReferenceError: Can't find variable: setSelectedItem` и вместо интерфейса
показывает Next.js runtime overlay.

### Причина

При добавлении controlled API состояние было разделено на
`controlledSelectedItem` и `internalSelectedItem`, но effect нормализации
списка сохранил обращение к удалённому `setSelectedItem`.

### Что изменить в Deslop

Нормализовать только внутреннее состояние через `setInternalSelectedItem` и
не пытаться мутировать controlled value. Добавить render test для controlled и
uncontrolled вариантов, включая изменение массива `items`.

### Готово, когда

Оба варианта `DropdownMenu` монтируются и обновляют список без runtime error,
а собранный bundle не содержит `setSelectedItem`.

## Журнал

### 2026-07-28

- Создан backlog по результатам подключения Mini App к Memento.
- Зафиксированы ошибки package contract, worker assets, React 18/19, React
  Compiler, SSR portals, consumer fixture и неатомарной dev-сборки.
- Отдельно зафиксирована hydration-регрессия: простой DOM guard не обеспечивает
  совпадение первого серверного и клиентского render portal-компонентов.
- Зафиксировано расхождение интерактивного `Cell`: нативное центрирование
  `<button>` протекает внутрь компонента из-за отсутствия `text-align: start`.
- Интеграционные исправления worker/React/SSR пока существуют в vendored-копии
  Deslop внутри Memento; исправление `Cell` внесено также в исходный Deslop, но
  ещё не опубликовано.
- Зафиксированы React 19-only API в React 18 package build и нехватка desktop
  controls, из-за которой внутренняя страница Memento оставалась на прежнем UI kit.
- Исправлен stale setter в controlled `DropdownMenu`; дефект проявлялся только
  во время render и не обнаруживался typecheck или library build.
- Mini App оформлен как публичный package: добавлены exports, CSS/types
  entrypoints, declarations, peer dependencies и проверка содержимого `dist`.
- Выбран контракт React 18–19; library build отключает React Compiler и не
  содержит `Activity`, `useEffectEvent` или `react/compiler-runtime`.
- Portal-компоненты переведены на единый hydration-safe primitive. React 18
  fixture проверяет SSR, hydration и последующее открытие Snackbar, Modal,
  Dropdown и Tooltip.
- Consumer fixture теперь устанавливает packed Primitives и Mini App, выполняет
  typecheck и production build, а также проверяет worker как отдельный asset
  либо корректно встроенный bundler-ом URL.
- Стабильная library-сборка больше не очищает `dist`: временный output
  валидируется и публикуется пофайловым atomic rename, а stress-check не
  обнаруживает пропажи публичных entrypoints во время rebuild.
- Экспериментальный перенос desktop controls в Mini App и сопутствующие
  изменения `RegularButton` откатили: граница DS-011 требует отдельного
  продуктового решения.
