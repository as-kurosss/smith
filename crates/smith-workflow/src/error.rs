// crates/smith-workflow/src/error.rs
use thiserror::Error;

/// Ошибки выполнения workflow.
#[derive(Error, Debug)]
pub enum WorkflowError {
    /// Ошибка валидации workflow (на этапе build()).
    #[error("Workflow validation error: {0}")]
    ValidationError(String),

    /// Инструмент RPA не найден в реестре.
    #[error("Tool '{0}' not found in registry")]
    ToolNotFound(String),

    /// Ошибка выполнения RPA-шага.
    #[error("Step {} failed: {source}", step_idx)]
    StepError {
        /// Индекс шага в workflow.
        step_idx: usize,
        /// Причина ошибки.
        #[source]
        source: Box<dyn std::error::Error + Send + Sync>,
    },

    /// Ошибка выполнения AI-агента.
    #[error("Agent error: {0}")]
    AgentError(String),

    /// Агент не сконфигурирован (пытаемся выполнить Agent/Think/Decide без AI).
    #[error("Agent not configured but AI step was requested")]
    AgentNotConfigured,

    /// Workflow отменён.
    #[error("Workflow cancelled")]
    Cancelled,

    /// Ошибка провайдера (OpenAI/Anthropic и т.д.).
    #[error("Provider error: {0}")]
    ProviderError(String),

    /// Ошибка сериализации/десериализации.
    #[error("Serialization error: {0}")]
    SerdeError(#[from] serde_json::Error),

    /// Прочие ошибки.
    #[error("{0}")]
    Other(String),
}

/// Контекст ошибки RPA-шага: имя тула + аргументы + оригинальная ошибка.
#[derive(Debug)]
pub struct StepErrorContext {
    /// Имя инструмента (например "windows.click").
    pub tool: String,
    /// Аргументы вызова.
    pub args: serde_json::Value,
    /// Оригинальная ошибка выполнения.
    pub inner: smith_core::SmithError,
}

impl std::fmt::Display for StepErrorContext {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "tool '{}' with args {} failed: {}",
            self.tool, self.args, self.inner
        )
    }
}

impl std::error::Error for StepErrorContext {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        Some(&self.inner)
    }
}

/// Результат выполнения workflow.
#[derive(Debug, Clone)]
pub struct AgentResult {
    /// Успешно ли выполнен workflow.
    pub success: bool,
    /// Имя workflow.
    pub workflow_name: String,
    /// Количество выполненных шагов.
    pub steps_completed: usize,
    /// Выходные данные (последний результат или итоговый JSON).
    pub output: serde_json::Value,
    /// Результаты всех шагов (индекс шага → JSON).
    pub step_results: std::collections::HashMap<usize, serde_json::Value>,
    /// Время выполнения в миллисекундах.
    pub execution_time_ms: u64,
}
