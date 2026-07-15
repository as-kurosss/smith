//! # Smith ↔ Praxis Bridge Example
//!
//! Demonstrates the Tool adapter that allows a praxis Agent to use
//! any `smith_core` tool (e.g. `smith_windows::ClickTool`).
//!
//! The adapter wraps `smith_core::DynTool` as `praxis::agent::Tool`.
//!
//! Run:
//! ```bash
//! cargo run --example smith_bridge
//! ```
//!
//! This example does NOT call a real LLM — it validates that:
//! 1. The adapter builds a correct `ToolSpec` (name, description, schema).
//! 2. A praxis `ToolSet` can hold smith tools.
//! 3. Calling through the adapter reaches the underlying smith tool.

use serde::{Deserialize, Serialize};
use serde_json::{Value, json};
use smith_agent::agent::tool::{
    Tool as PraxisTool, ToolCategory, ToolError as PraxisToolError, ToolSet, ToolSpec,
};
use smith_core::tool::{DynTool, Tool as SmithTool, ToolError as SmithToolError};
use smith_core::{ExecutionContext, Ready, Unvalidated};
use tokio_util::sync::CancellationToken;

// ---------------------------------------------------------------------------
// Step 1: SmithToolAdapter — wraps any smith_core::DynTool as praxis::agent::Tool
// ---------------------------------------------------------------------------

/// Adapter that lets any `smith_core` tool be used as a praxis `Tool`.
///
/// On every `call()` it creates a fresh [`ExecutionContext`] and
/// [`CancellationToken`] and delegates to the underlying smith tool.
pub struct SmithToolAdapter {
    inner: Box<dyn DynTool>,
}

impl SmithToolAdapter {
    /// Wrap a smith tool (already boxed as `DynTool`).
    pub fn new(inner: Box<dyn DynTool>) -> Self {
        Self { inner }
    }

    /// Convenience constructor for `T: SmithTool + 'static`.
    pub fn from<T: SmithTool + 'static>(tool: T) -> Self {
        Self::new(Box::new(tool))
    }
}

#[async_trait::async_trait]
impl PraxisTool for SmithToolAdapter {
    fn spec(&self) -> ToolSpec {
        ToolSpec {
            name: self.inner.name().to_string(),
            description: self.inner.description().to_string(),
            parameters: self.inner.schema(),
            category: ToolCategory::Generic,
        }
    }

    async fn call(&self, args: Value) -> Result<Value, PraxisToolError> {
        let mut ctx: ExecutionContext<Ready> = ExecutionContext::<Unvalidated>::new().validate();
        let token = CancellationToken::new();
        self.inner
            .execute(args, &mut ctx, token)
            .await
            .map_err(|e| PraxisToolError::Execution {
                tool: self.inner.name().to_string(),
                message: e.to_string(),
            })
    }
}

// ---------------------------------------------------------------------------
// Step 2: A minimal smith Tool for demonstration
// ---------------------------------------------------------------------------

/// A deterministic smith tool that echoes its input back.
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
    ) -> Result<EchoOutput, SmithToolError> {
        Ok(EchoOutput {
            result: input.message,
        })
    }
}

// ---------------------------------------------------------------------------
// Step 3: Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

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
        // Wrap via the DynTool path (the real-world path used by ToolRegistry)
        let adapter = SmithToolAdapter::new(Box::new(EchoSmithTool));

        let result = adapter
            .call(json!({"message": "hello from smith!"}))
            .await
            .unwrap();

        assert_eq!(result, json!({"result": "hello from smith!"}));
    }

    #[tokio::test]
    async fn test_adapter_in_praxis_toolset() {
        // Add the wrapped tool to a praxis ToolSet
        let mut toolset = ToolSet::new();
        toolset.add(SmithToolAdapter::from(EchoSmithTool));

        // Specs include the tool's schema
        let specs = toolset.specs();
        assert_eq!(specs.len(), 1);
        assert_eq!(specs[0].name, "smith.echo");

        // Executing through the praxis ToolSet reaches the smith tool
        let result = toolset
            .execute("smith.echo", json!({"message": "via praxis"}))
            .await
            .unwrap();
        assert_eq!(result, json!({"result": "via praxis"}));
    }

    #[tokio::test]
    async fn test_adapter_error_propagation() {
        /// A smith tool that always fails.
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
            ) -> Result<EchoOutput, SmithToolError> {
                Err(SmithToolError::platform_error(
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
        assert!(matches!(err, PraxisToolError::Execution { .. }));
        assert!(err.to_string().contains("something broke"));
    }
}

// ---------------------------------------------------------------------------
// Entry point (non-test)
// ---------------------------------------------------------------------------

#[tokio::main]
async fn main() {
    println!("=== Smith ↔ Praxis Bridge Demo ===\n");

    // Create the adapter
    let adapter = SmithToolAdapter::from(EchoSmithTool);
    let spec = adapter.spec();
    println!("Tool name:        {}", spec.name);
    println!("Tool description: {}", spec.description);
    println!("Tool schema:      {}", spec.parameters);

    // Call the tool through the adapter
    let result = adapter
        .call(json!({"message": "Hello from the bridge!"}))
        .await
        .unwrap();
    println!("\nResult: {:?}", result);

    // Add to a praxis ToolSet (like an Agent would do)
    let mut toolset = ToolSet::new();
    toolset.add(SmithToolAdapter::from(EchoSmithTool));

    println!("\nToolSet has {} tool(s)", toolset.specs().len());
    for s in toolset.specs() {
        println!("  - {}: {}", s.name, s.description);
    }

    let result2 = toolset
        .execute("smith.echo", json!({"message": "via ToolSet"}))
        .await
        .unwrap();
    println!("\nToolSet result: {:?}", result2);

    println!("\n=== Bridge works! Smith tools are usable from praxis agents. ===");
}
