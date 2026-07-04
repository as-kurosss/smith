# Project Rules

## Документация инструментов

Спецификации реализованных инструментов находятся в `docs/design/<tool-name>/specification.md`:
- `docs/design/windows-process/specification.md` -- управление процессами
- `docs/design/windows-find/specification.md` -- поиск UI-элементов
- `docs/design/windows-click/specification.md` -- клик по элементу

При генерации нового инструмента создавай specification по шаблону `docs/templates/specification-template.md`.

## Поиск по коду

Для навигации по кодовой базе используй комбинацию инструментов:

- **ast-index** (${\textsf{\color{green}установлен}}$) — быстрый структурный поиск символов, файлов, использований
- **graphify-rs** (${\textsf{\color{green}установлен}}$) — архитектурный анализ: граф зависимостей, связи модулей
- **codebase_semantic_search** (${\textsf{\color{orange}встроенный в Oz}}$) — семантический поиск по смыслу
- **grep** (${\textsf{\color{orange}встроенный в Oz}}$) — regex и точный строковый поиск

**Иерархия использования:**
1. `ast-index` — структурный поиск (символы, реализация трейта, использования, кто вызывает)
2. `graphify-rs` — архитектурный анализ (связи модулей, граф зависимостей, высокоуровневые вопросы)
3. `codebase_semantic_search` — если не знаешь точного имени или ищешь по смыслу/концепции (ast-index и graphify-rs такого не умеют)
4. `grep` — если ast-index вернул пусто, или нужен regex/поиск по строковому паттерну
5. Перед чтением файла >500 строк — сначала `ast-index outline <file>`

### Поддержание индекса ast-index

```bash
# Проверить, что индекс актуален
ast-index stats

# После git pull/checkout/switch
ast-index update
```

### Основные команды ast-index

**Поиск:**
- `ast-index search "<запрос>"` -- универсальный поиск
- `ast-index file "<паттерн>"` -- поиск файлов
- `ast-index symbol "<имя>"` -- найти определение символа
- `ast-index class "<имя>"` -- найти класс/структуру
- `ast-index outline <файл>` -- структура файла (перед чтением больших файлов)

**Использования и вызовы:**
- `ast-index usages "<символ>"` -- все использования символа
- `ast-index callers "<функция>"` -- кто вызывает функцию
- `ast-index refs "<символ>"` -- перекрестные ссылки
- `ast-index implementations "<трейт>"` -- реализации интерфейса
- `ast-index hierarchy "<класс>"` -- дерево иерархии
- `ast-index call-tree "<функция> -d 3"` -- дерево вызовов

**Модули:**
- `ast-index deps "<модуль>"` -- зависимости модуля
- `ast-index dependents "<модуль>"` -- кто зависит от модуля

**Качество кода:**
- `ast-index todo` -- все TODO/FIXME/HACK
- `ast-index deprecated` -- устаревшие элементы
- `ast-index changed` -- что изменилось в текущей ветке

### Примеры для smith-automation

```bash
# Поиск всех реализаций трейта Tool
ast-index implementations "Tool"

# Где используется ExecutionContext
ast-index usages "ExecutionContext"

# Кто вызывает execute
ast-index callers "execute"

# Структура файла перед чтением
ast-index outline crates/smith-core/src/registry.rs

# Зависимости модуля
ast-index deps "smith-windows"
```

### Правила для суб-агентов

При запуске суб-агента для поиска по коду передавай инструкцию:
```
Search hierarchy (use in this order):

1. Structural search:
   ast-index search "query"           -- universal search
   ast-index file "Name"              -- find a file
   ast-index symbol "Name"            -- find a symbol definition
   ast-index usages "Name"            -- all usages of a symbol
   ast-index implementations "Trait"  -- implementations
   ast-index callers "func"           -- who calls this function
   ast-index outline <file>            -- file structure before reading

2. Architecture queries:
   graphify-rs query --graph <path>   -- knowledge graph questions

3. Semantic search (when you don't know exact names):
   codebase_semantic_search           -- search by concept/meaning

4. Regex/string search (if ast-index returns empty):
   grep "<pattern>"                    -- regex/string search
```

## graphify-rs

Используй утилиту `graphify-rs` для построения графа знаний проекта.

### Генерация графа

Команда:
```bash
graphify-rs build --no-llm --output ./smith-graphify
```

### Артефакты

- `smith-graphify/graph.json` — граф в формате JSON (узлы, рёбра, сообщества)
- `smith-graphify/GRAPH_REPORT.md` — аналитический отчёт по графу

### Интеграция с smith-context

Утилита `smith-context` автоматически загружает артефакты graphify-rs при флаге `--graphify`:
```bash
cargo run -p smith-context -- --graphify
```

### Запросы к графу

Задавай вопросы по архитектуре проекта через:
```bash
graphify-rs query --graph ./smith-graphify/graph.json "<вопрос>"
```

Примеры:
```bash
graphify-rs query --graph ./smith-graphify/graph.json "how does auth work?"
graphify-rs query --graph ./smith-graphify/graph.json "какие модули зависят от smith-core?"
graphify-rs query --graph ./smith-graphify/graph.json "что делает ExecutionContext?"
```

### Установка

Если `graphify-rs` не установлен:
```bash
cargo install graphify-rs
```

## Excluded from context

Директория `apps/smith-context` исключена из контекста. AI-агентам и инструментам анализа кода запрещено читать, анализировать или модифицировать файлы в `apps/smith-context`. Этот пакет является независимой утилитой для сбора контекста и не является частью основной кодовой базы автоматизации.

## Git commits

Не добавлять `Co-Authored-By` в сообщения коммитов. Атрибуция не требуется.
