//! # Example: rpa_basic — Pure RPA tool execution
//!
//! Demonstrates the lowest layer of Smith: executing smith-core tools
//! directly through the `ExecutionContext` without any AI or agent.
//!
//! This example:
//! 1. Creates a custom `EchoTool` implementing `smith_core::Tool`
//! 2. Registers it in a `ToolRegistry`
//! 3. Creates an `ExecutionContext<Ready>` and invokes the tool
//!
//! ## Run
//! ```bash
//! cargo run --example rpa_basic
//! ```

use serde::{Deserialize, Serialize};
use serde_json::{Value, json};
use smith_core::tool::{Tool, ToolError};
use smith_core::{ExecutionContext, ToolRegistry, Unvalidated};
use tokio_util::sync::CancellationToken;

// ---------------------------------------------------------------------------
// A simple Echo tool (no platform dependencies)
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
impl Tool for EchoTool {
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
        println!("  [echo] received: {}", input.message);
        Ok(EchoOutput {
            result: format!("You said: {}", input.message),
        })
    }
}

// ---------------------------------------------------------------------------
// A Calculator tool (cross-platform)
// ---------------------------------------------------------------------------

struct CalculatorTool;

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

#[async_trait::async_trait]
impl Tool for CalculatorTool {
    type Input = CalcInput;
    type Output = CalcOutput;

    fn name(&self) -> &'static str {
        "calculator"
    }

    fn description(&self) -> &'static str {
        "Performs basic arithmetic: +, -, *, /"
    }

    fn schema(&self) -> Value {
        json!({
            "type": "object",
            "properties": {
                "a": { "type": "number", "description": "First operand" },
                "b": { "type": "number", "description": "Second operand" },
                "operator": {
                    "type": "string",
                    "enum": ["+", "-", "*", "/"],
                    "description": "Arithmetic operator"
                }
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
        let result = match input.operator.as_str() {
            "+" => input.a + input.b,
            "-" => input.a - input.b,
            "*" => input.a * input.b,
            "/" => {
                if input.b == 0.0 {
                    return Err(ToolError::invalid_input(
                        "Division by zero",
                        Some("b".into()),
                        Some(json!({"b": input.b})),
                    ));
                }
                input.a / input.b
            }
            op => {
                return Err(ToolError::invalid_input(
                    format!("Unknown operator: {op}"),
                    Some("operator".into()),
                    Some(json!({"operator": op})),
                ));
            }
        };
        println!(
            "  [calc] {} {} {} = {result}",
            input.a, input.operator, input.b
        );
        Ok(CalcOutput {
            expression: format!("{} {} {}", input.a, input.operator, input.b),
            result,
        })
    }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("=== Smith RPA Basic — Direct Tool Execution ===\n");

    // 1. Register tools
    let mut registry = ToolRegistry::new();
    registry.register(EchoTool);
    registry.register(CalculatorTool);
    println!("Registered {} tool(s):", registry.list_tools().len());
    for name in registry.list_tools() {
        println!("  - {name}");
    }
    println!();

    // 2. Create execution context
    let mut ctx = ExecutionContext::<Unvalidated>::new().validate();
    let token = CancellationToken::new();

    // 3. Execute Echo tool
    println!("--- Echo Tool ---");
    let echo_result = registry
        .execute(
            "echo",
            json!({"message": "Hello from Smith RPA!"}),
            &mut ctx,
            token.clone(),
        )
        .await?;
    println!("  Output: {echo_result}\n");

    // 4. Execute Calculator tool
    println!("--- Calculator Tool ---");
    let calc_result = registry
        .execute(
            "calculator",
            json!({"a": 42.0, "b": 7.0, "operator": "*"}),
            &mut ctx,
            token.clone(),
        )
        .await?;
    println!("  Output: {calc_result}\n");

    // 5. Error handling demo
    println!("--- Error Handling ---");
    let err_result = registry
        .execute(
            "calculator",
            json!({"a": 10.0, "b": 0.0, "operator": "/"}),
            &mut ctx,
            token.clone(),
        )
        .await;
    match err_result {
        Err(e) => println!("  Caught expected error: {e}"),
        Ok(v) => println!("  Unexpected success: {v}"),
    }

    println!("\n✅ RPA Basic example completed successfully!");
    Ok(())
}
