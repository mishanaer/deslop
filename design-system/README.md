# Deslop Design System CLI

CLI превращает подключение Deslop в проверяемый workflow для агента:

```text
doctor → migrate → audit --strict
```

Пакет не меняет проект во время диагностики. Миграция меняет только импорты,
для которых в поставляемом registry есть однозначное соответствие. Всё остальное
попадает в список ручной проверки.

## Запуск

```bash
npx @deslop/design-system doctor --cwd ./product
npx @deslop/design-system migrate --cwd ./product --dry-run
npx @deslop/design-system migrate --cwd ./product
npx @deslop/design-system audit --cwd ./product --strict
```

Для локальной разработки:

```bash
node ./bin/deslop.mjs doctor --cwd ../product
node --test
```

Требуется Node.js 20 или новее. У CLI нет runtime-зависимостей.

## `doctor`

Команда читает `package.json`, конфигурационные файлы и runtime-исходники. Она
определяет:

- package manager, React и React DOM;
- Next, Vite, Tauri;
- Tailwind и PostCSS вместе с версиями и конфигурацией;
- Radix, Lucide, Sonner, cmdk и другие UI-зависимости;
- локальные UI-импорты, нативные HTML-контролы и hardcoded-цвета;
- возможные столкновения общих CSS-переменных и глобальных reset-слоёв.

Полная компонентная миграция проекта на Tailwind 3 блокируется: текущий Web UI
использует непрефиксованные Tailwind 4 utility-селекторы. Агент должен сначала
обновить CSS pipeline либо ограничиться Primitives и явно считать этап
неполной миграцией.

По умолчанию JSON-план печатается в stdout и файлов не создаёт:

```bash
deslop doctor > deslop-plan.json
```

Запись выполняется только по явному запросу:

```bash
deslop doctor --output deslop-plan.json
```

## `migrate`

Перед изменениями всегда полезно запустить dry-run:

```bash
deslop migrate --dry-run --json
```

Встроенный `registry/migrations.json` безопасно преобразует:

- известные alias-импорты `@/components/ui/*` в
  `@deslop/web-ui/components/*`;
- однозначно сопоставленные Lucide-иконки в
  `@deslop/primitives/icons-react`;
- `toast` и `Toaster` из Sonner в Deslop entrypoints.

Неизвестные иконки, сложные import-выражения и незарегистрированные локальные
компоненты остаются без изменений и выводятся в `reviewItems`. Повторный запуск
идемпотентен. Альтернативный registry можно передать через `--registry <file>`.

## `audit`

```bash
deslop audit --strict
deslop audit --strict --json --allowlist ./deslop-allowlist.json
```

В strict-режиме CLI возвращает ненулевой exit code, пока в проекте остаются
нарушения. Allowlist предназначен только для обоснованных продуктовых
исключений, а не для массового отключения правил.

Пример точечного исключения для продуктовой визуализации:

```json
{
  "allow": [
    {
      "rule": "native-control",
      "file": "src/components/AudioWaveform.tsx",
      "reason": "Интерактивная аудиовизуализация не является generic UI control",
      "owner": "audio",
      "expires": "2026-12-31"
    }
  ]
}
```

Обязательны `rule`, `file` и содержательная `reason`; `line`, `match`, `owner`
и `expires` сужают область исключения.

## Текущие границы

- Миграция намеренно не переписывает JSX и CSS без AST/CSS parser.
- Relative-импорты локальных компонентов требуют ручной проверки.
- Registry содержит только подтверждённые соответствия; неполное покрытие —
  ожидаемый review-item, а не повод угадывать ближайший компонент.
