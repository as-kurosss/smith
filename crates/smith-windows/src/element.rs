// crates/smith-windows/src/element.rs
use std::sync::Arc;
use uiautomation::UIElement;

/// Потокобезопасная обертка над `UIElement`.
///
/// # Safety
///
/// `UIElement` внутри содержит `NonNull<c_void>` (COM-интерфейс), который
/// не реализует `Send`. Однако объекты UI Automation являются
/// free-threaded и могут безопасно передаваться между потоками.
/// Все мутации (клики, ввод) выполняются через `spawn_blocking`,
/// где COM-вызовы происходят в выделенном потоке.
#[derive(Debug)]
pub struct SafeUIElement(Arc<UIElement>);

impl SafeUIElement {
    /// Создаёт новую потокобезопасную обёртку.
    #[must_use]
    pub fn new(element: UIElement) -> Self {
        // SAFETY: UIElement is a free-threaded COM object despite lacking
        // Send/Sync markers. Thread safety is enforced by restricting all
        // mutating operations to spawn_blocking contexts.
        #[allow(clippy::arc_with_non_send_sync)]
        Self(Arc::new(element))
    }

    /// Возвращает ссылку на внутренний элемент.
    #[must_use]
    pub fn inner(&self) -> &UIElement {
        &self.0
    }
}

// SAFETY: UI Automation elements are free-threaded COM objects.
// They can be safely sent between threads. All mutating operations
// are performed inside spawn_blocking to avoid blocking the async runtime.
unsafe impl Send for SafeUIElement {}
unsafe impl Sync for SafeUIElement {}

impl Clone for SafeUIElement {
    fn clone(&self) -> Self {
        Self(Arc::clone(&self.0))
    }
}
