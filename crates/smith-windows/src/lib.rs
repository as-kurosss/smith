// crates/smith-windows/src/lib.rs
pub mod tools;

#[cfg(windows)]
pub mod element;
#[cfg(windows)]
pub mod selector;

#[cfg(windows)]
pub use element::SafeUIElement;
#[cfg(windows)]
pub use selector::ElementSelector;
#[cfg(windows)]
pub use tools::ClickTool;
#[cfg(windows)]
pub use tools::FindTool;
#[cfg(windows)]
pub use tools::InputTextTool;
#[cfg(windows)]
pub use tools::SetTextTool;
#[cfg(windows)]
pub use tools::ProcessTool;
