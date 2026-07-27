# Компоненты Web UI

Используй этот каталог до написания JSX. Исходники компонентов находятся в
`src/components` этого пакета.

## Быстрый выбор

| Задача | Модуль |
| --- | --- |
| Кнопка или группа кнопок | `ui/button`, `ui/button-group` |
| Поле, textarea или подпись | `ui/input`, `ui/textarea`, `ui/field`, `ui/label` |
| Выбор значения | `ui/checkbox`, `ui/radio-group`, `ui/select`, `ui/combobox` |
| Переключатель или сегменты | `ui/switch`, `ui/toggle`, `ui/toggle-group`, `ui/tabs` |
| Дата | `ui/calendar` |
| Карточка, строка или пустое состояние | `ui/card`, `ui/item`, `ui/empty` |
| Аватар или статус | `ui/avatar`, `ui/badge` |
| Таблица | `ui/table` |
| Меню и навигация | `ui/dropdown-menu`, `ui/context-menu`, `ui/navigation-menu`, `ui/sidebar` |
| Модальное окно или шторка | `ui/dialog`, `ui/alert-dialog`, `ui/drawer`, `ui/sheet` |
| Подсказка или поповер | `ui/tooltip`, `ui/hover-card`, `ui/popover` |
| Загрузка и обратная связь | `ui/spinner`, `ui/skeleton`, `ui/progress`, `ui/alert`, `ui/sonner` |
| Готовый дашборд | `blocks/dashboard` |
| Готовый сайдбар | `blocks/sidebar` |
| Вход и регистрация | `blocks/login`, `blocks/signup` |
| Area chart | `charts/area` |

## Импорты внутри пакета

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function ProfileForm() {
  return (
    <Card>
      <Input placeholder="Name" />
      <Button>Save</Button>
    </Card>
  )
}
```

## Иерархия фонов

- `Background Primary` — базовый фон страницы Web UI.
- `Background Secondary` — только Sidebar в Web UI. В Telegram Mini Apps и нативных
  мобильных приложениях этот токен используется как основной фон.
- `Primary 4` — карточки, поля, контролы, неактивный фон Switch, выбранные,
  hover- и другие нейтральные вложенные состояния.
- `Primary 5` — фон Checkbox и Radio Group в нейтральном состоянии.
- `White` — статический цвет пипки Switch, не меняется вместе с темой.
- Активный фон Switch — текущий accent темы через `bg-primary`.
- `Elevation 1` — непрозрачный фон модальных поверхностей: `Dialog`,
  `Alert Dialog`, `Sheet` и `Drawer`.
- `Elevation 2` — фон активного таба и элемента Toggle Group, раскрытой панели `Combobox` и
  поверхностей `Context Menu`, `Dropdown Menu`, `Menubar`, `Navigation Menu`,
  `Popover`, `Select`, `Sonner` и `Hover Card`.
- `Primary 8` — все нейтральные stroke: границы, разделители и rings. Цветные
  stroke используются только для смысловых состояний.

`Card` всегда размещается непосредственно на `Background Primary`. Не помещай карточку
на `Background Secondary`, другую карточку или иной слой: одинаковые полупрозрачные
заливки складываются и нарушают заданную визуальную иерархию.

Выбирай семантический класс компонента (`bg-background`, `bg-card`, `bg-input`,
`bg-sidebar-surface`, `bg-accent`), а не обращайся к raw-токену напрямую.

В `Sidebar` используй `Background Secondary` для самой панели, `Background Primary`
для `SidebarInset`, `Primary 4` для полей и активных пунктов, `Primary 8` для stroke.

## Полный набор модулей

- Ввод: `accordion`, `button`, `button-group`, `calendar`, `checkbox`, `collapsible`, `combobox`, `field`, `form`, `input`, `input-group`, `input-otp`, `label`, `native-select`, `radio-group`, `select`, `slider`, `switch`, `textarea`, `toggle`, `toggle-group`.
- Навигация: `breadcrumb`, `command`, `menubar`, `navigation-menu`, `pagination`, `sidebar`, `tabs`.
- Оверлеи: `alert-dialog`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `hover-card`, `popover`, `sheet`, `tooltip`.
- Обратная связь: `alert`, `empty`, `progress`, `skeleton`, `sonner`, `spinner`.
- Данные: `attachment`, `avatar`, `badge`, `bubble`, `chart`, `item`, `kbd`, `marker`, `message`, `message-scroller`, `table`.
- Раскладка: `aspect-ratio`, `card`, `carousel`, `direction`, `resizable`, `scroll-area`, `separator`.
- Готовые блоки: `blocks/dashboard`, `blocks/sidebar`, `blocks/login`, `blocks/signup`.
- Графики: `charts/area`.

Если подходящего компонента нет, не заменяй его локальной реализацией: сначала
