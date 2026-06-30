// crates/smith-core/src/tool.rs
use async_trait::async_trait;
use serde_json::Value;
use tokio_util::sync::CancellationToken;

use crate::context::ExecutionContext;
use crate::error::SmithResult;

/// Универсальный транспорт для параметров инструмента.
pub type ToolConfig = Value;

/// Результат выполнения инструмента.
pub type ToolResult = Value;

/// Базовый трейт для всех инструментов автоматизации.
///
/// # Требования
/// - `Send + Sync`: Инструменты могут выполняться в multi-thread runtime Tokio.
/// - Stateless: Сам инструмент не хранит состояние исполнения, только конфигурацию.
#[async_trait]
pub trait Tool: Send + Sync {
    /// Уникальное имя инструмента (например, `windows.click`).
    fn name(&self) -> &'static str;

    /// Описание для документации и LLM-агентов.
    fn description(&self) -> &'static str;

    /// JSON Schema для валидации `ToolConfig`.
    fn schema(&self) -> Value;

    /// Асинхронное выполнение инструмента.
    ///
    /// # Arguments
    /// * `config` - Параметры вызова (валидируются через schema)
    /// * `ctx` - Контекст выполнения (чтение/запись переменных)
    /// * `token` - Токен отмены для graceful shutdown
    async fn execute(
        &self,
        config: ToolConfig,
        ctx: &mut ExecutionContext,
        token: CancellationToken,
    ) -> SmithResult<ToolResult>;
}
