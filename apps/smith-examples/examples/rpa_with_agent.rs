//! # Example: rpa_with_agent — RPA tools as Agent Tools via SmithToolAdapter
//!
//! Demonstrates the upper layer of Smith: wrapping smith-core RPA tools as
//! `smith_agent::agent::tool::Tool` using `SmithToolAdapter` and using them
//! through the agent's ToolSet.
//!
//! This example:
//! 1. Creates smith-core tools (Echo, Calculator)
//! 2. Wraps them with `SmithToolAdapter`
//! 3. Adds them to a `ToolSet` (the same ToolSet used by smith-agent agents)
//! 4. Executes them through the agent tool layer
//!
//! ## Run
//! ```bash
//! cargo run --example rpa_with_agent
//! ```

use serde::{Deserialize, Serialize};
use serde_json::{Value, json};
use smith_agent::agent::tool::ToolSet;
use smith_agent::tools::SmithToolAdapter;
use smith_core::ExecutionContext;
use smith_core::tool::{Tool as SmithTool, ToolError};
use tokio_util::sync::CancellationToken;

// ---------------------------------------------------------------------------
// Smith-core Echo tool
// ---------------------------------------------------------------------------

#[derive(Debug, Deserialize, Serialize)]
struct EchoInput {
    message: String,
}

#[derive(Debug, Serialize)]
struct EchoOutput {
    result: String,
}

struct EchoTool;

#[async_trait::async_trait]
impl SmithTool for EchoTool {
    type Input = EchoInput;
    type Output = EchoOutput;

    fn name(&self) -> &'static str {
        "echo"
    }

    fn description(&self) -> &'static str {
        "Echoes back the input message"
    }

    fn schema(&self) -> Value {
        json!({
            "type": "object",
            "properties": {
                "message": { "type": "string", "description": "Text to echo" }
            },
            "required": ["message"]
        })
    }

    async fn execute(
        &self,
        input: EchoInput,
        _ctx: &mut ExecutionContext,
        _token: CancellationToken,
    ) -> Result<EchoOutput, ToolError> {
        Ok(EchoOutput {
            result: format!("You said: {}", input.message),
        })
    }
}

// ---------------------------------------------------------------------------
// Smith-core Calculator tool
// ---------------------------------------------------------------------------

#[derive(Debug, Deserialize, Serialize)]
struct CalcInput {
    a: f64,
    b: f64,
    operator: String,
}

#[derive(Debug, Serialize)]
struct CalcOutput {
    expression: String,
    result: f64,
}

struct CalcTool;

#[async_trait::async_trait]
impl SmithTool for CalcTool {
    type Input = CalcInput;
    type Output = CalcOutput;

    fn name(&self) -> &'static str {
        "calculator"
    }

    fn description(&self) -> &'static str {
        "Performs arithmetic"
    }

    fn schema(&self) -> Value {
        json!({
            "type": "object",
            "properties": {
                "a": { "type": "number" },
                "b": { "type": "number" },
                "operator": { "type": "string", "enum": ["+", "-", "*", "/"] }
            },
            "required": ["a", "b", "operator"]
        })
    }

    async fn execute(
        &self,
        input: CalcInput,
        _ctx: &mut ExecutionContext,
        _token: CancellationToken,
    ) -> Result<CalcOutput, ToolError> {
        match input.operator.as_str() {
            "+" => Ok(CalcOutput {
                expression: format!("{} + {}", input.a, input.b),
                result: input.a + input.b,
            }),
            "-" => Ok(CalcOutput {
                expression: format!("{} - {}", input.a, input.b),
                result: input.a - input.b,
            }),
            "*" => Ok(CalcOutput {
                expression: format!("{} * {}", input.a, input.b),
                result: input.a * input.b,
            }),
            "/" if input.b != 0.0 => Ok(CalcOutput {
                expression: format!("{} / {}", input.a, input.b),
                result: input.a / input.b,
            }),
            "/" => Err(ToolError::invalid_input(
                "Division by zero",
                Some("b".into()),
                Some(json!({"b": input.b})),
            )),
            op => Err(ToolError::invalid_input(
                format!("Unknown op: {op}"),
                Some("operator".into()),
                None,
            )),
        }
    }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("=== Smith RPA + Agent — Tools via SmithToolAdapter ===\n");

    // 1. Wrap smith-core tools using the canonical adapter
    let mut toolset = ToolSet::new();
    toolset.add(SmithToolAdapter::from(EchoTool));
    toolset.add(SmithToolAdapter::from(CalcTool));

    println!("Agent ToolSet has {} tool(s):", toolset.specs().len());
    for spec in toolset.specs() {
        println!(
            "  - {} ({:?}): {}",
            spec.name, spec.category, spec.description
        );
    }
    println!();

    // 2. Execute through ToolSet (the same path an agent's LLM would use)
    println!("--- Calling tools via agent ToolSet ---");

    let echo_result = toolset
        .execute("echo", json!({"message": "Hello from the agent layer!"}))
        .await?;
    println!("  echo -> {echo_result}");

    let calc_result = toolset
        .execute(
            "calculator",
            json!({"a": 100.0, "b": 25.0, "operator": "/"}),
        )
        .await?;
    println!("  calc -> {calc_result}");

    // 3. Error propagation through the adapter
    println!("\n--- Error propagation ---");
    let err = toolset
        .execute("calculator", json!({"a": 1.0, "b": 0.0, "operator": "/"}))
        .await
        .unwrap_err();
    println!("  Agent tool error: {err}");

    // 4. Unknown tool error
    let err = toolset.execute("nonexistent", json!({})).await.unwrap_err();
    println!("  Missing tool error: {err}");

    println!("\n✅ RPA + Agent example completed!");
    Ok(())
}
