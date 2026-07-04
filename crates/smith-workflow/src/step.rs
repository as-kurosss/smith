// crates/smith-workflow/src/step.rs
use serde_json::Value;
use tracing::warn;

use crate::workflow::Workflow;

/// Политика повторных попыток для RPA-шага.
#[derive(Debug, Clone, Default)]
pub struct RetryPolicy {
    /// Максимальное количество повторов (0 — без повторов).
    pub max_retries: u32,
    /// Задержка между повторами в миллисекундах.
    pub delay_ms: u64,
}

/// Варианты шагов workflow.
#[derive(Debug, Clone)]
pub enum StepKind {
    /// Детерминированный RPA-шаг. Никакого LLM.
    /// name — имя инструмента (например "windows.click").
    Rpa {
        name: &'static str,
        args: Value,
        retry: RetryPolicy,
    },
    /// Agent получает prompt и сам решает,
    /// какие RPA-инструменты вызывать и в каком порядке.
    Agent {
        prompt: String,
        /// Имёна тулов, доступных агенту (подмножество всех зарегистрированных).
        tools: Vec<String>,
        /// Лимит вызовов инструментов за один шаг.
        max_steps: usize,
    },
    /// Agent генерирует данные/решение без вызова инструментов.
    Think {
        prompt: String,
        output_schema: Value,
    },
    /// Agent выбирает один вариант из списка.
    Decide {
        prompt: String,
        options: Vec<String>,
    },
    /// Вложенный workflow.
    Workflow(Workflow),
}

/// Шаг workflow.
///
/// Создаётся через конструкторы:
/// - `Step::rpa("name")` — RPA-шаг
/// - `Step::agent("prompt")` — свободный агент с тулами
/// - `Step::agent_think("prompt")` — LLM генерирует данные
/// - `Step::agent_decide("prompt")` — LLM выбирает вариант
/// - `Step::workflow(sub)` — вложенный workflow
#[derive(Debug, Clone)]
pub struct Step {
    pub(crate) kind: StepKind,
}

impl Step {
    /// Создаёт RPA-шаг.
    pub fn rpa(name: &'static str) -> Self {
        Self {
            kind: StepKind::Rpa {
                name,
                args: Value::Null,
                retry: RetryPolicy::default(),
            },
        }
    }

    /// Задаёт аргументы для RPA-шага.
    pub fn args(mut self, args: Value) -> Self {
        self.kind = match self.kind {
            StepKind::Rpa { name, args: _, retry } => StepKind::Rpa { name, args, retry },
            other => {
                warn!("Step::args() called on non-RPA step, ignoring");
                other
            }
        };
        self
    }

    /// Задаёт политику повторов для RPA-шага.
    pub fn retry(mut self, policy: RetryPolicy) -> Self {
        self.kind = match self.kind {
            StepKind::Rpa {
                name,
                args,
                retry: _,
            } => StepKind::Rpa {
                name,
                args,
                retry: policy,
            },
            other => {
                warn!("Step::retry() called on non-RPA step, ignoring");
                other
            }
        };
        self
    }

    /// Создаёт Agent-шаг (LLM с инструментами).
    pub fn agent(prompt: impl Into<String>) -> Self {
        Self {
            kind: StepKind::Agent {
                prompt: prompt.into(),
                tools: vec![],
                max_steps: 10,
            },
        }
    }

    /// Задаёт список тулов, доступных агенту.
    pub fn tools(mut self, tool_names: Vec<&'static str>) -> Self {
        self.kind = match self.kind {
            StepKind::Agent {
                prompt,
                tools: _,
                max_steps,
            } => StepKind::Agent {
                prompt,
                tools: tool_names.iter().map(|&s| s.to_string()).collect(),
                max_steps,
            },
            other => {
                warn!("Step::tools() called on non-Agent step, ignoring");
                other
            }
        };
        self
    }

    /// Задаёт максимальное количество шагов агента.
    pub fn max_steps(mut self, max: usize) -> Self {
        self.kind = match self.kind {
            StepKind::Agent {
                prompt,
                tools,
                max_steps: _,
            } => StepKind::Agent {
                prompt,
                tools,
                max_steps: max,
            },
            other => {
                warn!("Step::max_steps() called on non-Agent step, ignoring");
                other
            }
        };
        self
    }

    /// Создаёт Think-шаг (LLM генерирует данные).
    pub fn agent_think(prompt: impl Into<String>) -> Self {
        Self {
            kind: StepKind::Think {
                prompt: prompt.into(),
                output_schema: Value::Null,
            },
        }
    }

    /// Задаёт JSON Schema для Think-шага.
    pub fn schema(mut self, schema: Value) -> Self {
        self.kind = match self.kind {
            StepKind::Think {
                prompt,
                output_schema: _,
            } => StepKind::Think {
                prompt,
                output_schema: schema,
            },
            other => {
                warn!("Step::schema() called on non-Think step, ignoring");
                other
            }
        };
        self
    }

    /// Создаёт Decide-шаг (LLM выбирает вариант).
    pub fn agent_decide(prompt: impl Into<String>) -> Self {
        Self {
            kind: StepKind::Decide {
                prompt: prompt.into(),
                options: vec![],
            },
        }
    }

    /// Добавляет контекст к промпту Decide-шага.
    pub fn context(self, context: &str) -> Self {
        match self.kind {
            StepKind::Decide { prompt, options } => {
                Self {
                    kind: StepKind::Decide {
                        prompt: format!("{}\n\nContext: {}", prompt, context),
                        options,
                    },
                }
            }
            other => {
                warn!("Step::context() called on non-Decide step, ignoring");
                Self { kind: other }
            }
        }
    }

    /// Задаёт варианты для Decide-шага.
    pub fn options(mut self, opts: &[&str]) -> Self {
        self.kind = match self.kind {
            StepKind::Decide {
                prompt,
                options: _,
            } => StepKind::Decide {
                prompt,
                options: opts.iter().map(|&s| s.to_string()).collect(),
            },
            other => other,
        };
        self
    }

    /// Создаёт шаг-вложенный-workflow.
    pub fn workflow(workflow: Workflow) -> Self {
        Self {
            kind: StepKind::Workflow(workflow),
        }
    }

    /// Возвращает имя вида шага для логирования.
    pub fn kind_name(&self) -> &'static str {
        match &self.kind {
            StepKind::Rpa { .. } => "RPA",
            StepKind::Agent { .. } => "Agent",
            StepKind::Think { .. } => "Think",
            StepKind::Decide { .. } => "Decide",
            StepKind::Workflow(_) => "Workflow",
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rpa_step_kind_name() {
        let step = Step::rpa("windows.click");
        assert_eq!(step.kind_name(), "RPA");
    }

    #[test]
    fn test_agent_step_kind_name() {
        let step = Step::agent("Do something");
        assert_eq!(step.kind_name(), "Agent");
    }

    #[test]
    fn test_think_step_kind_name() {
        let step = Step::agent_think("Think about it");
        assert_eq!(step.kind_name(), "Think");
    }

    #[test]
    fn test_decide_step_kind_name() {
        let step = Step::agent_decide("Choose").options(&["a", "b"]);
        assert_eq!(step.kind_name(), "Decide");
    }

    #[test]
    fn test_rpa_args_sets_args() {
        let step = Step::rpa("windows.find").args(serde_json::json!({ "name": "test" }));
        assert_eq!(step.kind_name(), "RPA");
    }

    #[test]
    fn test_agent_tools_sets_tools() {
        let step = Step::agent("Do").tools(vec!["tool1"]);
        assert_eq!(step.kind_name(), "Agent");
    }

    #[test]
    fn test_decide_options_are_set() {
        let step = Step::agent_decide("Pick").options(&["x", "y", "z"]);
        assert_eq!(step.kind_name(), "Decide");
    }

    #[test]
    fn test_retry_policy_defaults() {
        let policy = RetryPolicy::default();
        assert_eq!(policy.max_retries, 0);
        assert_eq!(policy.delay_ms, 0);
    }
}
