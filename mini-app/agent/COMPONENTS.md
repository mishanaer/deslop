# Компоненты Mini App

Используй этот каталог до написания JSX. Исходники компонентов находятся в
`components` этой папки.

## Быстрый выбор

| Задача                                  | Компонент                                         |
| --------------------------------------- | ------------------------------------------------- |
| Экран и фон страницы                    | `Page`                                            |
| Верхняя панель, заголовок, кнопка назад | `AppBar`, `PanelHeader`                           |
| Нижняя навигация                        | `TabBar`                                          |
| Вкладки                                 | `Tabs`                                            |
| Кнопка                                  | `RegularButton`, `MultilineButton`                |
| Поле ввода                              | `TextField`                                       |
| Переключатель                           | `Switch`                                          |
| Сегментированный выбор                  | `SegmentedControl`                                |
| Строка списка или настроек              | `Cell`, `Cells`                                   |
| Группа строк                            | `CellStack`, `SectionList`                        |
| Выпадающее меню                         | `DropdownMenu`                                    |
| Раскрывающийся блок                     | `Collapsible`                                     |
| Модальное окно или шторка               | `ModalView`                                       |
| Всплывающая подсказка                   | `Tooltip`                                         |
| Уведомление                             | `Snackbar`                                        |
| Загрузка                                | `Skeleton`, `PageSkeleton`, `Spinner`             |
| Аватар                                  | `ImageAvatar`, `InitialsAvatar`                   |
| Текст                                   | `Text`, `FitText`, `Markdown`                     |
| Бейдж                                   | `Badge`                                           |
| Галерея                                 | `Gallery`                                         |
| Таблица                                 | `Table`                                           |
| Выбор из прокручиваемого списка         | `Picker`, `Wheel`                                 |

## Каркас приложения

```jsx
import MiniAppProvider from "./mini-app/MiniAppProvider"

root.render(
    <MiniAppProvider>
        <App />
    </MiniAppProvider>
)
```

## Примеры

```jsx
import AppBar from "./mini-app/components/AppBar"
import { RegularButton } from "./mini-app/components/Button"
import { Cell, default as Cells } from "./mini-app/components/Cells"
import Page from "./mini-app/components/Page"
import Switch from "./mini-app/components/Switch"
import Text from "./mini-app/components/Text"
import { TextField } from "./mini-app/components/TextField"

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

## Полный набор

- Каркас и навигация: `MiniAppProvider`, `Page`, `AppBar`, `PanelHeader`, `TabBar`, `Tabs`, `SplitView`, `PageTransition`, `Link`.
- Действия и ввод: `RegularButton`, `MultilineButton`, `TextField`, `Switch`, `SegmentedControl`, `Picker`, `Wheel`, `DropdownMenu`, `Collapsible`, `Tappable`.
- Контент: `Cell`, `Cells`, `CellStack`, `SectionHeader`, `SectionList`, `Card`, `StoryCard`, `Table`, `Gallery`, `Image`.
- Текст и идентичность: `Text`, `Badge`, `Markdown`, `FitText`, `StreamingText`, `ImageAvatar`, `InitialsAvatar`.
- Оверлеи и обратная связь: `ModalView`, `Tooltip`, `Snackbar`, `SnackbarHost`, `SnackbarProvider`, `Spinner`, `Skeleton`, `PageSkeleton`, `ErrorBoundary`.
- Анимация и оформление: `MotionProvider`, `Morph`, `ParticleEffect`, `GradientBackground`, `GlassContainer`, `GlassBorder`, `Train`.
- Темы: `AppearanceProvider`, `DeviceProvider`, `useAppearance`, `useColorScheme`, `useSkin`.

Если подходящего компонента нет в этом списке, не заменяй его локальной реализацией: сначала зафиксируй запрос на добавление компонента в Mini App.
