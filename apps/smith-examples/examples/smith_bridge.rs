//! # Smith Bridge — Using `SmithToolAdapter` (canonical adapter)
//!
//! Demonstrates the canonical `smith_agent::tools::SmithToolAdapter` that
//! wraps any `smith_core::DynTool` as a `smith_agent::agent::tool::Tool`.
//!
//! This adapter is the standard integration point between the RPA layer
//! (smith-core) and the agent layer (smith-agent).
//!
//! ## Run
//! ```bash
//! cargo run --example smith_bridge
//! ```

use serde::{Deserialize, Serialize};
use serde_json::{Value, json};
use smith_agent::agent::tool::{Tool, ToolSet};
use smith_agent::tools::SmithToolAdapter;
use smith_core::ExecutionContext;
use smith_core::tool::{Tool as SmithTool, ToolError};
use tokio_util::sync::CancellationToken;

#[cfg(test)]
use smith_agent::agent::tool::ToolCategory;

// ---------------------------------------------------------------------------
// A minimal smith-core tool for demonstration
// ---------------------------------------------------------------------------

#[derive(Debug, Serialize, Deserialize)]
struct EchoInput {
    message: String,
}

#[derive(Debug, Serialize)]
struct EchoOutput {
    result: String,
}

struct EchoSmithTool;

#[async_trait::async_trait]
impl SmithTool for EchoSmithTool {
    type Input = EchoInput;
    type Output = EchoOutput;

    fn name(&self) -> &'static str {
        "smith.echo"
    }

    fn description(&self) -> &'static str {
        "Echoes a message back to the caller"
    }

    fn schema(&self) -> Value {
        json!({
            "type": "object",
            "properties": {
                "message": {
                    "type": "string",
                    "description": "The message to echo"
                }
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
            result: input.message,
        })
    }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("=== Smith ↔ Agent Bridge (canonical adapter) ===\n");

    // Create the adapter using `SmithToolAdapter`
    let adapter = SmithToolAdapter::from(EchoSmithTool);
    let spec = adapter.spec();
    println!("Tool name:        {}", spec.name);
    println!("Tool description: {}", spec.description);
    println!("Tool schema:      {}", spec.parameters);
    println!("Tool category:    {:?}", spec.category);

    // Call the tool through the adapter
    let result = adapter
        .call(json!({"message": "Hello from the bridge!"}))
        .await?;
    println!("\nResult: {:?}", result);

    // Add to a ToolSet (like an Agent would do)
    let mut toolset = ToolSet::new();
    toolset.add(SmithToolAdapter::from(EchoSmithTool));

    println!("\nToolSet has {} tool(s)", toolset.specs().len());
    for s in toolset.specs() {
        println!("  - {}: {}", s.name, s.description);
    }

    let result2 = toolset
        .execute("smith.echo", json!({"message": "via ToolSet"}))
        .await?;
    println!("\nToolSet result: {:?}", result2);

    println!("\n=== Bridge works! Smith tools are usable from agent layer. ===");
    Ok(())
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;
    use smith_agent::agent::tool::ToolError as AgentToolError;

    #[test]
    fn test_adapter_spec_is_correct() {
        let adapter = SmithToolAdapter::from(EchoSmithTool);
        let spec = adapter.spec();

        assert_eq!(spec.name, "smith.echo");
        assert_eq!(spec.description, "Echoes a message back to the caller");
        assert!(spec.parameters.is_object());
        assert_eq!(spec.category, ToolCategory::Generic);
    }

    #[tokio::test]
    async fn test_adapter_call_via_dyntool() {
        let adapter = SmithToolAdapter::new(Box::new(EchoSmithTool));

        let result = adapter
            .call(json!({"message": "hello from smith!"}))
            .await
            .unwrap();

        assert_eq!(result, json!({"result": "hello from smith!"}));
    }

    #[tokio::test]
    async fn test_adapter_in_agent_toolset() {
        let mut toolset = ToolSet::new();
        toolset.add(SmithToolAdapter::from(EchoSmithTool));

        let specs = toolset.specs();
        assert_eq!(specs.len(), 1);
        assert_eq!(specs[0].name, "smith.echo");

        let result = toolset
            .execute("smith.echo", json!({"message": "via toolset"}))
            .await
            .unwrap();
        assert_eq!(result, json!({"result": "via toolset"}));
    }

    #[tokio::test]
    async fn test_adapter_error_propagation() {
        struct FailSmithTool;

        #[async_trait::async_trait]
        impl SmithTool for FailSmithTool {
            type Input = EchoInput;
            type Output = EchoOutput;
            fn name(&self) -> &'static str {
                "smith.fail"
            }
            fn description(&self) -> &'static str {
                "Always fails"
            }
            fn schema(&self) -> Value {
                json!({})
            }
            async fn execute(
                &self,
                _input: EchoInput,
                _ctx: &mut ExecutionContext,
                _token: CancellationToken,
            ) -> Result<EchoOutput, ToolError> {
                Err(ToolError::platform_error(
                    "something broke",
                    std::io::Error::new(std::io::ErrorKind::Other, "oh no"),
                    None,
                ))
            }
        }

        let adapter = SmithToolAdapter::from(FailSmithTool);
        let result = adapter.call(json!({"message": "x"})).await;

        assert!(result.is_err());
        let err = result.unwrap_err();
        assert!(matches!(err, AgentToolError::Execution { .. }));
        assert!(err.to_string().contains("something broke"));
    }
}
