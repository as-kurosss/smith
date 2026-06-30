// crates/smith-core/src/lib.rs
pub mod context;
pub mod error;
pub mod tool;

// Flat API
pub use context::{ContextValue, ExecutionContext};
pub use error::{SmithError, SmithResult};
pub use tool::{Tool, ToolConfig, ToolResult};
