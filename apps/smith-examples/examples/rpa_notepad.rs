//! # Пример 1: Чистый RPA
//!
//! Все шаги детерминированы — никакого AI.
//! Workflow: открыть Блокнот → найти поле Edit → напечатать текст → закрыть.
//!
//! ## Запуск
//! ```bash
//! cargo run --example rpa_notepad
//! ```

#[cfg(windows)]
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    use smith_core::{ExecutionContext, ToolRegistry};
    use smith_windows::tools::{FindTool, ProcessTool, SetTextTool};
    use smith_workflow::WorkflowExecutor;
    use smith_workflow::prelude::*;
    use tokio_util::sync::CancellationToken;

    // -- Регистрируем Windows-инструменты --
    let mut registry = ToolRegistry::new();
    registry.register(FindTool::new());
    registry.register(SetTextTool::new());
    registry.register(ProcessTool::new());

    // -- Строим workflow из RPA-шагов --
    let workflow = Workflow::new("rpa_notepad")
        // 1. Запустить notepad.exe
        .step(Step::rpa("windows.process").args(json!({
            "action": "start",
            "command": "notepad.exe",
        })))
        // 2. Найти поле ввода (Edit) — с retry, т.к. окно может открываться не мгновенно
        .step(
            Step::rpa("windows.find")
                .args(json!({
                    "class_name": "Edit",
                    "control_type": "Edit",
                    "output_key": "notepad_edit",
                }))
                .retry(RetryPolicy {
                    max_retries: 10,
                    delay_ms: 500,
                }),
        )
        // 3. Напечатать текст через ValuePattern (быстрее, чем input_text)
        .step(Step::rpa("windows.set_text").args(json!({
            "element_key": "notepad_edit",
            "text": "Hello from smith RPA!",
        })))
        // 4. Пауза 3 секунды — чтобы увидеть результат
        .step(Step::rpa("windows.process").args(json!({
            "action": "sleep",
            "duration_ms": 3000,
        })))
        // 5. Закрыть Блокнот (force kill — для демо)
        .step(Step::rpa("windows.process").args(json!({
            "action": "stop",
            "name": "notepad.exe",
        })))
        .build();

    // -- Исполняем workflow --
    let executor = WorkflowExecutor::new(&registry, None::<&dyn smith_workflow::AiHandler>);
    let mut ctx = ExecutionContext::new();
    let token = CancellationToken::new();

    let result = executor.execute(workflow?, &mut ctx, token).await?;

    println!("✅ RPA workflow completed:");
    println!("   name:     {}", result.workflow_name);
    println!("   steps:    {}", result.steps_completed);
    println!("   time_ms:  {}", result.execution_time_ms);
    println!("   output:   {}", result.output);

    Ok(())
}

#[cfg(not(windows))]
fn main() {
    println!("This example requires Windows (UI Automation).");
}
