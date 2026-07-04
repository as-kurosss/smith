// crates/smith-ai/src/lib.rs
//! Rig-based LLM агент.
//!
//! Содержит:
//! - `adapter` — конвертация smith_core::Tool → rig::tool::Tool
//! - `agent` — SmithAgent, обёртка над Rig Agent
//! - `provider` — конфигурация провайдера (OpenAI, Anthropic)

pub mod adapter;
pub mod agent;
pub mod provider;

pub use adapter::ToolAdapter;
pub use agent::SmithAgent;
pub use provider::ProviderConfig;
