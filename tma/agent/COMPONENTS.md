# Компоненты TMA

Используй этот каталог до написания JSX. Все продуктовые компоненты импортируются
из локальной папки `src/components/tma`.

## Быстрый выбор

| Задача                                  | Компонент                             |
| --------------------------------------- | ------------------------------------- |
| Экран и фон страницы                    | `Page`                                |
| Верхняя панель, заголовок, кнопка назад | `AppBar`, `PanelHeader`               |
| Нижняя навигация                        | `TabBar`                              |
| Вкладки                                 | `Tabs`                                |
| Кнопка                                  | `RegularButton`, `MultilineButton`    |
| Поле ввода или textarea                 | `TextField`                           |
| Переключатель                           | `Switch`                              |
| Сегментированный выбор                  | `SegmentedControl`                    |
| Строка списка или настроек              | `Cell`, `Cells`                       |
| Группа строк                            | `CellStack`, `SectionList`            |
| Выпадающее меню                         | `DropdownMenu`                        |
| Модальное окно или шторка               | `ModalView`                           |
| Всплывающая подсказка                   | `Tooltip`                             |
| Уведомление                             | `Snackbar`                            |
| Загрузка                                | `Skeleton`, `PageSkeleton`, `Spinner` |
| Аватар                                  | `ImageAvatar`, `InitialsAvatar`       |
| Текст                                   | `Text`, `FitText`, `Markdown`         |
| Бейдж                                   | `Badge`                               |
| Галерея                                 | `Gallery`                             |
| Таблица                                 | `Table`                               |
| Выбор из прокручиваемого списка         | `Picker`, `Wheel`                     |

## Каркас приложения

Подключи стили один раз в корневом entry-файле и оберни приложение в провайдер:

```jsx
import "@deslop/tma/styles.css"
import { TMAProvider } from "./components/tma/index.js"

root.render(
    <TMAProvider>
        <App />
    </TMAProvider>
)
```

## Примеры

```jsx
import {
    AppBar,
    Cell,
    Cells,
    Page,
    RegularButton,
    Switch,
    Text,
    TextField,
} from "../components/tma/index.js"

export function ProfilePage() {
    return (
        <Page>
            <AppBar title="Profile" />
            <Cells>
                <Cell end={<Switch />}>
                    <Text>Notifications</Text>
                </Cell>
            </Cells>
            <TextField placeholder="Name" />
            <RegularButton variant="filled" label="Save" />
        </Page>
    )
}
```

## Полный публичный набор

- Каркас и навигация: `TMAProvider`, `Page`, `AppBar`, `PanelHeader`, `TabBar`, `Tabs`, `SplitView`, `PageTransition`, `Link`.
- Действия и ввод: `RegularButton`, `MultilineButton`, `TextField`, `Switch`, `SegmentedControl`, `Picker`, `Wheel`, `DropdownMenu`, `Collapsible`, `Tappable`.
- Контент: `Cell`, `Cells`, `CellStack`, `SectionHeader`, `SectionList`, `Card`, `StoryCard`, `Table`, `Gallery`, `Image`.
- Текст и идентичность: `Text`, `Badge`, `Markdown`, `FitText`, `StreamingText`, `ImageAvatar`, `InitialsAvatar`.
- Оверлеи и обратная связь: `ModalView`, `Tooltip`, `Snackbar`, `SnackbarHost`, `SnackbarProvider`, `Spinner`, `Skeleton`, `PageSkeleton`, `ErrorBoundary`.
- Анимация и оформление: `MotionProvider`, `Morph`, `ParticleEffect`, `GradientBackground`, `GlassContainer`, `GlassBorder`, `Train`.
- Темы: `AppearanceProvider`, `DeviceProvider`, `useAppearance`, `useColorScheme`, `useSkin`.

Исходный код компонентов доступен агенту в `.deslop/tma/source`. Эта папка нужна
только для чтения: рабочие импорты всегда идут через `src/components/tma`.

Если подходящего компонента нет в этом списке, не заменяй его локальной реализацией: сначала зафиксируй запрос на добавление компонента в TMA.
