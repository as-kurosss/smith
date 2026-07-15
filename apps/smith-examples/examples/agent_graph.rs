//! # Example: agent_graph — AI Agent inside FlowGraph with conditional routing
//!
//! Demonstrates a FlowGraph where an AI agent (Think) analyses input and a
//! Router decides the next step — all without any RPA tools.
//!
//! The graph:
//!
//! ```text
//! [think: classifier] ─success→ [router]
//!       │                            │
//!       └──failure───────────────────┘
//!                                     │
//!                        ┌────────────┼────────────┐
//!                        ▼            ▼            ▼
//!                   [think: ok]  [think: review]  [think: error]
//! ```
//!
//! ## Prerequisites
//! Set `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` for real AI inference.
//! Without one, the example still runs using a mock handler.
//!
//! ## Run
//! ```bash
//! cargo run --example agent_graph
//! ```

use async_trait::async_trait;
use serde_json::{Value, json};
use smith_core::{
    AiHandler, ContextValue, ExecutionContext, SmithResult, ToolRegistry, Unvalidated,
};
use smith_workflow::{EdgeKind, FlowGraph, GraphExecutor, Node};
use tokio_util::sync::CancellationToken;

// ---------------------------------------------------------------------------
// Mock AiHandler — returns deterministic responses (no LLM needed)
// ---------------------------------------------------------------------------

struct MockAi;

#[async_trait]
impl AiHandler for MockAi {
    async fn agent_run(
        &self,
        _prompt: &str,
        _tools: &[String],
        _max_steps: usize,
        _ctx: &mut ExecutionContext,
        _token: &CancellationToken,
    ) -> SmithResult<Value> {
        Ok(json!({"message": "mock response"}))
    }

    async fn think(
        &self,
        _prompt: &str,
        _schema: &Value,
        _ctx: &mut ExecutionContext,
        _token: &CancellationToken,
    ) -> SmithResult<Value> {
        Ok(json!({"grade": "fair", "reason": "Mock classification"}))
    }

    async fn decide(
        &self,
        _prompt: &str,
        options: &[String],
        _ctx: &mut ExecutionContext,
        _token: &CancellationToken,
    ) -> SmithResult<String> {
        Ok(options.first().cloned().unwrap_or_default())
    }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("=== Smith Agent Graph — AI Decision with Conditional Routing ===\n");

    // Use MockAi when no API key is available
    let ai_handler: &dyn AiHandler = &MockAi;

    // -- Build FlowGraph --
    let registry = ToolRegistry::new();
    let mut b = FlowGraph::builder("ai_decision");

    // Node 1: Think — AI classifier
    let classifier = b.add_node(Node::Think {
        prompt: "Classify the user's input score (0-100) into: \
                 'excellent' (90+), 'good' (70-89), 'fair' (50-69), 'poor' (<50). \
                 Return JSON {\"grade\": \"...\", \"reason\": \"...\"}."
            .to_string(),
        output_schema: json!({
            "type": "object",
            "properties": {
                "grade": { "type": "string", "enum": ["excellent", "good", "fair", "poor"] },
                "reason": { "type": "string" }
            }
        }),
    });

    // Node 2: Router — picks next step based on AI analysis
    let router = b.add_node(Node::Router {
        prompt: "Based on the grade, choose: \
                 'process_ok' for excellent/good, \
                 'needs_review' for fair, \
                 'process_error' for poor."
            .to_string(),
        options: vec![
            ("process_ok".into(), "Handle valid result".into()),
            ("needs_review".into(), "Flag for review".into()),
            ("process_error".into(), "Handle poor result".into()),
        ],
    });

    // Node 3: Think — success handler
    let handle_ok = b.add_node(Node::Think {
        prompt: "The score was classified as excellent or good. \
                 Prepare a congratulatory message."
            .to_string(),
        output_schema: json!({"type": "object", "properties": {"message": {"type": "string"}}}),
    });

    // Node 4: Think — review handler
    let handle_review = b.add_node(Node::Think {
        prompt: "The score was classified as fair. Prepare a message suggesting \
                 improvement areas."
            .to_string(),
        output_schema: json!({"type": "object", "properties": {"message": {"type": "string"}}}),
    });

    // Node 5: Think — error handler
    let handle_error = b.add_node(Node::Think {
        prompt: "The score was classified as poor. Prepare an alert message.".to_string(),
        output_schema: json!({"type": "object", "properties": {"message": {"type": "string"}}}),
    });

    // -- Connect edges --
    b.connect(classifier, EdgeKind::Success, router);
    b.on_choice(router, "process_ok", handle_ok);
    b.on_choice(router, "needs_review", handle_review);
    b.on_choice(router, "process_error", handle_error);
    b.connect(classifier, EdgeKind::Failure, handle_error);

    // Build graph
    let graph = b
        .build()
        .map_err(|e| format!("Graph validation failed: {e}"))?;

    println!(
        "Graph '{}' built with {} node(s):",
        graph.name,
        graph.nodes.len()
    );
    for (i, node) in graph.nodes.iter().enumerate() {
        println!("  {i}: {node:?}");
    }
    println!();

    // -- Execute --
    let executor = GraphExecutor::new(&registry, Some(ai_handler));
    let mut ctx = ExecutionContext::<Unvalidated>::new().validate();
    ctx.set("score", ContextValue::String("95".into()));
    let token = CancellationToken::new();

    println!("--- Executing graph (score = 95) ---");
    let result = executor.execute(&graph, &mut ctx, token).await?;
    println!("✅ Output: {result}");

    println!("\n(Hint: try setting different scores to see different routing paths)");
    Ok(())
}
