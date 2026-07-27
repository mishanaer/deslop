## Web UI

- Сначала используй существующий компонент из `src/components/ui`.
- Цвета, типографику, отступы и радиусы бери только из семантических классов,
  связанных с `@deslop/primitives` в `src/index.css`.
- Для фона страницы используй `Background Primary`, для Sidebar — `Background Secondary`, а для
  карточек, полей, контролов и нейтральных состояний — `Primary 4` через
  семантические классы. `Primary 5` используй только для нейтральных Checkbox и
  Radio Group.
- Для `Dialog`, `Alert Dialog`, `Sheet` и `Drawer` используй непрозрачный `Elevation 1`
  через `bg-modal`.
- Для всех нейтральных stroke используй `Primary 8`; цветные stroke допустимы
  только для смысловых состояний, например destructive.
- Размещай `Card` только на `Background Primary`, не на `Background Secondary`
  или другом слое.
- Иконки импортируй из `@/lib/icons`. Если иконки нет, сначала добавь её в
  `@deslop/primitives`.
- Не добавляй палитру Tailwind, произвольные цвета и `lucide-react`.
- Перед завершением изменений запускай `pnpm verify` из папки `web-ui`.
