// crates/smith-workflow/src/workflow.rs
use std::collections::HashMap;

use crate::error::WorkflowError;
use crate::step::Step;

/// Workflow — последовательность шагов с conditional routing.
///
/// Создаётся через builder:
/// ```ignore
/// let wf = Workflow::new("name")
///     .step(Step::rpa("..."))
///     .step(Step::agent_decide("...").options(&["a", "b"]))
///     .on_choice("a", sub_wf_a)
///     .on_choice("b", sub_wf_b)
///     .build();
/// ```
#[derive(Debug, Clone)]
pub struct Workflow {
    pub(crate) name: String,
    pub(crate) steps: Vec<Step>,
    /// choices[step_index][option] = sub_workflow
    pub(crate) choices: HashMap<usize, HashMap<String, Workflow>>,
}

/// Builder для Workflow.
#[derive(Debug, Clone)]
pub struct WorkflowBuilder {
    name: String,
    steps: Vec<Step>,
    choices: HashMap<usize, HashMap<String, Workflow>>,
}

#[allow(clippy::new_ret_no_self)]
impl Workflow {
    /// Создаёт новый builder.
    pub fn new(name: impl Into<String>) -> WorkflowBuilder {
        WorkflowBuilder {
            name: name.into(),
            steps: vec![],
            choices: HashMap::new(),
        }
    }
}

impl WorkflowBuilder {
    /// Добавляет шаг в workflow.
    pub fn step(mut self, step: Step) -> Self {
        self.steps.push(step);
        self
    }

    /// Добавляет conditional routing для последнего добавленного Decide-шага.
    ///
    /// # Panics
    ///
    /// Паникует, если нет последнего шага (вызвана до `.step()`).
    pub fn on_choice(mut self, option: &str, workflow: Workflow) -> Self {
        let step_idx = self
            .steps
            .len()
            .checked_sub(1)
            .expect("on_choice must follow a step");

        self.choices
            .entry(step_idx)
            .or_default()
            .insert(option.to_string(), workflow);
        self
    }

    /// Собирает Workflow с валидацией.
    ///
    /// # Errors
    ///
    /// Возвращает `WorkflowError::ValidationError`, если:
    /// - У Decide-шага пустой список options.
    pub fn build(self) -> Result<Workflow, WorkflowError> {
        // Валидация: Decide-шаги должны иметь непустые options.
        for (idx, step) in self.steps.iter().enumerate() {
            if let crate::step::StepKind::Decide { options, .. } = &step.kind
                && options.is_empty()
            {
                return Err(WorkflowError::ValidationError(format!(
                    "Step {idx}: Decide must have at least one option",
                )));
            }
        }

        Ok(Workflow {
            name: self.name,
            steps: self.steps,
            choices: self.choices,
        })
    }
}
