---
name: graphify-rs
description: Use this skill when working with the smith-automation codebase to analyze architecture, find dependencies between modules, locate implementations, understand component relationships, or answer questions about project structure via the graphify-rs knowledge graph. Trigger this skill whenever the user asks about architecture, module dependencies, how components connect, where something is implemented, what uses a particular type or trait, or wants to query the project knowledge graph.
---

# graphify-rs: Knowledge Graph Skill (работает в связке с ast-index)

## Описание

`graphify-rs` — это CLI-инструмент для построения и анализа графа знаний кодовой базы. Он анализирует AST кода, документацию и файлы проекта, строит граф узлов (модули, функции, типы, файлы) и связей между ними, а затем позволяет отвечать на вопросы по архитектуре проекта через семантический поиск по графу.

Проект также использует **ast-index** для быстрого структурного поиска. Инструменты дополняют друг друга.

## Когда использовать graphify-rs vs ast-index

### graphify-rs (архитектура и связи)
- Понять архитектуру проекта, связи между модулями, сообщества
- Найти, какие компоненты зависят от определённого модуля/типа/функции
- Получить общее представление о структуре кода, поток данных между крейтами
- Вопросы: "как устроен X?", "что делает Y?", "как связаны A и B?"

### ast-index (быстрый структурный поиск) — используй ПЕРЕД graphify-rs если:
- Найти определение символа/функции/типа (`ast-index symbol`, `ast-index class`)
- Найти все использования типа/трейта (`ast-index usages`, `ast-index implementations`)
- Кто вызывает функцию (`ast-index callers`, `ast-index call-tree`)
- Структура файла перед чтением (`ast-index outline`)
- Поиск файла (`ast-index file`)

### Иерархия:
1. **ast-index** — первым делом для поиска символов, файлов, использований
2. **graphify-rs** — если нужна архитектурная картина или ответ не найден через ast-index
3. **grep** — только если оба вернули пусто или нужен regex/поиск по строкам

## Как использовать

### 1. Убедись, что граф актуален

Перед использованием проверь, что граф сгенерирован:

```bash
ls -la ./smith-graphify/graph.json
```

Если проект значительно изменился (добавлены новые крейты, файлы, инструменты), перестрой граф:

```bash
graphify-rs build --no-llm --output ./smith-graphify
```

### 2. Выполни запрос к графу

```bash
graphify-rs query --graph ./smith-graphify/graph.json "<твой вопрос>"
```

### 3. Slash-команда

Если пользователь вызывает навык через `/graphify-rs <запрос>`, выполни:

```bash
graphify-rs query --graph ./smith-graphify/graph.json "$ARGUMENTS"
```

### 4. Примеры вопросов

```bash
# Общие вопросы по архитектуре
graphify-rs query --graph ./smith-graphify/graph.json "какие крейты есть в проекте и как они связаны?"
graphify-rs query --graph ./smith-graphify/graph.json "что такое ToolRegistry и с чем он связан?"

# Поиск конкретных компонентов
graphify-rs query --graph ./smith-graphify/graph.json "какие инструменты Windows реализованы?"
graphify-rs query --graph ./smith-graphify/graph.json "как работает ExecutionContext и его методы?"

# Понимание зависимостей
graphify-rs query --graph ./smith-graphify/graph.json "какие модули зависят от smith-core?"
graphify-rs query --graph ./smith-graphify/graph.json "что использует SafeUIElement?"

# Анализ новых компонентов
graphify-rs query --graph ./smith-graphify/graph.json "как устроен smith-daemon и его API?"
graphify-rs query --graph ./smith-graphify/graph.json "как ProcessTool запускает и останавливает процессы?"

# Поиск по конкретным файлам
graphify-rs query --graph ./smith-graphify/graph.json "какие функции определены в selector.rs?"
```

## Артефакты графа

После сборки графа доступны следующие файлы в `smith-graphify/`:

| Файл | Описание |
|------|----------|
| `graph.json` | Граф в формате JSON (узлы, рёбра, сообщества) |
| `GRAPH_REPORT.md` | Аналитический отчёт с метриками, связями, сообществами |
| `graph.html` | Интерактивная визуализация графа |
| `graph.svg` | Статическая визуализация графа |
| `wiki/` | Wiki-страницы сообществ и ключевых сущностей |
| `obsidian/` | Obsidian-совместимые markdown-страницы |

## Примечания

- Запросы к графу не модифицируют файлы проекта — это read-only операция
- Если граф устарел (не отражает последние изменения), перестрой его перед запросом
- Для простых вопросов (файловая структура, имена функций) достаточно обычного поиска по коду — используй граф для сложных архитектурных вопросов и поиска связей
