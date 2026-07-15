# Smith

**Smith** — A Rust library for programmatic UI automation on Windows.

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

- Type-safe, async-first API for UI automation in Rust
- Windows UI Automation (UIA) — primary engine
- Cancellation, timeouts, scoped variables
- Plugin architecture via the `Tool` trait

## Workspace

```text
crates/
├── smith-core/         # Core: Tool, ExecutionContext, SmithError
├── smith-windows/      # Windows UI Automation tools
├── smith-rpa/          # Type-safe Node::Rpa constructors
├── smith-ai/           # Rig-based LLM agent
├── smith-workflow/     # FlowGraph execution engine
├── smith-agent/        # Agent lifecycle and orchestration
├── smith-cli/          # CLI entrypoint
├── smith-mcp/          # MCP protocol integration
├── smith-observe/      # Observability (tracing, metrics)
├── smith-providers/    # LLM provider adapters
└── smith-server/       # HTTP server for remote control
apps/
├── selector-capture/   # UI selector capture utility
├── smith-context/      # Context management app
└── smith-examples/     # Example applications
```

| Crate | Description |
|-------|-------------|
| **smith-core** | `Tool` trait, `ExecutionContext` with scoped variables, `SmithError` |
| **smith-windows** | UI Automation tools (`ClickTool`, `FindTool`, `InputTextTool`, `ProcessTool`, `SetTextTool`, `WaitTool`) |
| **smith-rpa** | Type-safe `Node::Rpa` constructors by domain (windows) |
| **smith-ai** | Rig-based LLM agent wrapper (`SmithAgent`) |
| **smith-workflow** | FlowGraph — graph execution engine with error handling and routing |
| **smith-agent** | Agent lifecycle, tool orchestration, and session management |
| **smith-cli** | CLI entrypoint, configuration, and argument parsing |
| **smith-mcp** | MCP server and protocol implementation |
| **smith-observe** | OpenTelemetry tracing, logging, and metrics |
| **smith-providers** | LLM provider adapters (Anthropic, OpenAI, etc.) |
| **smith-server** | HTTP API server for remote agent control |
| **smith-examples** | Example apps: pure RPA, AI agent, FlowGraph, combined workflow |
| **smith-context** | Context management utilities for agent workflows |
| **selector-capture** | UI element selector capture utility |

## Build

```bash
cargo build                    # everything
cargo build -p smith-core      # core only
cargo build -p smith-windows   # Windows tools
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
