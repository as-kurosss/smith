## 📐 Specification: selector-capture v2 | smith-automation

**🎯 Purpose:** Transform `selector-capture` from a passive "dump selector to JSON" tool into an interactive **flow config generator** that captures a UI element, prompts for the target tool, and produces ready-to-use `Node::Rpa` config — either as a clipboard snippet, a generated Rust flow fragment, or an updated flow file.

**User story:** "I see a button on screen → I press CTRL → I tell the tool what to do with it (click / find / input / set_text) → I paste the generated code into my flow. No manual copying of field names."

---

## 1. Clipboard integration (`--clip` / `-c`)

### 📥 Input (additions to `Single` and `Series`)

| parameter | type | constraint | example |
|-----------|------|-----------|---------|
| `--clip` / `-c` | bool | optional; default `false` | `--clip` |
| `--tool` / `-t` | string | optional; one of `find`, `click`, `input_text`, `set_text`, `wait` | `--tool click` |
| `--output-key` / `-k` | string | optional; auto-generated if not set | `--output-key btn_submit` |
| `--text` | string | optional; for `input_text` / `set_text` | `--text "Hello"` |

### 📤 Behaviour

When `--clip` is set:
1. After capture, if `--tool` is provided → generate a `ToolArgs` for that tool (see §4).
2. If `--tool` is NOT provided → generate a `windows.find` config (the generic selector).
3. Serialize to compact JSON (no pretty-print).
4. Copy to system clipboard via `arboard`.
5. Print the config to stderr for visibility:
   ```
   ✓ Captured: Submit (Button)
   📋 Copied to clipboard:
     {"name":"Submit","control_type":"Button","output_key":"el_01"}
   ```

When `--tool click` and `--output-key` are also provided, TWO configs are copied:
   ```
   ✓ Captured: Submit (Button)
   📋 Copied to clipboard (click):
     — Step 1: {"output_key":"el_01","name":"Submit","control_type":"Button"}
     — Step 2: {"element_key":"el_01"}
   ```

Format: find config first (one line), then a separator `---`, then the dependent action config.

### 📤 Output

- Clipboard: formatted JSON string per tool schema.
- Exit code: `0` on success, `1` on clipboard error (non-fatal — file is still saved).
- File: unchanged behaviour, also saves to `selectors.json` if not `--clip`-only.

### ⚠️ Boundaries

- No clipboard available (headless / RDP) → warn on stderr, exit with `0` (file still saved).
- `--tool click` without `--output-key` → auto-generate `el_<incrementing_counter>`.
- `--text` provided for `click` or `find` → ignored (not part of schema for those tools).
- Cancelled via ESC → no clipboard copy.

### 🧩 Dependencies

Add `arboard = "3"` to `Cargo.toml` (windows-only, clipboard crate with `cliboard` feature for Windows).

---

## 2. Interactive record mode (`record` subcommand)

New subcommand replacing the need for `--tool` / `--output-key` flags with an interactive TUI.

### 📥 Input

```
selector-capture record [--output <file>] [--format <json|rust|yaml>]
```

| parameter | type | constraint | example |
|-----------|------|-----------|---------|
| `--output` | string | optional; default `selectors.json` | `--output flow.rs` |
| `--format` | string | optional; `json`, `rust`, `yaml`; default auto-detect from extension | `--format rust` |

### 📤 Behaviour (interactive session)

```
=== Selector Capture: Record Mode ===
Hotkeys:
  CTRL          → capture element under cursor
  ESC           → cancel current capture / exit
  Ctrl+Shift+F2 → finish and save/print

Ready. Press CTRL over a UI element...

--- Capture #1 ---
  ✓ Button "Submit" (automation_id: btnSubmit)
  → Tool? [find/click/input_text/set_text/wait] click
  → output_key: [el_01]                           # auto-generated, Enter to accept
  → Generated:
      find:   {"output_key":"el_01","name":"Submit","control_type":"Button"}
      click:  {"element_key":"el_01"}

  [CTRL] to continue, [ESC] to discard, [Ctrl+Shift+F2] to finish...

--- Capture #2 ---
  ✓ Edit "Username" (class_name: Edit)
  → Tool? [find/click/input_text/set_text/wait] input_text
  → output_key: [el_02]
  → text: [<none>] admin                           # mandatory for input_text
  → Generated:
      find:        {"output_key":"el_02","name":"Username","class_name":"Edit"}
      input_text:  {"element_key":"el_02","text":"admin"}
```

After Ctrl+Shift+F2, output according to `--format`:

**JSON format** (`--format json`):
```json
{
  "tool": "selector-capture",
  "version": "0.2.0",
  "nodes": [
    {
      "tool": "windows.find",
      "args": { "output_key": "el_01", "name": "Submit", "control_type": "Button" }
    },
    {
      "tool": "windows.click",
      "args": { "element_key": "el_01" }
    },
    {
      "tool": "windows.find",
      "args": { "output_key": "el_02", "name": "Username", "class_name": "Edit" }
    },
    {
      "tool": "windows.input_text",
      "args": { "element_key": "el_02", "text": "admin" }
    }
  ]
}
```

**Rust format** (`--format rust`):
```rust
use serde_json::json;
use smith_core::RetryPolicy;
use smith_workflow::{EdgeKind, FlowGraph, Node};

let mut g = FlowGraph::builder("recorded_flow");
let n0 = g.add_node(Node::rpa("windows.find", json!({"output_key":"el_01","name":"Submit","control_type":"Button"})));
let n1 = g.add_node(Node::rpa("windows.click", json!({"element_key":"el_01"})));
let n2 = g.add_node(Node::rpa("windows.find", json!({"output_key":"el_02","name":"Username","class_name":"Edit"})));
let n3 = g.add_node(Node::rpa("windows.input_text", json!({"element_key":"el_02","text":"admin"})));
g.connect(n0, EdgeKind::Success, n1);
g.connect(n1, EdgeKind::Success, n2);
g.connect(n2, EdgeKind::Success, n3);
let graph = g.build().expect("valid graph");
```

Applies `EdgeKind::Success` connections between consecutive nodes.

### ⚠️ Boundaries

- `input_text` / `set_text` without `--text` → prompt is mandatory, cannot proceed without it.
- `click` without `output_key` → auto-generates `el_N` with global counter.
- `wait` → prompts for `duration_ms`.
- Format detection: `.rs` → Rust, `.yaml`/`.yml` → YAML, `.json` / default → JSON.
- YAML format omitted from v1 — only `json` and `rust` in first iteration.

---

## 3. Series → flow graph generation (`series` rewrite)

Current `series` mode records raw `Action` enums (Click/Input). Rewrite to produce the same structured output as `record` mode — a sequence of `find + action` pairs.

### 📥 Input (extended `Series`)

| parameter | type | constraint | example |
|-----------|------|-----------|---------|
| `--format` | string | optional; `json`, `rust`; default `json` | `--format rust` |
| `--output` | string | optional; default `selectors.json` | `--output flow.rs` |

### 📤 Behaviour

1. Mouse click at (X, Y):
   - Capture element via `capture_at_point(X, Y)` (same as now).
   - Emit TWO nodes:
     - `windows.find` with the captured selector + auto `output_key`
     - `windows.click` with `element_key` set to that `output_key`
   - Store mapping `el_N → element` for potential subsequent input events.

2. Text input (printable keys accumulated between clicks):
   - On next click / stop: flush buffered text as an `Action::Input`.
   - Emit TWO nodes:
     - `windows.find` with the selector from the LAST captured element (before typing started)
     - `windows.input_text` with `element_key` + captured text
   - If no element was captured before typing → `windows.input_text` without element (sends keys to active window).

3. Ctrl+Shift+F2 → stop, output flow graph in selected format.

### 📤 Output example

```
=== Series Recording ===
  Stopped — generated 14 actions → 28 nodes (find+click/input pairs)
  ✓ Saved to flow.rs
```

### ⚠️ Boundaries

- Click before any element captured → cannot emit find, emit only `windows.click` with ContextError note.
- Typing in a field after navigating via Tab/click → text is associated with the last clicked element.
- Long series (100+ actions) → acceptable; output is text, not real-time.
- `Ctrl+Shift+F2` mid-input → flushes pending text before stopping.

---

## 4. ToolArgs generation rules

| Tool | Schema generated | Notes |
|------|-----------------|-------|
| `find` | `{ output_key, name?, automation_id?, control_type?, class_name? }` | `name` is preferred; if not available — `control_type`; `output_key` is required |
| `click` | `{ element_key }` | Depends on a preceding `find` with matching `element_key` |
| `input_text` | `{ text, element_key?, name?, automation_id?, control_type?, class_name? }` | If `element_key` is set, selector fields are ignored |
| `set_text` | `{ text, element_key, name?, automation_id?, control_type?, class_name? }` | Same as input_text but via ValuePattern |
| `wait` | `{ duration_ms }` | No selector needed; prompts for duration |

Output key naming: `el_01`, `el_02`, ... (global counter, per session).

### Selector priority for find config

Build the `BestSelector` with the following priority to maximise match reliability:

1. If `automation_id` is present → use it as primary selector (most stable across UI changes).
2. If `automation_id` is absent but `name` is present → use `name` + `control_type`.
3. If neither → use `class_name` + `control_type`.
4. Always include `control_type` when available (except for `wait` that has no selector).

---

## 5. Implementation structure

### New / changed files

```
apps/selector-capture/
├── Cargo.toml          # + arboard, + serde for graph model
├── src/
│   ├── main.rs         # + record subcommand; format selection
│   ├── capture.rs      # unchanged (core UIA logic)
│   ├── recorder.rs     # major rewrite of series; + record interactive loop
│   ├── types.rs        # + ToolType, FlowNode, FlowGraphOutput; flatten Action
│   ├── clipboard.rs    # NEW — clipboard abstraction
│   ├── generate.rs     # NEW — config generation per tool type
│   └── format.rs       # NEW — output formatters (json, rust)
```

### Module responsibility

| Module | Responsibility |
|--------|---------------|
| `clipboard.rs` | Wrapper around `arboard::Clipboard`; copy text, check availability, graceful fallback |
| `generate.rs` | Takes `BestSelector` + `ToolType` + params → returns `serde_json::Value` (config) |
| `format.rs` | Takes `Vec<FlowNode>` → formatted string (JSON or Rust code) |
| `recorder.rs` | Interactive loop: global hotkeys, capture, prompt, append to node list; series mode uses same logic |

### Flow types (types.rs additions)

```rust
/// Tool type for config generation
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ToolType {
    Find,
    Click,
    InputText,
    SetText,
    Wait,
}

impl ToolType {
    pub fn all() -> &'static [ToolType] { ... }
    pub fn needs_text(self) -> bool { ... }
    pub fn needs_element_key(self) -> bool { ... }
    pub fn needs_duration(self) -> bool { ... }
}

/// A single node in the generated flow
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FlowNode {
    pub tool: String,         // "windows.find", "windows.click", etc.
    pub args: serde_json::Value,
}
```

### recorder.rs interactive loop (pseudocode)

```
loop {
    wait_for_keypress();
    match key {
        Ctrl => {
            capture_element();
            show_captured();
            prompt_tool_type();
            prompt_params(tool_type);
            generate_and_append(tool_type, selector, params);
        }
        Escape => discard_last();
        CtrlShiftF2 => {
            prompt_format();
            write_output(nodes, format);
            return;
        }
    }
}
```

### Prompt helpers (stderr, stdin):

```
fn prompt_tool_type() -> ToolType       // readline, validate, retry
fn prompt_output_key(default: &str)     // Enter to accept default
fn prompt_text() -> String              // mandatory for input/set_text
fn prompt_duration_ms() -> u64          // mandatory for wait
```

---

## ✅ Success criteria

- [ ] `selector-capture single --clip` copies `windows.find` config to clipboard as compact JSON.
- [ ] `selector-capture single --clip --tool click --output-key btn` copies find + click configs.
- [ ] `selector-capture record` runs an interactive session, prompts for tool/params, outputs a Rust flow.
- [ ] `selector-capture series --format rust` generates `FlowGraph::builder(...)` code from recorded actions.
- [ ] No panics on empty captures, clipboard unavailable, or invalid user input (retry prompt).
- [ ] Auto-generated `output_key` values are unique within a session.
- [ ] `cargo build`, `cargo test`, `cargo clippy -- -D warnings` pass.
- [ ] Backward compatible — existing `single` and `series` without flags produce the same output as before.

---

## 🧩 Dependencies

| Crate | Version | Feature | Why |
|-------|---------|---------|-----|
| `arboard` | 3 | (default) | Clipboard access on Windows via `CF_TEXT` |
| `serde` | workspace | `derive` | `FlowNode` serialization |

---

## 🗓️ Implementation plan

1. **Extend types** — `ToolType`, `FlowNode`, `FlowGraphOutput` enums/structs.
2. **Create `generate.rs`** — `generate_config(selector, tool, params) -> Value`.
3. **Create `format.rs`** — `format_json(nodes)` and `format_rust(nodes)`.
4. **Create `clipboard.rs`** — `copy_to_clipboard(text: &str) -> bool`.
5. **Add `--clip`, `--tool`, `--output-key`, `--text` flags** to `Single` command in `main.rs`.
6. **Add `record` subcommand** with interactive loop in `recorder.rs`.
7. **Rewrite `series` mode** to generate `FlowNode` sequence instead of raw `Action` list.
8. **Update `Cargo.toml`** with new dependencies.
9. **Tests:** unit tests for config generation, format output; manual test for clipboard/interactive.
10. **Checks:** `cargo build`, `cargo test`, `cargo clippy` in Windows target.
