//! # Пример 2: Чистый AI-агент
//!
//! LLM (через Rig) получает инструменты и сам решает,
//! в каком порядке их вызывать для открытия Блокнота, ввода текста и закрытия.
//!
//! ## Запуск
//! ```bash
//! $env:OPENAI_API_KEY = "sk-..."
//! cargo run --example agent_notepad
//! ```

#[cfg(windows)]
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    use std::sync::Arc;

    use rig::tool::ToolDyn;
    use smith_ai::{ProviderConfig, ToolAdapter};
    use smith_core::ExecutionContext;
    use smith_windows::tools::{FindTool, ProcessTool, SetTextTool};
    use tokio::sync::Mutex;
    use tokio_util::sync::CancellationToken;

    // -- API ключ --
    let api_key = std::env::var("OPENAI_API_KEY").expect("OPENAI_API_KEY must be set");

    // -- ExecutionContext, разделяемый между инструментами --
    let ctx = Arc::new(Mutex::new(ExecutionContext::new()));
    let token = CancellationToken::new();

    // -- Оборачиваем Windows-инструменты в Rig-совместимые адаптеры --
    let tools: Vec<Box<dyn ToolDyn>> = vec![
        Box::new(ToolAdapter::new(
            FindTool::new(),
            ctx.clone(),
            token.clone(),
        )),
        Box::new(ToolAdapter::new(
            SetTextTool::new(),
            ctx.clone(),
            token.clone(),
        )),
        Box::new(ToolAdapter::new(
            ProcessTool::new(),
            ctx.clone(),
            token.clone(),
        )),
    ];

    // -- Собираем агента --
    let provider = ProviderConfig::openai(api_key)
        .with_model("mimo-v2.5")
        .with_base_url("https://opencode.ai/zen/go/v1");

    let agent = smith_ai::SmithAgent::builder(provider)
        .system_prompt(
            "You are a Windows automation assistant. \
             You have access to tools:\n\
             - `windows.process` — start or stop an application\n\
             - `windows.find` — find a UI element on the screen\n\
             - `windows.set_text` — set text value of a UI element\n\n\
             When asked to automate Notepad:\n\
             1. Start Notepad with `windows.process`\n\
             2. Find the Edit field by class_name=\"Edit\" with `windows.find`\n\
             3. Type text with `windows.set_text` using element_key from step 2\n\
             4. Close Notepad with `windows.process` stop",
        )
        .with_tools(tools)
        .build()?;

    // -- Запускаем (LLM сам планирует и вызывает инструменты) --
    let result = agent
        .prompt(
            "Open Notepad, type 'Привет от AI-агента!' in the text field, \
             then close Notepad.",
        )
        .await?;

    println!("✅ Agent response: {result}");

    Ok(())
}

#[cfg(not(windows))]
fn main() {
    println!("This example requires Windows (UI Automation).");
}
