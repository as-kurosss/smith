// crates/smith-workflow/src/context.rs
use std::collections::HashMap;

use serde_json::Value;
use smith_core::ExecutionContext;

/// Контекст выполнения workflow.
///
/// Оборачивает `smith_core::ExecutionContext` и добавляет:
/// - Результаты выполненных шагов (step_results)
/// - Текущий индекс шага
/// - Время начала выполнения
pub struct WorkflowContext {
    /// Внутренний контекст smith-core (переменные, scope).
    pub inner: ExecutionContext,
    /// Результаты выполненных шагов: step_index → result JSON.
    pub step_results: HashMap<usize, Value>,
    /// Текущий индекс выполняемого шага.
    pub current_step: usize,
    /// Timestamp начала выполнения workflow (ms since epoch).
    pub started_at: u64,
    /// Количество RPA-шагов выполнено.
    pub rpa_count: usize,
    /// Количество Agent-шагов выполнено.
    pub agent_count: usize,
}

impl WorkflowContext {
    /// Создаёт новый контекст.
    pub fn new() -> Self {
        Self {
            inner: ExecutionContext::new(),
            step_results: HashMap::new(),
            current_step: 0,
            started_at: Self::now(),
            rpa_count: 0,
            agent_count: 0,
        }
    }

    /// Сохраняет результат шага.
    pub fn set_step_result(&mut self, index: usize, result: Value) {
        self.step_results.insert(index, result);
    }

    /// Получает сохранённый результат шага.
    #[must_use]
    pub fn get_step_result(&self, index: usize) -> Option<&Value> {
        self.step_results.get(&index)
    }

    /// Возвращает elapsed time в миллисекундах.
    #[must_use]
    pub fn elapsed_ms(&self) -> u64 {
        Self::now() - self.started_at
    }

    fn now() -> u64 {
        use std::time::{SystemTime, UNIX_EPOCH};
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_millis() as u64)
            .unwrap_or(0)
    }
}

impl Default for WorkflowContext {
    fn default() -> Self {
        Self::new()
    }
}
