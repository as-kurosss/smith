# smith-automation

**Smith** — Rust-библиотека для программной автоматизации UI на Windows.

```rust
use smith_core::{ExecutionContext, ToolRegistry};
use smith_windows::ClickTool;

let mut ctx = ExecutionContext::new();
let mut registry = ToolRegistry::new();
registry.register(ClickTool::new());

let result = registry
    .execute("windows.click", config, &mut ctx, token)
    .await?;
```

## Goals

- Type-safe, async-first API для UI automation на Rust
- Windows UI Automation (UIA) — основной движок
- Cancellation, timeouts, scoped-переменные
- Plugin-архитектура через трейт `Tool`

## Workspace

```text
crates/
├── smith-core/         # Ядро: Tool, ExecutionContext, SmithError
└── smith-windows/      # Инструменты: Click, Find, InputText, Process, SetText
```

| Crate | Описание |
|-------|----------|
| **smith-core** | Трейт `Tool`, `ExecutionContext` со scoped-переменными, `SmithError` |
| **smith-windows** | Инструменты UI Automation (`ClickTool`, `FindTool`, `InputTextTool`, `ProcessTool`, `SetTextTool`) |

## Build

```bash
cargo build                    # всё
cargo build -p smith-core      # только ядро
cargo build -p smith-windows   # Windows-инструменты
```

## Development

```bash
cargo check
cargo clippy -- -D warnings
cargo test
cargo fmt --check
```

## License

MIT. See [LICENSE](LICENSE).
