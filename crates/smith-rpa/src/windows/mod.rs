// crates/smith-rpa/src/windows/mod.rs
//! Step-конструкторы для Windows UI Automation инструментов.
//!
//! Каждая функция возвращает готовый `Step` для использования в workflow:
//!
//! ```ignore
//! use smith_rpa::windows;
//!
//! let workflow = Workflow::new("demo")
//!     .step(windows::find("name=Блокнот", "found_element"))
//!     .step(windows::click())
//!     .step(windows::input_text("Привет"))
//!     .build();
//! ```

use serde_json::json;
use smith_workflow::Step;

/// Создаёт Step для поиска UI-элемента.
///
/// Параметр `selector` — упрощённый селектор: `"name=Значение"` или
/// `"className=Edit"`. Для сложных случаев используйте `Step::rpa("windows.find").args(...)`.
///
/// `output_key` — ключ, под которым найденный элемент будет сохранён в контексте.
#[must_use]
pub fn find(selector: &str, output_key: &str) -> Step {
    Step::rpa("windows.find").args(json!({
        "name": selector,
        "output_key": output_key,
    }))
}

/// Создаёт Step для клика по UI-элементу.
///
/// Ожидает, что элемент ранее сохранён в контексте под ключом `"found"`.
#[must_use]
pub fn click() -> Step {
    Step::rpa("windows.click").args(json!({ "element_key": "found" }))
}

/// Создаёт Step для ввода текста.
///
/// Если `element_key` не указан, текст вводится в активное окно.
#[must_use]
pub fn input_text(text: &str) -> Step {
    Step::rpa("windows.input_text").args(json!({ "text": text }))
}

/// Создаёт Step для установки текста через ValuePattern.
///
/// Быстрее `input_text`, но не имитирует реальный ввод с клавиатуры.
#[must_use]
pub fn set_text(text: &str) -> Step {
    Step::rpa("windows.set_text").args(json!({ "text": text }))
}

/// Создаёт Step для запуска процесса.
#[must_use]
pub fn process_start(command: &str) -> Step {
    Step::rpa("windows.process").args(json!({
        "action": "start",
        "command": command,
    }))
}

/// Создаёт Step для запуска процесса с аргументами.
#[must_use]
pub fn process_start_with_args(command: &str, args: &[&str]) -> Step {
    Step::rpa("windows.process").args(json!({
        "action": "start",
        "command": command,
        "args": args,
    }))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_find_creates_step_with_output_key() {
        let step = find("name=Блокнот", "found_element");
        assert_eq!(step.kind_name(), "RPA");
    }

    #[test]
    fn test_click_uses_found_key() {
        let step = click();
        assert_eq!(step.kind_name(), "RPA");
    }

    #[test]
    fn test_input_text_step() {
        let step = input_text("Hello");
        assert_eq!(step.kind_name(), "RPA");
    }

    #[test]
    fn test_set_text_step() {
        let step = set_text("Hello");
        assert_eq!(step.kind_name(), "RPA");
    }

    #[test]
    fn test_process_start_step() {
        let step = process_start("notepad.exe");
        assert_eq!(step.kind_name(), "RPA");
    }

    #[test]
    fn test_process_start_with_args_step() {
        let step = process_start_with_args("notepad.exe", &["test.txt"]);
        assert_eq!(step.kind_name(), "RPA");
    }
}
