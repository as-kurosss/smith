// crates/smith-windows/src/tools/mod.rs
#[cfg(windows)]
pub mod click;
#[cfg(windows)]
pub mod find;
#[cfg(windows)]
pub mod input_text;
#[cfg(windows)]
pub mod set_text;
#[cfg(windows)]
pub mod process;

#[cfg(windows)]
pub use click::ClickTool;
#[cfg(windows)]
pub use find::FindTool;
#[cfg(windows)]
pub use input_text::InputTextTool;
#[cfg(windows)]
pub use set_text::SetTextTool;
#[cfg(windows)]
pub use process::ProcessTool;
