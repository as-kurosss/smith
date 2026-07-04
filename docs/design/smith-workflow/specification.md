## 📐 Specification: smith-workflow | smith

**🎯 Purpose:** Объединить детерминированные RPA-инструменты (домены `windows`, `browser`, и т.д.) с LLM-агентом (`ai`) в единый workflow engine (`agent`), где каждый шаг явно указывает, кто за него отвечает — детерминированный код или LLM.

---

**📦 Структура крейтов:**

```
smith/
├── crates/
│   ├── smith-core/             # Tool trait, ToolRegistry, ExecutionContext (как есть)
│   ├── smith-rpa/              # Библиотека RPA-инструментов по доменам
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── windows/        # Click, Find, InputText, SetText, Process
│   │   │   │   ├── mod.rs
│   │   │   │   ├── click.rs
│   │   │   │   ├── find.rs
│   │   │   │   ├── input_text.rs
│   │   │   │   ├── set_text.rs
│   │   │   │   └── process.rs
│   │   │   ├── browser/        # (заглушка на будущее)
│   │   │   │   └── mod.rs
│   │   │   └── excel/          # (заглушка на будущее)
│   │   │       └── mod.rs
│   │   └── Cargo.toml
│   ├── smith-ai/               # Rig-based LLM агент
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── adapter.rs      # smith-core::Tool → rig::tool::Tool
│   │   │   ├── agent.rs        # SmithAgent — обёртка над Rig Agent
│   │   │   └── provider.rs     # Конфигурация провайдера (OpenAI, Anthropic...)
│   │   └── Cargo.toml
│   └── smith-workflow/         # Workflow engine с шагами
│       ├── src/
│       │   ├── lib.rs
│       │   ├── workflow.rs     # Workflow, Step
│   │   ├── step.rs         # StepKind (Rpa, Agent, Think, Decide)
│       │   ├── context.rs      # WorkflowContext — ExecutionContext + результаты шагов
│       │   ├── executor.rs     # WorkflowExecutor
│       │   └── error.rs        # WorkflowError
│       └── Cargo.toml
├── apps/
│   ├── selector-capture/       # как есть
│   ├── smith-context/          # как есть
│   └── smith-cli/              # (новый) CLI для запуска workflow
└── Cargo.toml                  # workspace manifest
```

**📥 Вход каждого крейта:**

### smith-rpa

```
// Точка входа — Session для каждого домена
use smith_rpa::windows::WindowsSession;
use smith_rpa::domain::{DomainRegistry, DomainTool};

let session = WindowsSession::new()?;

// 1. Автономный вызов (для детерминированных скриптов)
session.find("name=Сохранить")?;
session.click()?;

// 2. Регистрация в ToolRegistry (для передачи в workflow / AI)
let registry = session.tool_registry();
// registry содержит: windows.find, windows.click, windows.input_text, ...

// 3. Передача в AI-агент
let tools: Vec<Box<dyn DomainTool>> = session.tools();
```

### smith-ai

```
// Точка входа — SmithAgent, обёртка над Rig Agent
use smith_ai::SmithAgent;
use smith_ai::provider::OpenAi;

let provider = OpenAi::new(std::env::var("OPENAI_API_KEY")?);

let agent = SmithAgent::builder(provider)
    .with_tools(session.tools())    // DomainTool → rig::tool::Tool
    .system_prompt("Ты ассистент по Windows автоматизации")
    .build();

// Свободный режим (без workflow):
let result = agent.prompt("Открой Блокнот и напиши Привет").await?;

// Режим с workflow:
let result = agent.run_workflow(workflow).await?;
```

### smith-workflow

```
use smith_workflow::{Workflow, Step};
use smith_workflow::agent::Agent;

// Workflow — последовательность шагов
let workflow = Workflow::new("save_document")
    // Шаг 1: Детерминированно открыть Блокнот
    .step(Step::rpa("windows.process").args(json!({
        "action": "start",
        "path": "notepad.exe"
    })))

    // Шаг 2: Подождать окно, найти поле ввода
    .step(Step::rpa("windows.find").args(json!({
        "class_name": "Edit"
    })))

    // Шаг 3: Напечатать текст
    .step(Step::rpa("windows.input_text").args(json!({
        "text": "Hello, World!"
    })))

    // Шаг 4: Agent решает, сохранять или нет
    .step(Step::agent_decide("Нужно ли сохранять файл?")
        .context("Пользователь хочет сохранить документ")
        .options(&["save", "cancel"]))

    // Шаг 5: Если save — детерминированное сохранение
    .step(Step::rpa("windows.send_keys").args(json!({
        "keys": "^s"
    })))
    .build();

// Agent — исполнитель workflow
let agent = Agent::new()
    .with_registry(session.tool_registry())
    .with_ai(ai_agent)
    .run(workflow, ExecutionContext::new())
    .await?;
```

**📤 Выход:**

```
AgentResult {
    success: true,
    workflow_name: "save_document",
    steps_completed: 5,
    output: { "status": "saved", "path": "..." },
    execution_time_ms: 12500,
}
```

На ошибке: `WorkflowError` с указанием шага, причины и текущего состояния контекста. Контекст не теряется — можно retry с того же шага.

---

**⚠️ Границы:**

- **Step::rpa("nonexistent")** — ошибка на этапе `build()`, а не в рантайме. Workflow валидирует имена тулов при сборке.
- **Step::agent_decide с пустым `options`** — паника на этапе сборки (логическая ошибка разработчика).
- **CancellationToken отменён во время RPA-шага** — инструмент сам проверяет токен (уже реализовано в smith-core). Шаг помечается как `Cancelled`, состояние не теряется.
- **LLM не вернул ответ** — `Step::agent_decide` / `Step::agent_think` возвращает `WorkflowError::AgentError` с raw ответом модели для диагностики.
- **RPA-шаг упал (element not found)** — `WorkflowError::StepError { step_idx, source }`. Можно настроить `retry_policy` для шага.
- **Что если тул из другого домена (browser) вызван без session?** — `runtimeRegistry` проверяет, зарегистрирован ли инструмент, иначе `ToolNotFound`.
- **Вложенные workflow:** `Step::workflow(sub_workflow)` — запуск под-workflow как одного шага для композиции.

**📦 StepKind — полная спецификация:**

```rust
pub enum StepKind {
    /// Детерминированный RPA-шаг. Никакого LLM.
    /// name — имя инструмента (например "windows.click")
    /// args — JSON с параметрами
    Rpa {
        name: &'static str,
        args: Value,
        retry: RetryPolicy,
    },

    /// Agent получает prompt и сам решает,
    /// какие RPA-инструменты вызывать и в каком порядке.
    Agent {
        prompt: String,
        tools: Vec<&'static str>,    // какие тулы доступны агенту
        max_steps: usize,            // лимит вызовов инструментов
    },

    /// Agent генерирует данные/решение без вызова инструментов.
    /// Результат сохраняется в WorkflowContext.
    Think {
        prompt: String,
        output_schema: Value,        // JSON Schema ожидаемого ответа
    },

    /// Agent выбирает один вариант из списка.
    /// Результат — выбранный option. Дальнейший ход workflow
    /// зависит от выбора (conditional routing).
    Decide {
        prompt: String,
        options: Vec<&'static str>,
    },

    /// Вложенный workflow
    Workflow(Workflow),
}
```

**🔀 Conditional routing после Decide:**

```rust
// Decide возвращает выбранный option.
// Workflow может ветвиться:

let workflow = Workflow::new("process_document")
    .step(Step::rpa("windows.find").args(json!({"name": "Документ"})))
    .step(Step::agent_decide("Это счёт или договор?")
        .options(&["invoice", "contract"]))
    .on_choice("invoice", Workflow::new("handle_invoice")
        .step(Step::rpa("excel.read").args(json!({"range": "A1:F20"})))
        .step(Step::agent_think("Извлеки сумму и дату")))
    .on_choice("contract", Workflow::new("handle_contract")
        .step(Step::rpa("excel.read").args(json!({"range": "A1:H50"})))
        .step(Step::agent_think("Извлеки стороны и сроки")))
    .build();
```

**🤖 Что становится `domain::windows::click()`:**

В коде это не строковый вызов, а типобезопасный Builder для Step:

```rust
// Именно так будет выглядеть API для разработчика:

use smith_workflow::prelude::*;
use smith_rpa::windows;

// Вариант А: Workflow из Step-ов
fn build_workflow() -> Workflow {
    Workflow::new("demo")
        .step(windows::find("name=Блокнот"))
        .step(windows::click())
        .step(windows::input_text("Привет"))
        // или `.step(agent_think("Проверь результат"))`
        .build()
}

// Вариант Б: Workflow из Step-ов с явными именами
fn build_workflow_verbose() -> Workflow {
    Workflow::new("demo")
        .step(Step::rpa("windows.find").args(json!({"name": "Блокнот"})))
        .step(Step::rpa("windows.click").args(json!({"element_key": "found"})))
        .step(Step::agent("Проверь, открылся ли Блокнот"))
        .build()
}
```

**Вариант А (типобезопасный) — это и есть твоё `domain::windows::click()` в Rust.**

```rust
// smith-rpa::windows — публичные функции-конструкторы Step-ов
// Каждая функция знает свои параметры, возвращает готовый Step

pub fn find(selector: &str) -> Step {
    Step::rpa("windows.find").args(json!({"name": selector}))
}

pub fn click() -> Step {
    Step::rpa("windows.click")
}

pub fn input_text(text: &str) -> Step {
    Step::rpa("windows.input_text").args(json!({"text": text}))
}
```

---

**🔌 n8n как внешний оркестратор (future):**

n8n (Apache 2.0) может использоваться как внешний триггер для smith-workflow:

```
n8n:
  [Folder Watch] → POST localhost:8742/run/process_inbox
  [Schedule 09:00] → POST localhost:8742/run/daily_report
  [Webhook]       → POST localhost:8742/run/{workflow}
  → [Telegram/Slack/Email] уведомление о результате
```

n8n только запускает workflow по триггеру и не управляет RPA-шагами. **Не разрабатывается сейчас**, только имеется в виду.

---

**✅ Success criteria:**

- [ ] `smith-core` остаётся без изменений — Tool trait, ExecutionContext, ToolRegistry как есть
- [ ] `smith-rpa::windows` re-export все существующие инструменты из smith-windows под новым API
- [ ] `smith-rpa::windows::click()` возвращает готовый `Step` (не выполняет ничего)
- [ ] `smith-ai::SmithAgent::builder(provider).with_tools(tools)` собирает Rig-агента
- [ ] `smith-workflow::Workflow` валидирует имена тулов при `build()`
- [ ] `smith-workflow::Agent::run` выполняет workflow: RPA-шаги через ToolRegistry, Agent-шаги через SmithAgent
- [ ] `Step::agent_decide` возвращает выбранный option; workflow поддерживает `on_choice` ветвление
- [ ] `CancellationToken` пробрасывается во все шаги
- [ ] На ошибке RPA-шага можно retry; на ошибке Agent-шага можно fallback
- [ ] `cargo test`, `cargo clippy -- -D warnings` проходят

---

## 🗓️ План реализации

- [ ] Создать `crates/smith-rpa/` — перенести smith-windows как модуль `windows`, добавить `domain.rs` (DomainTool trait + DomainRegistry)
- [ ] Создать `crates/smith-ai/` — адаптер `smith-core::Tool` → `rig::tool::Tool`, обёртка `SmithAgent`
- [ ] Создать `crates/smith-workflow/` — `Workflow`, `Step`, `StepKind`, `WorkflowExecutor`
- [ ] Реализовать `Agent` — объединяет ToolRegistry + SmithAgent, исполняет workflow
- [ ] Добавить `Step::workflow(sub_workflow)` для композиции
- [ ] Добавить `on_choice` conditional routing для `Step::agent_decide`
- [ ] Обновить `README.md` и `ARCHITECTURE.md`
- [ ] Checks: `cargo test`, `cargo clippy -- -D warnings`
