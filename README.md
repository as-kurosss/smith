# smith-automation

**Smith** — платформа для программной автоматизации UI на Windows. Позволяет описывать сценарии взаимодействия с графическим интерфейсом через декларативные конфигурации и выполнять их в изолированной среде Runtime.

## Goals

- Предоставить type-safe, async-first API для UI automation на Rust.
- Поддерживать платформу Windows (UI Automation) с возможностью расширения на Linux/macOS.
- Гарантировать безопасное выполнение автоматизации через cancellation, timeouts и scoped-переменные.
- Обеспечить расширяемость через plugin-архитектуру на трейтах.

## Workspace structure

Проект организован как Cargo workspace с тремя крейтами:

```text
smith-automation/
├── crates/
│   ├── smith-core/          # Ядро: Tool trait, ExecutionContext, ошибки
│   ├── smith-windows/       # Windows UI automation (cfg(windows))
├── apps/
│   └── smith-context/       # Утилита сбора контекста (отдельная, вне автоматизации)
├── docs/
│   ├── adr/                 # Architecture Decision Records
│   └── templates/           # Шаблоны документов
└── Cargo.toml               # Workspace manifest
```

### crates

| Crate | Description |
|-------|-------------|
| **smith-core** | Базовые абстракции: трейт `Tool`, `ExecutionContext` со scoped-переменными, `SmithError`, `ContextValue`. Не зависит от платформы. |
| **smith-windows** | Инструменты для Windows UI Automation: `ClickTool`, `SafeUIElement`. Весь Windows-специфичный код изолирован за `#[cfg(windows)]`. |

## Build

```bash
# Сборка всего workspace
cargo build

# Только кросс-платформенное ядро
cargo build -p smith-core

# Windows-инструменты (только на Windows)
cargo build -p smith-windows
```

## Development

```bash
# Проверка типов
cargo check

# Линтер
cargo clippy -- -D warnings

# Тесты
cargo test

# Форматирование
cargo fmt --check
```

## License

Licensed under the MIT License. See [LICENSE](LICENSE) for details.
