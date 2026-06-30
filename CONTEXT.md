# 📦 Project Context

*Generated on 2026-07-01 00:03:21*

## 📊 Statistics

- **Total files:** 13
- **Total lines:** 1253
- **Total size:** 39122 bytes
- **Crates:** 3

## 🖥️ Environment

- **Rust:** rustc 1.96.0 (ac68faa20 2026-05-25)
- **OS:** linux x86_64
- **Family:** unix

## 📦 Workspace Crates

- `smith-context`
- `smith-core`
- `smith-windows`

## 🗣️ Languages

- **rust:** 9 files
- **toml:** 4 files

## 📋 Workspace Cargo.toml

```toml
[workspace]
resolver = "2"
members = ["apps/smith-context",
    "crates/smith-core",
    "crates/smith-windows",
    "apps/smith-context",
]

[workspace.dependencies]
thiserror = "1.0"
tokio = { version = "1.38", features = ["full"] }
tokio-util = "0.7"
async-trait = "0.1"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
anyhow = "1.0"
```

## 🌳 Project Structure

```
.
├── Cargo.toml
├── apps
│   └── smith-context
│       ├── Cargo.toml
│       └── src
│           └── main.rs
└── crates
    ├── smith-core
    │   ├── Cargo.toml
    │   └── src
    │       ├── context.rs
    │       ├── error.rs
    │       ├── lib.rs
    │       └── tool.rs
    └── smith-windows
        ├── Cargo.toml
        └── src
            ├── element.rs
            ├── lib.rs
            └── tools
                ├── click.rs
                └── mod.rs
```

## 🧠 Knowledge Graph (graphify-rs)

### 📊 Graph Analysis Report

# 📊 Graph Analysis Report

**Root:** `.`

## Summary

| Metric | Value |
|--------|-------|
| Nodes | 88 |
| Edges | 99 |
| Communities | 14 |
| Hyperedges | 0 |

### Confidence Breakdown

| Level | Count | Percentage |
|-------|-------|------------|
| EXTRACTED | 79 | 79.8% |
| INFERRED | 20 | 20.2% |
| AMBIGUOUS | 0 | 0.0% |

## 🌟 God Nodes (Most Connected)

| Node | Degree | Community |
|------|--------|-----------|
| smith-context::main | 31 | 0 |
| main() | 12 | 1 |
| ExecutionContext | 7 | 5 |
| ClickTool | 7 | 2 |
| tool | 6 | 4 |
| click | 6 | 6 |
| context | 6 | 7 |
| collect_files() | 6 | 8 |
| ContextValue | 5 | 9 |
| SafeUIElement | 4 | 3 |

## 🔮 Surprising Connections

- **apps_smith_context_src_main_rs_main** → **apps_smith_context_src_main_rs_collect_files** (calls)
- **apps_smith_context_src_main_rs_main** → **apps_smith_context_src_main_rs_build_tree** (calls)
- **apps_smith_context_src_main_rs_main** → **apps_smith_context_src_main_rs_build_stats** (calls)
- **crates_smith_core_src_context_rs** → **crates_smith_core_src_context_rs_contextvalue** (defines)
- **crates_smith_core_src_context_rs** → **crates_smith_core_src_context_rs_executioncontext** (defines)

## 🏘️ Communities

### Community 0 — TreeNode (18 nodes, cohesion: 0.12)

- main
- build_stats()
- build_tree()
- Cli
- extract_crate_name()
- FileEntry
- GraphifyArtifacts
- anyhow::Result
- chrono::Local
- clap::Parser
- ignore::gitignore::GitignoreBuilder
- std::collections::{BTreeMap, HashMap}
- std::path::{Path, PathBuf}
- walkdir::WalkDir
- MarkdownContext
- ProjectStats
- render_tree()
- TreeNode

### Community 1 — run_graphify_build() (9 nodes, cohesion: 0.22)

- build_env_info()
- build_git_log()
- build_graph()
- collect_todos()
- format_markdown()
- load_graphify_artifacts()
- main()
- read_workspace_cargo()
- run_graphify_build()

### Community 2 — ClickTool (7 nodes, cohesion: 0.33)

- ClickTool
- .default()
- .description()
- .execute()
- .name()
- .new()
- .schema()

### Community 3 — SafeUIElement (7 nodes, cohesion: 0.29)

- element
- std::sync::Arc
- uiautomation::UIElement
- SafeUIElement
- .clone()
- .inner()
- .new()

### Community 4 — Tool (7 nodes, cohesion: 0.29)

- tool
- async_trait::async_trait
- crate::context::ExecutionContext
- crate::error::SmithResult
- serde_json::Value
- tokio_util::sync::CancellationToken
- Tool

### Community 5 — ExecutionContext (7 nodes, cohesion: 0.38)

- ExecutionContext
- .default()
- .get()
- .new()
- .pop_scope()
- .push_scope()
- .set()

### Community 6 — click (6 nodes, cohesion: 0.33)

- click
- async_trait::async_trait
- crate::element::SafeUIElement
- serde_json::{Value, json}
- smith_core::{ExecutionContext, SmithError, SmithResult, Tool, ToolConfig, ToolResult}
- tokio_util::sync::CancellationToken

### Community 7 — context (5 nodes, cohesion: 0.40)

- context
- crate::error::{SmithError, SmithResult}
- std::any::Any
- std::collections::HashMap
- std::sync::Arc

### Community 8 — is_binary_extension() (5 nodes, cohesion: 0.40)

- collect_files()
- detect_language()
- is_always_excluded_dir()
- is_always_excluded_file()
- is_binary_extension()

### Community 9 — .try_as_string() (5 nodes, cohesion: 0.40)

- ContextValue
- .try_as_boolean()
- .try_as_custom()
- .try_as_number()
- .try_as_string()

### Community 10 — lib (4 nodes, cohesion: 0.50)

- lib
- pub use context::{ContextValue, ExecutionContext}
- pub use error::{SmithError, SmithResult}
- pub use tool::{Tool, ToolConfig, ToolResult}

### Community 11 — SmithError (3 nodes, cohesion: 0.67)

- error
- thiserror::Error
- SmithError

### Community 12 — lib (12) (3 nodes, cohesion: 0.67)

- lib
- pub use element::SafeUIElement
- pub use tools::ClickTool

### Community 13 — mod (2 nodes, cohesion: 1.00)

- mod
- pub use click::ClickTool

## 🕳️ Knowledge Gaps

No isolated nodes.

**Thin communities** (< 3 nodes): 1 communities

## 💰 Token Cost

| File | Tokens |
|------|--------|
| output | 0 |
| input | 0 |
| **Total** | **0** |

## ❓ Suggested Questions

1. How does 'apps_smith_context_src_main_rs' relate to 3 different communities (is_binary_extension(), run_graphify_build(), TreeNode)?
1. How does 'apps_smith_context_src_main_rs_main' relate to 3 different communities (run_graphify_build(), is_binary_extension(), TreeNode)?
1. How does 'crates_smith_core_src_context_rs' relate to 3 different communities (context, .try_as_string(), ExecutionContext)?
1. How does 'apps_smith_context_src_main_rs_collect_files' relate to 3 different communities (is_binary_extension(), run_graphify_build(), TreeNode)?
1. Can you verify the inferred relationships of 'main()' (degree 12)?
1. Why is 'run_graphify_build()' (9 nodes) loosely connected (cohesion 0.22)? Should it be split?
1. Why is 'SafeUIElement' (7 nodes) loosely connected (cohesion 0.29)? Should it be split?

---
_Generated by graphify-rs_

### 🔗 Graph Data (JSON)

```json
{
  "directed": false,
  "multigraph": false,
  "graph": {},
  "nodes": [
    {
      "id": "crates_smith_core_src_error_rs",
      "label": "error",
      "source_file": "./crates/smith-core/src/error.rs",
      "node_type": "file",
      "community": 11
    },
    {
      "id": "crates_smith_core_src_error_rs_import_thiserror_error",
      "label": "thiserror::Error",
      "source_file": "./crates/smith-core/src/error.rs",
      "source_location": "L1",
      "node_type": "module",
      "community": 11
    },
    {
      "id": "crates_smith_core_src_error_rs_smitherror",
      "label": "SmithError",
      "source_file": "./crates/smith-core/src/error.rs",
      "source_location": "L4",
      "node_type": "enum",
      "community": 11
    },
    {
      "id": "crates_smith_core_src_lib_rs",
      "label": "lib",
      "source_file": "./crates/smith-core/src/lib.rs",
      "node_type": "file",
      "community": 10
    },
    {
      "id": "crates_smith_core_src_lib_rs_import_pub_use_context_contextvalue_executioncontext",
      "label": "pub use context::{ContextValue, ExecutionContext}",
      "source_file": "./crates/smith-core/src/lib.rs",
      "source_location": "L7",
      "node_type": "module",
      "community": 10
    },
    {
      "id": "crates_smith_core_src_lib_rs_import_pub_use_error_smitherror_smithresult",
      "label": "pub use error::{SmithError, SmithResult}",
      "source_file": "./crates/smith-core/src/lib.rs",
      "source_location": "L8",
      "node_type": "module",
      "community": 10
    },
    {
      "id": "crates_smith_core_src_lib_rs_import_pub_use_tool_tool_toolconfig_toolresult",
      "label": "pub use tool::{Tool, ToolConfig, ToolResult}",
      "source_file": "./crates/smith-core/src/lib.rs",
      "source_location": "L9",
      "node_type": "module",
      "community": 10
    },
    {
      "id": "crates_smith_core_src_context_rs",
      "label": "context",
      "source_file": "./crates/smith-core/src/context.rs",
      "node_type": "file",
      "community": 7
    },
    {
      "id": "crates_smith_core_src_context_rs_import_std_any_any",
      "label": "std::any::Any",
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L2",
      "node_type": "module",
      "community": 7
    },
    {
      "id": "crates_smith_core_src_context_rs_import_std_collections_hashmap",
      "label": "std::collections::HashMap",
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L3",
      "node_type": "module",
      "community": 7
    },
    {
      "id": "crates_smith_core_src_context_rs_import_std_sync_arc",
      "label": "std::sync::Arc",
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L4",
      "node_type": "module",
      "community": 7
    },
    {
      "id": "crates_smith_core_src_context_rs_import_crate_error_smitherror_smithresult",
      "label": "crate::error::{SmithError, SmithResult}",
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L6",
      "node_type": "module",
      "community": 7
    },
    {
      "id": "crates_smith_core_src_context_rs_contextvalue",
      "label": "ContextValue",
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L10",
      "node_type": "enum",
      "community": 9
    },
    {
      "id": "crates_smith_core_src_context_rs_contextvalue_try_as_string",
      "label": ".try_as_string()",
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L27",
      "node_type": "method",
      "community": 9
    },
    {
      "id": "crates_smith_core_src_context_rs_contextvalue_try_as_number",
      "label": ".try_as_number()",
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L39",
      "node_type": "method",
      "community": 9
    },
    {
      "id": "crates_smith_core_src_context_rs_contextvalue_try_as_boolean",
      "label": ".try_as_boolean()",
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L51",
      "node_type": "method",
      "community": 9
    },
    {
      "id": "crates_smith_core_src_context_rs_contextvalue_try_as_custom",
      "label": ".try_as_custom()",
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L64",
      "node_type": "method",
      "community": 9
    },
    {
      "id": "crates_smith_core_src_context_rs_executioncontext",
      "label": "ExecutionContext",
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L75",
      "node_type": "struct",
      "community": 5
    },
    {
      "id": "crates_smith_core_src_context_rs_executioncontext_new",
      "label": ".new()",
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L82",
      "node_type": "method",
      "community": 5
    },
    {
      "id": "crates_smith_core_src_context_rs_executioncontext_push_scope",
      "label": ".push_scope()",
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L89",
      "node_type": "method",
      "community": 5
    },
    {
      "id": "crates_smith_core_src_context_rs_executioncontext_pop_scope",
      "label": ".pop_scope()",
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L94",
      "node_type": "method",
      "community": 5
    },
    {
      "id": "crates_smith_core_src_context_rs_executioncontext_set",
      "label": ".set()",
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L101",
      "node_type": "method",
      "community": 5
    },
    {
      "id": "crates_smith_core_src_context_rs_executioncontext_get",
      "label": ".get()",
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L109",
      "node_type": "method",
      "community": 5
    },
    {
      "id": "crates_smith_core_src_context_rs_executioncontext_default",
      "label": ".default()",
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L120",
      "node_type": "method",
      "community": 5
    },
    {
      "id": "crates_smith_core_src_tool_rs",
      "label": "tool",
      "source_file": "./crates/smith-core/src/tool.rs",
      "node_type": "file",
      "community": 4
    },
    {
      "id": "crates_smith_core_src_tool_rs_import_async_trait_async_trait",
      "label": "async_trait::async_trait",
      "source_file": "./crates/smith-core/src/tool.rs",
      "source_location": "L2",
      "node_type": "module",
      "community": 4
    },
    {
      "id": "crates_smith_core_src_tool_rs_import_serde_json_value",
      "label": "serde_json::Value",
      "source_file": "./crates/smith-core/src/tool.rs",
      "source_location": "L3",
      "node_type": "module",
      "community": 4
    },
    {
      "id": "crates_smith_core_src_tool_rs_import_tokio_util_sync_cancellationtoken",
      "label": "tokio_util::sync::CancellationToken",
      "source_file": "./crates/smith-core/src/tool.rs",
      "source_location": "L4",
      "node_type": "module",
      "community": 4
    },
    {
      "id": "crates_smith_core_src_tool_rs_import_crate_context_executioncontext",
      "label": "crate::context::ExecutionContext",
      "source_file": "./crates/smith-core/src/tool.rs",
      "source_location": "L6",
      "node_type": "module",
      "community": 4
    },
    {
      "id": "crates_smith_core_src_tool_rs_import_crate_error_smithresult",
      "label": "crate::error::SmithResult",
      "source_file": "./crates/smith-core/src/tool.rs",
      "source_location": "L7",
      "node_type": "module",
      "community": 4
    },
    {
      "id": "crates_smith_core_src_tool_rs_tool",
      "label": "Tool",
      "source_file": "./crates/smith-core/src/tool.rs",
      "source_location": "L21",
      "node_type": "trait",
      "community": 4
    },
    {
      "id": "crates_smith_windows_src_lib_rs",
      "label": "lib",
      "source_file": "./crates/smith-windows/src/lib.rs",
      "node_type": "file",
      "community": 12
    },
    {
      "id": "crates_smith_windows_src_lib_rs_import_pub_use_element_safeuielement",
      "label": "pub use element::SafeUIElement",
      "source_file": "./crates/smith-windows/src/lib.rs",
      "source_location": "L5",
      "node_type": "module",
      "community": 12
    },
    {
      "id": "crates_smith_windows_src_lib_rs_import_pub_use_tools_clicktool",
      "label": "pub use tools::ClickTool",
      "source_file": "./crates/smith-windows/src/lib.rs",
      "source_location": "L6",
      "node_type": "module",
      "community": 12
    },
    {
      "id": "crates_smith_windows_src_tools_mod_rs",
      "label": "mod",
      "source_file": "./crates/smith-windows/src/tools/mod.rs",
      "node_type": "file",
      "community": 13
    },
    {
      "id": "crates_smith_windows_src_tools_mod_rs_import_pub_use_click_clicktool",
      "label": "pub use click::ClickTool",
      "source_file": "./crates/smith-windows/src/tools/mod.rs",
      "source_location": "L3",
      "node_type": "module",
      "community": 13
    },
    {
      "id": "crates_smith_windows_src_tools_click_rs",
      "label": "click",
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "node_type": "file",
      "community": 6
    },
    {
      "id": "crates_smith_windows_src_tools_click_rs_import_async_trait_async_trait",
      "label": "async_trait::async_trait",
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L2",
      "node_type": "module",
      "community": 6
    },
    {
      "id": "crates_smith_windows_src_tools_click_rs_import_serde_json_value_json",
      "label": "serde_json::{Value, json}",
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L3",
      "node_type": "module",
      "community": 6
    },
    {
      "id": "crates_smith_windows_src_tools_click_rs_import_smith_core_executioncontext_smitherror_smithresult_tool_toolconfig_toolresult",
      "label": "smith_core::{ExecutionContext, SmithError, SmithResult, Tool, ToolConfig, ToolResult}",
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L4",
      "node_type": "module",
      "community": 6
    },
    {
      "id": "crates_smith_windows_src_tools_click_rs_import_tokio_util_sync_cancellationtoken",
      "label": "tokio_util::sync::CancellationToken",
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L5",
      "node_type": "module",
      "community": 6
    },
    {
      "id": "crates_smith_windows_src_tools_click_rs_import_crate_element_safeuielement",
      "label": "crate::element::SafeUIElement",
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L7",
      "node_type": "module",
      "community": 6
    },
    {
      "id": "crates_smith_windows_src_tools_click_rs_clicktool",
      "label": "ClickTool",
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L10",
      "node_type": "struct",
      "community": 2
    },
    {
      "id": "crates_smith_windows_src_tools_click_rs_clicktool_new",
      "label": ".new()",
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L15",
      "node_type": "method",
      "community": 2
    },
    {
      "id": "crates_smith_windows_src_tools_click_rs_clicktool_default",
      "label": ".default()",
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L21",
      "node_type": "method",
      "community": 2
    },
    {
      "id": "crates_smith_windows_src_tools_click_rs_clicktool_name",
      "label": ".name()",
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L28",
      "node_type": "method",
      "community": 2
    },
    {
      "id": "crates_smith_windows_src_tools_click_rs_clicktool_description",
      "label": ".description()",
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L32",
      "node_type": "method",
      "community": 2
    },
    {
      "id": "crates_smith_windows_src_tools_click_rs_clicktool_schema",
      "label": ".schema()",
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L36",
      "node_type": "method",
      "community": 2
    },
    {
      "id": "crates_smith_windows_src_tools_click_rs_clicktool_execute",
      "label": ".execute()",
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L49",
      "node_type": "method",
      "community": 2
    },
    {
      "id": "crates_smith_windows_src_element_rs",
      "label": "element",
      "source_file": "./crates/smith-windows/src/element.rs",
      "node_type": "file",
      "community": 3
    },
    {
      "id": "crates_smith_windows_src_element_rs_import_std_sync_arc",
      "label": "std::sync::Arc",
      "source_file": "./crates/smith-windows/src/element.rs",
      "source_location": "L2",
      "node_type": "module",
      "community": 3
    },
    {
      "id": "crates_smith_windows_src_element_rs_import_uiautomation_uielement",
      "label": "uiautomation::UIElement",
      "source_file": "./crates/smith-windows/src/element.rs",
      "source_location": "L3",
      "node_type": "module",
      "community": 3
    },
    {
      "id": "crates_smith_windows_src_element_rs_safeuielement",
      "label": "SafeUIElement",
      "source_file": "./crates/smith-windows/src/element.rs",
      "source_location": "L15",
      "node_type": "struct",
      "community": 3
    },
    {
      "id": "crates_smith_windows_src_element_rs_safeuielement_new",
      "label": ".new()",
      "source_file": "./crates/smith-windows/src/element.rs",
      "source_location": "L20",
      "node_type": "method",
      "community": 3
    },
    {
      "id": "crates_smith_windows_src_element_rs_safeuielement_inner",
      "label": ".inner()",
      "source_file": "./crates/smith-windows/src/element.rs",
      "source_location": "L30",
      "node_type": "method",
      "community": 3
    },
    {
      "id": "crates_smith_windows_src_element_rs_safeuielement_clone",
      "label": ".clone()",
      "source_file": "./crates/smith-windows/src/element.rs",
      "source_location": "L42",
      "node_type": "method",
      "community": 3
    },
    {
      "id": "apps_smith_context_src_main_rs",
      "label": "main",
      "source_file": "./apps/smith-context/src/main.rs",
      "node_type": "file",
      "community": 0
    },
    {
      "id": "apps_smith_context_src_main_rs_import_anyhow_result",
      "label": "anyhow::Result",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L2",
      "node_type": "module",
      "community": 0
    },
    {
      "id": "apps_smith_context_src_main_rs_import_chrono_local",
      "label": "chrono::Local",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L3",
      "node_type": "module",
      "community": 0
    },
    {
      "id": "apps_smith_context_src_main_rs_import_clap_parser",
      "label": "clap::Parser",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L4",
      "node_type": "module",
      "community": 0
    },
    {
      "id": "apps_smith_context_src_main_rs_import_ignore_gitignore_gitignorebuilder",
      "label": "ignore::gitignore::GitignoreBuilder",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L5",
      "node_type": "module",
      "community": 0
    },
    {
      "id": "apps_smith_context_src_main_rs_import_std_collections_btreemap_hashmap",
      "label": "std::collections::{BTreeMap, HashMap}",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L6",
      "node_type": "module",
      "community": 0
    },
    {
      "id": "apps_smith_context_src_main_rs_import_std_path_path_pathbuf",
      "label": "std::path::{Path, PathBuf}",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L7",
      "node_type": "module",
      "community": 0
    },
    {
      "id": "apps_smith_context_src_main_rs_import_walkdir_walkdir",
      "label": "walkdir::WalkDir",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L8",
      "node_type": "module",
      "community": 0
    },
    {
      "id": "apps_smith_context_src_main_rs_cli",
      "label": "Cli",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L16",
      "node_type": "struct",
      "community": 0
    },
    {
      "id": "apps_smith_context_src_main_rs_graphifyartifacts",
      "label": "GraphifyArtifacts",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L74",
      "node_type": "struct",
      "community": 0
    },
    {
      "id": "apps_smith_context_src_main_rs_fileentry",
      "label": "FileEntry",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L80",
      "node_type": "struct",
      "community": 0
    },
    {
      "id": "apps_smith_context_src_main_rs_projectstats",
      "label": "ProjectStats",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L88",
      "node_type": "struct",
      "community": 0
    },
    {
      "id": "apps_smith_context_src_main_rs_treenode",
      "label": "TreeNode",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L97",
      "node_type": "struct",
      "community": 0
    },
    {
      "id": "apps_smith_context_src_main_rs_markdowncontext",
      "label": "MarkdownContext",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L106",
      "node_type": "struct",
      "community": 0
    },
    {
      "id": "apps_smith_context_src_main_rs_main",
      "label": "main()",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L118",
      "node_type": "function",
      "community": 1
    },
    {
      "id": "apps_smith_context_src_main_rs_is_always_excluded_file",
      "label": "is_always_excluded_file()",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L211",
      "node_type": "function",
      "community": 8
    },
    {
      "id": "apps_smith_context_src_main_rs_is_always_excluded_dir",
      "label": "is_always_excluded_dir()",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L217",
      "node_type": "function",
      "community": 8
    },
    {
      "id": "apps_smith_context_src_main_rs_collect_files",
      "label": "collect_files()",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L222",
      "node_type": "function",
      "community": 8
    },
    {
      "id": "apps_smith_context_src_main_rs_detect_language",
      "label": "detect_language()",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L314",
      "node_type": "function",
      "community": 8
    },
    {
      "id": "apps_smith_context_src_main_rs_is_binary_extension",
      "label": "is_binary_extension()",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L339",
      "node_type": "function",
      "community": 8
    },
    {
      "id": "apps_smith_context_src_main_rs_build_tree",
      "label": "build_tree()",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L394",
      "node_type": "function",
      "community": 0
    },
    {
      "id": "apps_smith_context_src_main_rs_render_tree",
      "label": "render_tree()",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L430",
      "node_type": "function",
      "community": 0
    },
    {
      "id": "apps_smith_context_src_main_rs_build_stats",
      "label": "build_stats()",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L449",
      "node_type": "function",
      "community": 0
    },
    {
      "id": "apps_smith_context_src_main_rs_extract_crate_name",
      "label": "extract_crate_name()",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L476",
      "node_type": "function",
      "community": 0
    },
    {
      "id": "apps_smith_context_src_main_rs_collect_todos",
      "label": "collect_todos()",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L490",
      "node_type": "function",
      "community": 1
    },
    {
      "id": "apps_smith_context_src_main_rs_load_graphify_artifacts",
      "label": "load_graphify_artifacts()",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L514",
      "node_type": "function",
      "community": 1
    },
    {
      "id": "apps_smith_context_src_main_rs_run_graphify_build",
      "label": "run_graphify_build()",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L557",
      "node_type": "function",
      "community": 1
    },
    {
      "id": "apps_smith_context_src_main_rs_build_graph",
      "label": "build_graph()",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L621",
      "node_type": "function",
      "community": 1
    },
    {
      "id": "apps_smith_context_src_main_rs_build_git_log",
      "label": "build_git_log()",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L681",
      "node_type": "function",
      "community": 1
    },
    {
      "id": "apps_smith_context_src_main_rs_build_env_info",
      "label": "build_env_info()",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L704",
      "node_type": "function",
      "community": 1
    },
    {
      "id": "apps_smith_context_src_main_rs_read_workspace_cargo",
      "label": "read_workspace_cargo()",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L728",
      "node_type": "function",
      "community": 1
    },
    {
      "id": "apps_smith_context_src_main_rs_format_markdown",
      "label": "format_markdown()",
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L739",
      "node_type": "function",
      "community": 1
    }
  ],
  "links": [
    {
      "source": "crates_smith_core_src_error_rs",
      "target": "crates_smith_core_src_error_rs_import_thiserror_error",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/error.rs",
      "source_location": "L1",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "Error"
      ]
    },
    {
      "source": "crates_smith_core_src_error_rs",
      "target": "crates_smith_core_src_error_rs_smitherror",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/error.rs",
      "source_location": "L4",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_core_src_lib_rs",
      "target": "crates_smith_core_src_lib_rs_import_pub_use_context_contextvalue_executioncontext",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/lib.rs",
      "source_location": "L7",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "{ContextValue, ExecutionContext}"
      ]
    },
    {
      "source": "crates_smith_core_src_lib_rs",
      "target": "crates_smith_core_src_lib_rs_import_pub_use_error_smitherror_smithresult",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/lib.rs",
      "source_location": "L8",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "{SmithError, SmithResult}"
      ]
    },
    {
      "source": "crates_smith_core_src_lib_rs",
      "target": "crates_smith_core_src_lib_rs_import_pub_use_tool_tool_toolconfig_toolresult",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/lib.rs",
      "source_location": "L9",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "{Tool, ToolConfig, ToolResult}"
      ]
    },
    {
      "source": "crates_smith_core_src_context_rs",
      "target": "crates_smith_core_src_context_rs_import_std_any_any",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L2",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "Any"
      ]
    },
    {
      "source": "crates_smith_core_src_context_rs",
      "target": "crates_smith_core_src_context_rs_import_std_collections_hashmap",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L3",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "HashMap"
      ]
    },
    {
      "source": "crates_smith_core_src_context_rs",
      "target": "crates_smith_core_src_context_rs_import_std_sync_arc",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L4",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "Arc"
      ]
    },
    {
      "source": "crates_smith_core_src_context_rs",
      "target": "crates_smith_core_src_context_rs_import_crate_error_smitherror_smithresult",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L6",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "{SmithError, SmithResult}"
      ]
    },
    {
      "source": "crates_smith_core_src_context_rs",
      "target": "crates_smith_core_src_context_rs_contextvalue",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L10",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_core_src_context_rs_contextvalue",
      "target": "crates_smith_core_src_context_rs_contextvalue_try_as_string",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L27",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_core_src_context_rs_contextvalue",
      "target": "crates_smith_core_src_context_rs_contextvalue_try_as_number",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L39",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_core_src_context_rs_contextvalue",
      "target": "crates_smith_core_src_context_rs_contextvalue_try_as_boolean",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L51",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_core_src_context_rs_contextvalue",
      "target": "crates_smith_core_src_context_rs_contextvalue_try_as_custom",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L64",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_core_src_context_rs",
      "target": "crates_smith_core_src_context_rs_executioncontext",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L75",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_core_src_context_rs_executioncontext",
      "target": "crates_smith_core_src_context_rs_executioncontext_new",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L82",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_core_src_context_rs_executioncontext",
      "target": "crates_smith_core_src_context_rs_executioncontext_push_scope",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L89",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_core_src_context_rs_executioncontext",
      "target": "crates_smith_core_src_context_rs_executioncontext_pop_scope",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L94",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_core_src_context_rs_executioncontext",
      "target": "crates_smith_core_src_context_rs_executioncontext_set",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L101",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_core_src_context_rs_executioncontext",
      "target": "crates_smith_core_src_context_rs_executioncontext_get",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L109",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_core_src_context_rs_executioncontext",
      "target": "crates_smith_core_src_context_rs_executioncontext_default",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/context.rs",
      "source_location": "L120",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_core_src_context_rs_executioncontext_push_scope",
      "target": "crates_smith_core_src_context_rs_executioncontext_new",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./crates/smith-core/src/context.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "crates_smith_core_src_context_rs_executioncontext_default",
      "target": "crates_smith_core_src_context_rs_executioncontext_new",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./crates/smith-core/src/context.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "crates_smith_core_src_tool_rs",
      "target": "crates_smith_core_src_tool_rs_import_async_trait_async_trait",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/tool.rs",
      "source_location": "L2",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "async_trait"
      ]
    },
    {
      "source": "crates_smith_core_src_tool_rs",
      "target": "crates_smith_core_src_tool_rs_import_serde_json_value",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/tool.rs",
      "source_location": "L3",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "Value"
      ]
    },
    {
      "source": "crates_smith_core_src_tool_rs",
      "target": "crates_smith_core_src_tool_rs_import_tokio_util_sync_cancellationtoken",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/tool.rs",
      "source_location": "L4",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "CancellationToken"
      ]
    },
    {
      "source": "crates_smith_core_src_tool_rs",
      "target": "crates_smith_core_src_tool_rs_import_crate_context_executioncontext",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/tool.rs",
      "source_location": "L6",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "ExecutionContext"
      ]
    },
    {
      "source": "crates_smith_core_src_tool_rs",
      "target": "crates_smith_core_src_tool_rs_import_crate_error_smithresult",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/tool.rs",
      "source_location": "L7",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "SmithResult"
      ]
    },
    {
      "source": "crates_smith_core_src_tool_rs",
      "target": "crates_smith_core_src_tool_rs_tool",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-core/src/tool.rs",
      "source_location": "L21",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_windows_src_lib_rs",
      "target": "crates_smith_windows_src_lib_rs_import_pub_use_element_safeuielement",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/lib.rs",
      "source_location": "L5",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "SafeUIElement"
      ]
    },
    {
      "source": "crates_smith_windows_src_lib_rs",
      "target": "crates_smith_windows_src_lib_rs_import_pub_use_tools_clicktool",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/lib.rs",
      "source_location": "L6",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "ClickTool"
      ]
    },
    {
      "source": "crates_smith_windows_src_tools_mod_rs",
      "target": "crates_smith_windows_src_tools_mod_rs_import_pub_use_click_clicktool",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/tools/mod.rs",
      "source_location": "L3",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "ClickTool"
      ]
    },
    {
      "source": "crates_smith_windows_src_tools_click_rs",
      "target": "crates_smith_windows_src_tools_click_rs_import_async_trait_async_trait",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L2",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "async_trait"
      ]
    },
    {
      "source": "crates_smith_windows_src_tools_click_rs",
      "target": "crates_smith_windows_src_tools_click_rs_import_serde_json_value_json",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L3",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "{Value, json}"
      ]
    },
    {
      "source": "crates_smith_windows_src_tools_click_rs",
      "target": "crates_smith_windows_src_tools_click_rs_import_smith_core_executioncontext_smitherror_smithresult_tool_toolconfig_toolresult",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L4",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "{ExecutionContext, SmithError, SmithResult, Tool, ToolConfig, ToolResult}"
      ]
    },
    {
      "source": "crates_smith_windows_src_tools_click_rs",
      "target": "crates_smith_windows_src_tools_click_rs_import_tokio_util_sync_cancellationtoken",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L5",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "CancellationToken"
      ]
    },
    {
      "source": "crates_smith_windows_src_tools_click_rs",
      "target": "crates_smith_windows_src_tools_click_rs_import_crate_element_safeuielement",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L7",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "SafeUIElement"
      ]
    },
    {
      "source": "crates_smith_windows_src_tools_click_rs",
      "target": "crates_smith_windows_src_tools_click_rs_clicktool",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L10",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_windows_src_tools_click_rs_clicktool",
      "target": "crates_smith_windows_src_tools_click_rs_clicktool_new",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L15",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_windows_src_tools_click_rs_clicktool",
      "target": "crates_smith_windows_src_tools_click_rs_clicktool_default",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L21",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_windows_src_tools_click_rs_clicktool",
      "target": "crates_smith_windows_src_tools_click_rs_clicktool_name",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L28",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_windows_src_tools_click_rs_clicktool",
      "target": "crates_smith_windows_src_tools_click_rs_clicktool_description",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L32",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_windows_src_tools_click_rs_clicktool",
      "target": "crates_smith_windows_src_tools_click_rs_clicktool_schema",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L36",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_windows_src_tools_click_rs_clicktool",
      "target": "crates_smith_windows_src_tools_click_rs_clicktool_execute",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "source_location": "L49",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_windows_src_tools_click_rs_clicktool_default",
      "target": "crates_smith_windows_src_tools_click_rs_clicktool_new",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./crates/smith-windows/src/tools/click.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "crates_smith_windows_src_element_rs",
      "target": "crates_smith_windows_src_element_rs_import_std_sync_arc",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/element.rs",
      "source_location": "L2",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "Arc"
      ]
    },
    {
      "source": "crates_smith_windows_src_element_rs",
      "target": "crates_smith_windows_src_element_rs_import_uiautomation_uielement",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/element.rs",
      "source_location": "L3",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "UIElement"
      ]
    },
    {
      "source": "crates_smith_windows_src_element_rs",
      "target": "crates_smith_windows_src_element_rs_safeuielement",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/element.rs",
      "source_location": "L15",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_windows_src_element_rs_safeuielement",
      "target": "crates_smith_windows_src_element_rs_safeuielement_new",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/element.rs",
      "source_location": "L20",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_windows_src_element_rs_safeuielement",
      "target": "crates_smith_windows_src_element_rs_safeuielement_inner",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/element.rs",
      "source_location": "L30",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "crates_smith_windows_src_element_rs_safeuielement",
      "target": "crates_smith_windows_src_element_rs_safeuielement_clone",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./crates/smith-windows/src/element.rs",
      "source_location": "L42",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_import_anyhow_result",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L2",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "Result"
      ]
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_import_chrono_local",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L3",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "Local"
      ]
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_import_clap_parser",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L4",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "Parser"
      ]
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_import_ignore_gitignore_gitignorebuilder",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L5",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "GitignoreBuilder"
      ]
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_import_std_collections_btreemap_hashmap",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L6",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "{BTreeMap, HashMap}"
      ]
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_import_std_path_path_pathbuf",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L7",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "{Path, PathBuf}"
      ]
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_import_walkdir_walkdir",
      "relation": "imports",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L8",
      "weight": 1.0,
      "provenance": "ast:import",
      "imported_symbols": [
        "WalkDir"
      ]
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_cli",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L16",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_graphifyartifacts",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L74",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_fileentry",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L80",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_projectstats",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L88",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_treenode",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L97",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_markdowncontext",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L106",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_main",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L118",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_is_always_excluded_file",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L211",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_is_always_excluded_dir",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L217",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_collect_files",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L222",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_detect_language",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L314",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_is_binary_extension",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L339",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_build_tree",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L394",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_render_tree",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L430",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_build_stats",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L449",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_extract_crate_name",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L476",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_collect_todos",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L490",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_load_graphify_artifacts",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L514",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_run_graphify_build",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L557",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_build_graph",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L621",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_build_git_log",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L681",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_build_env_info",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L704",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_read_workspace_cargo",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L728",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs",
      "target": "apps_smith_context_src_main_rs_format_markdown",
      "relation": "defines",
      "confidence": "EXTRACTED",
      "confidence_score": 1.0,
      "source_file": "./apps/smith-context/src/main.rs",
      "source_location": "L739",
      "weight": 1.0,
      "provenance": "ast:defines"
    },
    {
      "source": "apps_smith_context_src_main_rs_main",
      "target": "apps_smith_context_src_main_rs_collect_files",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./apps/smith-context/src/main.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "apps_smith_context_src_main_rs_main",
      "target": "apps_smith_context_src_main_rs_build_tree",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./apps/smith-context/src/main.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "apps_smith_context_src_main_rs_main",
      "target": "apps_smith_context_src_main_rs_build_stats",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./apps/smith-context/src/main.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "apps_smith_context_src_main_rs_main",
      "target": "apps_smith_context_src_main_rs_collect_todos",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./apps/smith-context/src/main.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "apps_smith_context_src_main_rs_main",
      "target": "apps_smith_context_src_main_rs_build_graph",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./apps/smith-context/src/main.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "apps_smith_context_src_main_rs_main",
      "target": "apps_smith_context_src_main_rs_run_graphify_build",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./apps/smith-context/src/main.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "apps_smith_context_src_main_rs_main",
      "target": "apps_smith_context_src_main_rs_load_graphify_artifacts",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./apps/smith-context/src/main.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "apps_smith_context_src_main_rs_main",
      "target": "apps_smith_context_src_main_rs_build_git_log",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./apps/smith-context/src/main.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "apps_smith_context_src_main_rs_main",
      "target": "apps_smith_context_src_main_rs_build_env_info",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./apps/smith-context/src/main.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "apps_smith_context_src_main_rs_main",
      "target": "apps_smith_context_src_main_rs_read_workspace_cargo",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./apps/smith-context/src/main.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "apps_smith_context_src_main_rs_main",
      "target": "apps_smith_context_src_main_rs_format_markdown",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./apps/smith-context/src/main.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "apps_smith_context_src_main_rs_collect_files",
      "target": "apps_smith_context_src_main_rs_is_always_excluded_dir",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./apps/smith-context/src/main.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "apps_smith_context_src_main_rs_collect_files",
      "target": "apps_smith_context_src_main_rs_is_always_excluded_file",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./apps/smith-context/src/main.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "apps_smith_context_src_main_rs_collect_files",
      "target": "apps_smith_context_src_main_rs_is_binary_extension",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./apps/smith-context/src/main.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "apps_smith_context_src_main_rs_collect_files",
      "target": "apps_smith_context_src_main_rs_detect_language",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./apps/smith-context/src/main.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "apps_smith_context_src_main_rs_build_tree",
      "target": "apps_smith_context_src_main_rs_render_tree",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./apps/smith-context/src/main.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    },
    {
      "source": "apps_smith_context_src_main_rs_build_stats",
      "target": "apps_smith_context_src_main_rs_extract_crate_name",
      "relation": "calls",
      "confidence": "INFERRED",
      "confidence_score": 0.7,
      "source_file": "./apps/smith-context/src/main.rs",
      "weight": 1.0,
      "provenance": "ast:call-resolve"
    }
  ]
}
```

## 📝 TODOs and FIXMEs

- **apps/smith-context/src/main.rs:115** — `todos: &'a [(String, usize, String)],`
- **apps/smith-context/src/main.rs:133** — `// 4. Собираем TODO/FIXME`
- **apps/smith-context/src/main.rs:134** — `let todos = collect_todos(&files);`
- **apps/smith-context/src/main.rs:190** — `todos: &todos,`
- **apps/smith-context/src/main.rs:489** — `/// Собирает все TODO/FIXME/XXX комментарии`
- **apps/smith-context/src/main.rs:490** — `fn collect_todos(files: &[FileEntry]) -> Vec<(String, usize, String)> {`
- **apps/smith-context/src/main.rs:491** — `let mut todos = Vec::new();`
- **apps/smith-context/src/main.rs:496** — `if line_upper.contains("TODO")`
- **apps/smith-context/src/main.rs:497** — `|| line_upper.contains("FIXME")`
- **apps/smith-context/src/main.rs:498** — `|| line_upper.contains("XXX")`
- **apps/smith-context/src/main.rs:499** — `|| line_upper.contains("HACK")`
- **apps/smith-context/src/main.rs:501** — `todos.push((`
- **apps/smith-context/src/main.rs:510** — `todos`
- **apps/smith-context/src/main.rs:839** — `// TODOs`
- **apps/smith-context/src/main.rs:840** — `if !ctx.todos.is_empty() {`
- **apps/smith-context/src/main.rs:841** — `md.push_str("## 📝 TODOs and FIXMEs\n\n");`
- **apps/smith-context/src/main.rs:842** — `for (file, line, content) in ctx.todos {`

## 📄 Source Files

### `Cargo.toml`

```toml
[workspace]
resolver = "2"
members = ["apps/smith-context",
    "crates/smith-core",
    "crates/smith-windows",
    "apps/smith-context",
]

[workspace.dependencies]
thiserror = "1.0"
tokio = { version = "1.38", features = ["full"] }
tokio-util = "0.7"
async-trait = "0.1"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
anyhow = "1.0"
```

### `apps/smith-context/Cargo.toml`

```toml
[package]
name = "smith-context"
version = "0.1.0"
edition = "2021"

[dependencies]
anyhow = { workspace = true }
chrono = "0.4"
clap = { version = "4.5", features = ["derive"] }
ignore = "0.4"
walkdir = "2.5"
serde_json = { workspace = true }
```

### `apps/smith-context/src/main.rs`

```rust
// apps/smith-context/src/main.rs
use anyhow::Result;
use chrono::Local;
use clap::Parser;
use ignore::gitignore::GitignoreBuilder;
use std::collections::{BTreeMap, HashMap};
use std::path::{Path, PathBuf};
use walkdir::WalkDir;

/// Smith Context Builder
///
/// Собирает весь контекст проекта в один Markdown-файл для передачи LLM.
#[derive(Parser)]
#[command(name = "smith-context")]
#[command(about = "Collect project context into a single Markdown file")]
struct Cli {
    /// Root directory of the project
    #[arg(short, long, default_value = ".")]
    root: PathBuf,

    /// Output file path
    #[arg(short, long, default_value = "CONTEXT.md")]
    output: PathBuf,

    /// Include git log (last 20 commits)
    #[arg(long)]
    git_log: bool,

    /// Include dependency graph via cargo metadata (Mermaid)
    #[arg(long)]
    graph: bool,

    /// Include graphify-rs artifacts (graph.json, GRAPH_REPORT.md) if present
    #[arg(long)]
    graphify: bool,

    /// Directory containing graphify-rs artifacts (default: smith-graphify)
    #[arg(long, default_value = DEFAULT_GRAPHIFY_DIR)]
    graphify_dir: String,

    /// Skip graphify-rs build (use existing artifacts)
    #[arg(long)]
    no_graphify_build: bool,

    /// Max file size in bytes (default: 1MB)
    #[arg(long, default_value = "1048576")]
    max_file_size: u64,

    /// Exclude patterns (substring match)
    #[arg(long)]
    exclude: Vec<String>,
}

/// Файлы, которые всегда исключаются из сбора
const ALWAYS_EXCLUDE_FILES: &[&str] =
    &["PROJECT_GUIDE.md", "CONTEXT.md", "graph.html", "Cargo.lock"];

/// Файлы, которые всегда исключаются по директориям
const ALWAYS_EXCLUDE_DIRS: &[&str] = &[
    "target",
    "node_modules",
    "venv",
    "__pycache__",
    ".git",
    ".idea",
    ".vscode",
    "smith-graphify",
];

/// Директория по умолчанию для артефактов graphify-rs
const DEFAULT_GRAPHIFY_DIR: &str = "smith-graphify";

/// Graphify-rs артефакты
struct GraphifyArtifacts {
    graph_json: Option<String>,
    graph_report: Option<String>,
}

/// Представление одного файла проекта
struct FileEntry {
    relative_path: String,
    content: String,
    language: String,
    size: u64,
}

/// Статистика проекта
struct ProjectStats {
    total_files: usize,
    total_lines: usize,
    total_bytes: usize,
    crates: Vec<String>,
    languages: HashMap<String, usize>,
}

/// Узел дерева файлов
struct TreeNode {
    name: String,
    children: BTreeMap<String, TreeNode>,
    is_file: bool,
}

/// Контекст для генерации Markdown-отчёта.
/// Инкапсулирует все данные, необходимые для форматирования,
/// чтобы избежать избыточного количества аргументов функции.
struct MarkdownContext<'a> {
    tree: &'a str,
    files: &'a [FileEntry],
    stats: &'a ProjectStats,
    env_info: &'a str,
    workspace_cargo: Option<&'a str>,
    graph: Option<&'a str>,
    graphify: Option<&'a GraphifyArtifacts>,
    git_log: Option<&'a str>,
    todos: &'a [(String, usize, String)],
}

fn main() -> Result<()> {
    let cli = Cli::parse();

    println!("🔍 Collecting project context from: {}", cli.root.display());

    // 1. Собираем файлы
    let files = collect_files(&cli)?;
    println!("   📄 Found {} files", files.len());

    // 2. Строим дерево
    let tree = build_tree(&files);

    // 3. Считаем статистику
    let stats = build_stats(&files);

    // 4. Собираем TODO/FIXME
    let todos = collect_todos(&files);

    // 5. Опционально: граф зависимостей через cargo metadata
    let graph = if cli.graph {
        println!("   🔗 Building dependency graph (cargo metadata)...");
        Some(build_graph(&cli.root)?)
    } else {
        None
    };

    // 6. Опционально: graphify-rs артефакты
    let graphify = if cli.graphify {
        // 6a. Сначала запускаем сборку (если не пропущено)
        if !cli.no_graphify_build {
            let build_ok = run_graphify_build(&cli.root, &cli.graphify_dir)?;
            if !build_ok {
                println!("      ⚠ Continuing with existing artifacts (if any)");
            }
        } else {
            println!("   ⏭️  Skipping graphify-rs build (--no-graphify-build)");
        }

        // 6b. Загружаем артефакты
        println!(
            "   🧠 Loading graphify-rs artifacts from: {}",
            cli.graphify_dir
        );
        Some(load_graphify_artifacts(&cli.root, &cli.graphify_dir)?)
    } else {
        None
    };

    // 7. Опционально: git log
    let git_log = if cli.git_log {
        println!("   📜 Fetching git log...");
        Some(build_git_log(&cli.root)?)
    } else {
        None
    };

    // 8. Environment info
    let env_info = build_env_info()?;

    // 9. Workspace Cargo.toml
    let workspace_cargo = read_workspace_cargo(&cli.root)?;

    // 10. Форматируем в Markdown
    let md_ctx = MarkdownContext {
        tree: &tree,
        files: &files,
        stats: &stats,
        env_info: &env_info,
        workspace_cargo: workspace_cargo.as_deref(),
        graph: graph.as_deref(),
        graphify: graphify.as_ref(),
        git_log: git_log.as_deref(),
        todos: &todos,
    };
    let markdown = format_markdown(&md_ctx)?;

    // 11. Записываем в файл
    std::fs::write(&cli.output, &markdown)?;

    println!("\n✅ Context collected to: {}", cli.output.display());
    println!("   📊 Files:  {}", stats.total_files);
    println!("   📝 Lines:  {}", stats.total_lines);
    println!(
        "   💾 Size:   {} bytes ({} KB)",
        markdown.len(),
        markdown.len() / 1024
    );
    println!("   📦 Crates: {}", stats.crates.len());

    Ok(())
}

/// Проверяет, является ли файл в списке всегда исключаемых
fn is_always_excluded_file(path: &Path) -> bool {
    let file_name = path.file_name().and_then(|n| n.to_str()).unwrap_or("");
    ALWAYS_EXCLUDE_FILES.contains(&file_name)
}

/// Проверяет, является ли директория всегда исключаемой
fn is_always_excluded_dir(name: &str) -> bool {
    ALWAYS_EXCLUDE_DIRS.contains(&name)
}

/// Рекурсивно собирает все текстовые файлы проекта
fn collect_files(cli: &Cli) -> Result<Vec<FileEntry>> {
    // Строим gitignore
    let gitignore_path = cli.root.join(".gitignore");
    let mut builder = GitignoreBuilder::new(&cli.root);
    if gitignore_path.exists() {
        builder.add(gitignore_path);
    }
    let gitignore = builder.build()?;

    let mut files = Vec::new();

    for entry in WalkDir::new(&cli.root).into_iter().filter_entry(|e| {
        let path = e.path();
        let name = path.file_name().and_then(|n| n.to_str()).unwrap_or("");

        // Пропускаем скрытые директории (кроме корня)
        if name.starts_with('.') && name != "." {
            return false;
        }

        // Пропускаем стандартные build-директории
        if is_always_excluded_dir(name) {
            return false;
        }

        // Пропускаем пользовательские excludes
        for pattern in &cli.exclude {
            if path.to_str().map(|p| p.contains(pattern)).unwrap_or(false) {
                return false;
            }
        }

        true
    }) {
        let entry = entry?;
        let path = entry.path();

        if !path.is_file() {
            continue;
        }

        // Пропускаем всегда исключаемые файлы
        if is_always_excluded_file(path) {
            continue;
        }

        // Проверяем gitignore
        if gitignore.matched(path, false).is_ignore() {
            continue;
        }

        // Проверяем размер файла
        let metadata = entry.metadata()?;
        if metadata.len() > cli.max_file_size {
            continue;
        }

        // Пропускаем бинарные файлы
        let extension = path.extension().and_then(|e| e.to_str()).unwrap_or("");
        if is_binary_extension(extension) {
            continue;
        }

        // Читаем содержимое (пропускаем если не UTF-8)
        let content = match std::fs::read_to_string(path) {
            Ok(c) => c,
            Err(_) => continue,
        };

        // Нормализуем путь (Windows backslashes → forward slashes)
        let relative_path = path
            .strip_prefix(&cli.root)?
            .to_string_lossy()
            .replace('\\', "/");

        let language = detect_language(path).to_string();

        files.push(FileEntry {
            relative_path,
            content,
            language,
            size: metadata.len(),
        });
    }

    // Сортируем для консистентного вывода
    files.sort_by(|a, b| a.relative_path.cmp(&b.relative_path));

    Ok(files)
}

/// Определяет язык программирования по расширению файла
fn detect_language(path: &Path) -> &'static str {
    match path.extension().and_then(|e| e.to_str()) {
        Some("rs") => "rust",
        Some("toml") => "toml",
        Some("yaml") | Some("yml") => "yaml",
        Some("json") => "json",
        Some("md") => "markdown",
        Some("sh") | Some("bash") => "bash",
        Some("ps1") => "powershell",
        Some("py") => "python",
        Some("js") => "javascript",
        Some("ts") => "typescript",
        Some("html") => "html",
        Some("css") => "css",
        Some("sql") => "sql",
        Some("xml") => "xml",
        Some("ini") | Some("cfg") => "ini",
        Some("dockerfile") => "dockerfile",
        Some("gitignore") => "gitignore",
        Some("lock") => "toml",
        _ => "text",
    }
}

/// Проверяет, является ли расширение бинарным
fn is_binary_extension(ext: &str) -> bool {
    matches!(
        ext,
        // Исполняемые файлы
        "exe"
            | "dll"
            | "so"
            | "dylib"
            | "bin"
            | "obj"
            | "o"
            | "a"
            | "lib"
            | "pdb"
            // Изображения
            | "png"
            | "jpg"
            | "jpeg"
            | "gif"
            | "bmp"
            | "ico"
            | "svg"
            | "webp"
            | "tiff"
            // Аудио/видео
            | "mp3"
            | "mp4"
            | "avi"
            | "mov"
            | "wav"
            | "flac"
            | "mkv"
            | "webm"
            // Архивы
            | "zip"
            | "tar"
            | "gz"
            | "bz2"
            | "7z"
            | "rar"
            | "xz"
            // Документы
            | "pdf"
            | "doc"
            | "docx"
            | "xls"
            | "xlsx"
            | "ppt"
            | "pptx"
            // WASM
            | "wasm"
    )
}

/// Строит ASCII-дерево файлов
fn build_tree(files: &[FileEntry]) -> String {
    let mut root = TreeNode {
        name: ".".to_string(),
        children: BTreeMap::new(),
        is_file: false,
    };

    // Строим дерево из путей
    for file in files {
        let parts: Vec<&str> = file.relative_path.split('/').collect();
        let mut current = &mut root;

        for (i, part) in parts.iter().enumerate() {
            let is_last = i == parts.len() - 1;
            current = current
                .children
                .entry(part.to_string())
                .or_insert_with(|| TreeNode {
                    name: part.to_string(),
                    children: BTreeMap::new(),
                    is_file: is_last,
                });
        }
    }

    // Рендерим дерево в строку
    let mut output = String::new();
    output.push_str("```\n");
    output.push_str(".\n");
    render_tree(&root, "", &mut output);
    output.push_str("```\n");

    output
}

/// Рекурсивно рендерит узел дерева
fn render_tree(node: &TreeNode, prefix: &str, output: &mut String) {
    let children: Vec<_> = node.children.values().collect();
    for (i, child) in children.iter().enumerate() {
        let is_last = i == children.len() - 1;
        let connector = if is_last { "└── " } else { "├── " };
        output.push_str(&format!("{}{}{}\n", prefix, connector, child.name));

        if !child.is_file {
            let new_prefix = if is_last {
                format!("{}    ", prefix)
            } else {
                format!("{}│   ", prefix)
            };
            render_tree(child, &new_prefix, output);
        }
    }
}

/// Считает статистику проекта
fn build_stats(files: &[FileEntry]) -> ProjectStats {
    let mut stats = ProjectStats {
        total_files: files.len(),
        total_lines: 0,
        total_bytes: 0,
        crates: Vec::new(),
        languages: HashMap::new(),
    };

    for file in files {
        stats.total_lines += file.content.lines().count();
        stats.total_bytes += file.size as usize;

        *stats.languages.entry(file.language.clone()).or_insert(0) += 1;

        // Извлекаем имена крейтов из Cargo.toml
        if file.relative_path.ends_with("Cargo.toml") {
            if let Some(name) = extract_crate_name(&file.content) {
                stats.crates.push(name);
            }
        }
    }

    stats
}

/// Извлекает имя crate из содержимого Cargo.toml
fn extract_crate_name(cargo_toml: &str) -> Option<String> {
    for line in cargo_toml.lines() {
        let line = line.trim();
        if line.starts_with("name") {
            if let Some(name) = line.split('=').nth(1) {
                let name = name.trim().trim_matches('"');
                return Some(name.to_string());
            }
        }
    }
    None
}

/// Собирает все TODO/FIXME/XXX комментарии
fn collect_todos(files: &[FileEntry]) -> Vec<(String, usize, String)> {
    let mut todos = Vec::new();

    for file in files {
        for (line_num, line) in file.content.lines().enumerate() {
            let line_upper = line.to_uppercase();
            if line_upper.contains("TODO")
                || line_upper.contains("FIXME")
                || line_upper.contains("XXX")
                || line_upper.contains("HACK")
            {
                todos.push((
                    file.relative_path.clone(),
                    line_num + 1,
                    line.trim().to_string(),
                ));
            }
        }
    }

    todos
}

/// Загружает graphify-rs артефакты из указанной директории
fn load_graphify_artifacts(root: &Path, graphify_dir: &str) -> Result<GraphifyArtifacts> {
    let graphify_path = root.join(graphify_dir);
    let graph_json_path = graphify_path.join("graph.json");
    let graph_report_path = graphify_path.join("GRAPH_REPORT.md");

    // Проверяем, существует ли директория
    if !graphify_path.exists() {
        println!("      ⚠ Directory '{}' not found", graphify_dir);
        return Ok(GraphifyArtifacts {
            graph_json: None,
            graph_report: None,
        });
    }

    let graph_json = if graph_json_path.exists() {
        let content = std::fs::read_to_string(graph_json_path)?;
        println!("      ✓ Found {}/graph.json", graphify_dir);
        Some(content)
    } else {
        println!("      ⚠ {}/graph.json not found", graphify_dir);
        None
    };

    let graph_report = if graph_report_path.exists() {
        let content = std::fs::read_to_string(graph_report_path)?;
        println!("      ✓ Found {}/GRAPH_REPORT.md", graphify_dir);
        Some(content)
    } else {
        println!("      ⚠ {}/GRAPH_REPORT.md not found", graphify_dir);
        None
    };

    Ok(GraphifyArtifacts {
        graph_json,
        graph_report,
    })
}

/// Запускает `graphify-rs build` для генерации артефактов
///
/// Возвращает `Ok(true)` если сборка прошла успешно,
/// `Ok(false)` если graphify-rs не установлен или сборка пропущена,
/// `Err` если произошла критическая ошибка.
fn run_graphify_build(root: &Path, graphify_dir: &str) -> Result<bool> {
    println!("   🔨 Running: graphify-rs build --no-llm --output ./{graphify_dir}");

    // Проверяем, установлен ли graphify-rs
    let check = std::process::Command::new("graphify-rs")
        .arg("--version")
        .output();

    match check {
        Ok(output) if output.status.success() => {
            let version = String::from_utf8_lossy(&output.stdout);
            println!("      ✓ Found graphify-rs ({})", version.trim());
        }
        Ok(_) => {
            println!("      ⚠ graphify-rs returned error on --version, skipping build");
            return Ok(false);
        }
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
            println!("      ⚠ graphify-rs not found in PATH");
            println!("        Install with: cargo install graphify-rs");
            println!("        Skipping build, will use existing artifacts if present");
            return Ok(false);
        }
        Err(e) => {
            println!("      ⚠ Failed to check graphify-rs: {}", e);
            return Ok(false);
        }
    }

    // Запускаем сборку
    let start = std::time::Instant::now();

    let status = std::process::Command::new("graphify-rs")
        .arg("build")
        .arg("--no-llm")
        .arg("--output")
        .arg(format!("./{}", graphify_dir))
        .current_dir(root)
        .status();

    match status {
        Ok(s) if s.success() => {
            let elapsed = start.elapsed();
            println!(
                "      ✓ Graph built successfully in {:.2}s",
                elapsed.as_secs_f64()
            );
            Ok(true)
        }
        Ok(s) => {
            println!(
                "      ⚠ graphify-rs build failed with exit code: {:?}",
                s.code()
            );
            Ok(false)
        }
        Err(e) => {
            println!("      ⚠ Failed to run graphify-rs build: {}", e);
            Ok(false)
        }
    }
}

/// Строит граф зависимостей через cargo metadata
fn build_graph(root: &Path) -> Result<String> {
    let output = std::process::Command::new("cargo")
        .arg("metadata")
        .arg("--format-version=1")
        .arg("--no-deps")
        .current_dir(root)
        .output()?;

    if !output.status.success() {
        return Ok("⚠️ Failed to run cargo metadata\n".to_string());
    }

    let stdout = String::from_utf8(output.stdout)?;
    let metadata: serde_json::Value = serde_json::from_str(&stdout)?;

    let mut graph = String::new();
    graph.push_str("```mermaid\n");
    graph.push_str("graph TD\n");

    // Рендерим узлы (workspace crates)
    if let Some(packages) = metadata["packages"].as_array() {
        for package in packages {
            let name = package["name"].as_str().unwrap_or("unknown");
            let version = package["version"].as_str().unwrap_or("0.0.0");
            graph.push_str(&format!(
                "    {}[\"{} v{}\"]\n",
                name.replace('-', "_"),
                name,
                version
            ));
        }

        // Рендерим рёбра (зависимости между workspace crates)
        for package in packages {
            let name = package["name"].as_str().unwrap_or("unknown");
            if let Some(deps) = package["dependencies"].as_array() {
                for dep in deps {
                    let dep_name = dep["name"].as_str().unwrap_or("unknown");
                    // Показываем только зависимости между workspace crates
                    let is_workspace_dep = packages
                        .iter()
                        .any(|p| p["name"].as_str() == Some(dep_name));
                    if is_workspace_dep {
                        graph.push_str(&format!(
                            "    {} --> {}\n",
                            name.replace('-', "_"),
                            dep_name.replace('-', "_")
                        ));
                    }
                }
            }
        }
    }

    graph.push_str("```\n");

    Ok(graph)
}

/// Получает последние git-коммиты
fn build_git_log(root: &Path) -> Result<String> {
    let output = std::process::Command::new("git")
        .arg("log")
        .arg("--oneline")
        .arg("-20")
        .current_dir(root)
        .output()?;

    if !output.status.success() {
        return Ok("⚠️ Git not available or not a git repository\n".to_string());
    }

    let stdout = String::from_utf8(output.stdout)?;

    let mut log = String::new();
    log.push_str("```\n");
    log.push_str(&stdout);
    log.push_str("```\n");

    Ok(log)
}

/// Собирает информацию об окружении
fn build_env_info() -> Result<String> {
    let rustc_output = std::process::Command::new("rustc")
        .arg("--version")
        .output()?;

    let rust_version = if rustc_output.status.success() {
        String::from_utf8(rustc_output.stdout)?.trim().to_string()
    } else {
        "unknown".to_string()
    };

    let mut info = String::new();
    info.push_str(&format!("- **Rust:** {}\n", rust_version));
    info.push_str(&format!(
        "- **OS:** {} {}\n",
        std::env::consts::OS,
        std::env::consts::ARCH
    ));
    info.push_str(&format!("- **Family:** {}\n", std::env::consts::FAMILY));

    Ok(info)
}

/// Читает корневой Cargo.toml
fn read_workspace_cargo(root: &Path) -> Result<Option<String>> {
    let cargo_path = root.join("Cargo.toml");
    if cargo_path.exists() {
        let content = std::fs::read_to_string(cargo_path)?;
        Ok(Some(content))
    } else {
        Ok(None)
    }
}

/// Форматирует собранный контекст проекта в Markdown.
fn format_markdown(ctx: &MarkdownContext) -> Result<String> {
    let mut md = String::new();

    // Header
    md.push_str("# 📦 Project Context\n\n");
    md.push_str(&format!(
        "*Generated on {}*\n\n",
        Local::now().format("%Y-%m-%d %H:%M:%S")
    ));

    // Statistics
    md.push_str("## 📊 Statistics\n\n");
    md.push_str(&format!("- **Total files:** {}\n", ctx.stats.total_files));
    md.push_str(&format!("- **Total lines:** {}\n", ctx.stats.total_lines));
    md.push_str(&format!(
        "- **Total size:** {} bytes\n",
        ctx.stats.total_bytes
    ));
    md.push_str(&format!("- **Crates:** {}\n", ctx.stats.crates.len()));
    md.push('\n');

    // Environment
    md.push_str("## 🖥️ Environment\n\n");
    md.push_str(ctx.env_info);
    md.push('\n');

    // Workspace crates
    if !ctx.stats.crates.is_empty() {
        md.push_str("## 📦 Workspace Crates\n\n");
        for crate_name in &ctx.stats.crates {
            md.push_str(&format!("- `{}`\n", crate_name));
        }
        md.push('\n');
    }

    // Languages
    if !ctx.stats.languages.is_empty() {
        md.push_str("## 🗣️ Languages\n\n");
        let mut langs: Vec<_> = ctx.stats.languages.iter().collect();
        langs.sort_by(|a, b| b.1.cmp(a.1));
        for (lang, count) in langs {
            md.push_str(&format!("- **{}:** {} files\n", lang, count));
        }
        md.push('\n');
    }

    // Workspace Cargo.toml
    if let Some(cargo) = ctx.workspace_cargo {
        md.push_str("## 📋 Workspace Cargo.toml\n\n");
        md.push_str("```toml\n");
        md.push_str(cargo);
        if !cargo.ends_with('\n') {
            md.push('\n');
        }
        md.push_str("```\n\n");
    }

    // Project structure
    md.push_str("## 🌳 Project Structure\n\n");
    md.push_str(ctx.tree);
    md.push('\n');

    // Dependency graph
    if let Some(graph) = ctx.graph {
        md.push_str("## 🔗 Dependency Graph (Cargo Metadata)\n\n");
        md.push_str(graph);
        md.push('\n');
    }

    // Graphify-rs artifacts
    if let Some(artifacts) = ctx.graphify {
        md.push_str("## 🧠 Knowledge Graph (graphify-rs)\n\n");

        if let Some(report) = &artifacts.graph_report {
            md.push_str("### 📊 Graph Analysis Report\n\n");
            md.push_str(report);
            if !report.ends_with('\n') {
                md.push('\n');
            }
            md.push('\n');
        }

        if let Some(json) = &artifacts.graph_json {
            md.push_str("### 🔗 Graph Data (JSON)\n\n");
            md.push_str("```json\n");
            md.push_str(json);
            if !json.ends_with('\n') {
                md.push('\n');
            }
            md.push_str("```\n\n");
        }
    }

    // Git log
    if let Some(git_log) = ctx.git_log {
        md.push_str("## 📜 Recent Commits\n\n");
        md.push_str(git_log);
        md.push('\n');
    }

    // TODOs
    if !ctx.todos.is_empty() {
        md.push_str("## 📝 TODOs and FIXMEs\n\n");
        for (file, line, content) in ctx.todos {
            md.push_str(&format!("- **{}:{}** — `{}`\n", file, line, content));
        }
        md.push('\n');
    }

    // Source files
    md.push_str("## 📄 Source Files\n\n");
    for file in ctx.files {
        md.push_str(&format!("### `{}`\n\n", file.relative_path));
        md.push_str(&format!("```{}\n", file.language));
        md.push_str(&file.content);
        if !file.content.ends_with('\n') {
            md.push('\n');
        }
        md.push_str("```\n\n");
    }

    Ok(md)
}
```

### `crates/smith-core/Cargo.toml`

```toml
[package]
name = "smith-core"
version = "0.1.0"
edition = "2024"

[dependencies]
thiserror = { workspace = true }
tokio = { workspace = true }
tokio-util = { workspace = true }
async-trait = { workspace = true }
serde = { workspace = true }
serde_json = { workspace = true }
anyhow = { workspace = true }
```

### `crates/smith-core/src/context.rs`

```rust
// crates/smith-core/src/context.rs
use std::any::Any;
use std::collections::HashMap;
use std::sync::Arc;

use crate::error::{SmithError, SmithResult};

/// Алгебраический тип данных для хранения значений в контексте.
#[derive(Debug, Clone)]
pub enum ContextValue {
    String(String),
    Number(f64),
    Boolean(bool),
    List(Vec<ContextValue>),
    Bytes(Vec<u8>),
    /// Платформо-специфичные объекты (например, `UIElement` из `smith-windows`).
    Custom(Arc<dyn Any + Send + Sync>),
    Null,
}

impl ContextValue {
    /// Извлекает строковое значение.
    ///
    /// # Errors
    ///
    /// Возвращает `SmithError::InvalidParams`, если значение не является `String`.
    pub fn try_as_string(&self) -> SmithResult<&str> {
        match self {
            ContextValue::String(s) => Ok(s.as_str()),
            _ => Err(SmithError::InvalidParams("Expected String".into())),
        }
    }

    /// Извлекает числовое значение.
    ///
    /// # Errors
    ///
    /// Возвращает `SmithError::InvalidParams`, если значение не является `Number`.
    pub fn try_as_number(&self) -> SmithResult<f64> {
        match self {
            ContextValue::Number(n) => Ok(*n),
            _ => Err(SmithError::InvalidParams("Expected Number".into())),
        }
    }

    /// Извлекает булево значение.
    ///
    /// # Errors
    ///
    /// Возвращает `SmithError::InvalidParams`, если значение не является `Boolean`.
    pub fn try_as_boolean(&self) -> SmithResult<bool> {
        match self {
            ContextValue::Boolean(b) => Ok(*b),
            _ => Err(SmithError::InvalidParams("Expected Boolean".into())),
        }
    }

    /// Извлекает кастомный тип через `Any`.
    ///
    /// # Errors
    ///
    /// Возвращает `SmithError::InvalidParams`, если значение не является `Custom`
    /// или внутренний тип не совпадает с запрашиваемым `T`.
    pub fn try_as_custom<T: 'static>(&self) -> SmithResult<&T> {
        match self {
            ContextValue::Custom(arc) => arc
                .downcast_ref::<T>()
                .ok_or_else(|| SmithError::InvalidParams("Custom type mismatch".into())),
            _ => Err(SmithError::InvalidParams("Expected Custom type".into())),
        }
    }
}

/// Контекст выполнения со стеком скоупов для изоляции переменных.
pub struct ExecutionContext {
    scopes: Vec<HashMap<String, ContextValue>>,
}

impl ExecutionContext {
    /// Создаёт новый контекст с глобальным скоупом.
    #[must_use]
    pub fn new() -> Self {
        Self {
            scopes: vec![HashMap::new()],
        }
    }

    /// Создаёт новый локальный скоуп (например, при входе в цикл или функцию).
    pub fn push_scope(&mut self) {
        self.scopes.push(HashMap::new());
    }

    /// Уничтожает текущий локальный скоуп, освобождая память от временных переменных.
    pub fn pop_scope(&mut self) {
        if self.scopes.len() > 1 {
            self.scopes.pop();
        }
    }

    /// Записывает переменную в текущий (самый верхний) скоуп.
    pub fn set(&mut self, key: impl Into<String>, value: ContextValue) {
        if let Some(scope) = self.scopes.last_mut() {
            scope.insert(key.into(), value);
        }
    }

    /// Читает переменную, начиная поиск с локального скоупа к глобальному (LIFO).
    #[must_use]
    pub fn get(&self, key: &str) -> Option<&ContextValue> {
        for scope in self.scopes.iter().rev() {
            if let Some(value) = scope.get(key) {
                return Some(value);
            }
        }
        None
    }
}

impl Default for ExecutionContext {
    fn default() -> Self {
        Self::new()
    }
}
```

### `crates/smith-core/src/error.rs`

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum SmithError {
    #[error("Invalid parameters: {0}")]
    InvalidParams(String),

    #[error("UI element not found or selector invalid")]
    ElementNotFound,

    #[error("Operation cancelled by user")]
    Cancelled,

    #[error("Context error: {0}")]
    ContextError(String),

    #[error("Platform error: {0}")]
    PlatformError(String),

    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

pub type SmithResult<T> = Result<T, SmithError>;
```

### `crates/smith-core/src/lib.rs`

```rust
// crates/smith-core/src/lib.rs
pub mod context;
pub mod error;
pub mod tool;

// Flat API
pub use context::{ContextValue, ExecutionContext};
pub use error::{SmithError, SmithResult};
pub use tool::{Tool, ToolConfig, ToolResult};
```

### `crates/smith-core/src/tool.rs`

```rust
// crates/smith-core/src/tool.rs
use async_trait::async_trait;
use serde_json::Value;
use tokio_util::sync::CancellationToken;

use crate::context::ExecutionContext;
use crate::error::SmithResult;

/// Универсальный транспорт для параметров инструмента.
pub type ToolConfig = Value;

/// Результат выполнения инструмента.
pub type ToolResult = Value;

/// Базовый трейт для всех инструментов автоматизации.
///
/// # Требования
/// - `Send + Sync`: Инструменты могут выполняться в multi-thread runtime Tokio.
/// - Stateless: Сам инструмент не хранит состояние исполнения, только конфигурацию.
#[async_trait]
pub trait Tool: Send + Sync {
    /// Уникальное имя инструмента (например, `windows.click`).
    fn name(&self) -> &'static str;

    /// Описание для документации и LLM-агентов.
    fn description(&self) -> &'static str;

    /// JSON Schema для валидации `ToolConfig`.
    fn schema(&self) -> Value;

    /// Асинхронное выполнение инструмента.
    ///
    /// # Arguments
    /// * `config` - Параметры вызова (валидируются через schema)
    /// * `ctx` - Контекст выполнения (чтение/запись переменных)
    /// * `token` - Токен отмены для graceful shutdown
    async fn execute(
        &self,
        config: ToolConfig,
        ctx: &mut ExecutionContext,
        token: CancellationToken,
    ) -> SmithResult<ToolResult>;
}
```

### `crates/smith-windows/Cargo.toml`

```toml
[package]
name = "smith-windows"
version = "0.1.0"
edition = "2024"

[dependencies]
async-trait.workspace = true
serde_json.workspace = true
smith-core = { version = "0.1.0", path = "../smith-core" }
tokio.workspace = true
tokio-util.workspace = true
uiautomation = "0.25.0"
```

### `crates/smith-windows/src/element.rs`

```rust
// crates/smith-windows/src/element.rs
use std::sync::Arc;
use uiautomation::UIElement;

/// Потокобезопасная обертка над `UIElement`.
///
/// # Safety
///
/// `UIElement` внутри содержит `NonNull<c_void>` (COM-интерфейс), который
/// не реализует `Send`. Однако объекты UI Automation являются
/// free-threaded и могут безопасно передаваться между потоками.
/// Все мутации (клики, ввод) выполняются через `spawn_blocking`,
/// где COM-вызовы происходят в выделенном потоке.
#[derive(Debug)]
pub struct SafeUIElement(Arc<UIElement>);

impl SafeUIElement {
    /// Создаёт новую потокобезопасную обёртку.
    #[must_use]
    pub fn new(element: UIElement) -> Self {
        // SAFETY: UIElement is a free-threaded COM object despite lacking
        // Send/Sync markers. Thread safety is enforced by restricting all
        // mutating operations to spawn_blocking contexts.
        #[allow(clippy::arc_with_non_send_sync)]
        Self(Arc::new(element))
    }

    /// Возвращает ссылку на внутренний элемент.
    #[must_use]
    pub fn inner(&self) -> &UIElement {
        &self.0
    }
}

// SAFETY: UI Automation elements are free-threaded COM objects.
// They can be safely sent between threads. All mutating operations
// are performed inside spawn_blocking to avoid blocking the async runtime.
unsafe impl Send for SafeUIElement {}
unsafe impl Sync for SafeUIElement {}

impl Clone for SafeUIElement {
    fn clone(&self) -> Self {
        Self(Arc::clone(&self.0))
    }
}
```

### `crates/smith-windows/src/lib.rs`

```rust
// crates/smith-windows/src/lib.rs
pub mod element;
pub mod tools;

pub use element::SafeUIElement;
pub use tools::ClickTool;
```

### `crates/smith-windows/src/tools/click.rs`

```rust
// crates/smith-windows/src/tools/click.rs
use async_trait::async_trait;
use serde_json::{Value, json};
use smith_core::{ExecutionContext, SmithError, SmithResult, Tool, ToolConfig, ToolResult};
use tokio_util::sync::CancellationToken;

use crate::element::SafeUIElement;

/// Инструмент для выполнения клика по UI-элементу Windows.
pub struct ClickTool;

impl ClickTool {
    /// Создаёт новый экземпляр `ClickTool`.
    #[must_use]
    pub fn new() -> Self {
        Self
    }
}

impl Default for ClickTool {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Tool for ClickTool {
    fn name(&self) -> &'static str {
        "windows.click"
    }

    fn description(&self) -> &'static str {
        "Performs a click on a UI element stored in the execution context"
    }

    fn schema(&self) -> Value {
        json!({
            "type": "object",
            "properties": {
                "element_key": {
                    "type": "string",
                    "description": "Key in ExecutionContext containing the UIElement"
                }
            },
            "required": ["element_key"]
        })
    }

    async fn execute(
        &self,
        config: ToolConfig,
        ctx: &mut ExecutionContext,
        token: CancellationToken,
    ) -> SmithResult<ToolResult> {
        // 1. Валидация параметров (Канон 10.1)
        let element_key = config
            .get("element_key")
            .and_then(|v| v.as_str())
            .ok_or_else(|| SmithError::InvalidParams("Missing 'element_key'".into()))?;

        // 2. Проверка отмены перед тяжелой операцией (Канон 5.4)
        if token.is_cancelled() {
            return Err(SmithError::Cancelled);
        }

        // 3. Извлекаем элемент из контекста
        let value = ctx.get(element_key).ok_or_else(|| {
            SmithError::ContextError(format!("Key '{element_key}' not found in context"))
        })?;

        let wrapper = value.try_as_custom::<SafeUIElement>()?;
        let element_clone = wrapper.clone(); // Клонируем Arc, а не сам элемент

        // В spawn_blocking используем inner():
        tokio::task::spawn_blocking(move || {
            element_clone
                .inner()
                .click()
                .map_err(|e| SmithError::PlatformError(format!("Click failed: {e}")))
        })
        .await
        .map_err(|_| SmithError::PlatformError("Blocking task join failed".into()))??;

        Ok(Value::Null)
    }
}
```

### `crates/smith-windows/src/tools/mod.rs`

```rust
// crates/smith-windows/src/tools/mod.rs
pub mod click;
pub use click::ClickTool;
```

