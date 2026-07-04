//! # Пример 3: Объединённый workflow (RPA + AI)
//!
//! Детерминированные RPA-шаги (открыть, найти поле, напечатать, закрыть)
//! перемежаются AI-шагом (агент анализирует происходящее).
//!
//! ## Запуск
//! ```bash
//! $env:OPENAI_API_KEY = "sk-..."
//! cargo run --example workflow_notepad
//! ```

#[cfg(windows)]
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    use smith_ai::SmithAgent;
    use smith_core::{ExecutionContext, ToolRegistry};
    use smith_workflow::prelude::*;
    use smith_workflow::{AiHandler, WorkflowExecutor};
    use smith_windows::tools::{FindTool, SetTextTool, ProcessTool};
    use tokio_util::sync::CancellationToken;

    // -- API ключ --
    let api_key =
        std::env::var("OPENAI_API_KEY").expect("OPENAI_API_KEY must be set");

    // -- Регистрируем RPA-инструменты --
    let mut registry = ToolRegistry::new();
    registry.register(FindTool::new());
    registry.register(SetTextTool::new());
    registry.register(ProcessTool::new());

    // -- Создаём AI-агента (без инструментов — Think не вызывает тулы) --
    let provider = smith_ai::ProviderConfig::openai(api_key)
        .with_model("mimo-v2.5")
        .with_base_url("https://opencode.ai/zen/go/v1");
    let ai_agent = SmithAgent::builder(provider)
        .system_prompt("You are a helpful assistant analyzing automation workflows.")
        .build()?;

    // -- Строим гибридный workflow --
    let workflow = Workflow::new("notepad_combined")
        // RPA: открыть Блокнот
        .step(Step::rpa("windows.process").args(json!({
            "action": "start",
            "command": "notepad.exe",
        })))
        // RPA: найти поле ввода (с retry на случай, если окно ещё не готово)
        .step(
            Step::rpa("windows.find").args(json!({
                "class_name": "Edit",
                "control_type": "Edit",
                "output_key": "notepad_edit",
            }))
            .retry(RetryPolicy {
                max_retries: 10,
                delay_ms: 500,
            }),
        )
        // RPA: напечатать текст
        .step(Step::rpa("windows.set_text").args(json!({
            "element_key": "notepad_edit",
            "text": "Hello from combined RPA + AI workflow!",
        })))
        // AI: проанализировать и summarise
        .step(Step::agent_think(
            "Analyze what this Notepad automation workflow just did. \
             Describe its purpose in one short sentence.",
        ))
        // RPA: закрыть Блокнот
        .step(Step::rpa("windows.process").args(json!({
            "action": "stop",
            "name": "notepad.exe",
        })))
        .build();

    // -- Исполняем --
    let executor =
        WorkflowExecutor::new(&registry, Some(&ai_agent as &dyn AiHandler));
    let mut ctx = ExecutionContext::new();
    let token = CancellationToken::new();

    let result = executor.execute(workflow?, &mut ctx, token).await?;

    println!("✅ Combined workflow completed:");
    println!("   name:     {}", result.workflow_name);
    println!("   steps:    {}", result.steps_completed);
    println!("   time_ms:  {}ms", result.execution_time_ms);
    println!("   output:   {}", result.output);

    // Печатаем результат AI-анализа (шаг 3, 0-indexed)
    if let Some(think_result) = result.step_results.get(&3) {
        let think_text = think_result
            .as_str()
            .map(|s| s.to_string())
            .unwrap_or_else(|| serde_json::to_string_pretty(think_result).unwrap_or_default());
        println!("   analysis: {think_text}");
    }

    Ok(())
}

#[cfg(not(windows))]
fn main() {
    println!("This example requires Windows (UI Automation).");
}
