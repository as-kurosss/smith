// crates/smith-windows/src/selector.rs
use std::time::Duration;

use uiautomation::core::UIAutomation;
use uiautomation::types::{ControlType, PropertyConditionFlags, TreeScope, UIProperty};
use uiautomation::variants::Variant;
use uiautomation::{Condition, UIElement};

use smith_core::SmithError;

/// Builder-style selector for finding Windows UI elements.
///
/// Uses `uiautomation::Condition` combinators to build a query.
#[derive(Debug, Clone)]
pub struct ElementSelector {
    pid: Option<u32>,
    name: Option<String>,
    automation_id: Option<String>,
    control_type: Option<String>,
    class_name: Option<String>,
    timeout: Duration,
}

impl Default for ElementSelector {
    fn default() -> Self {
        Self {
            pid: None,
            name: None,
            automation_id: None,
            control_type: None,
            class_name: None,
            timeout: Duration::from_secs(5),
        }
    }
}

impl ElementSelector {
    /// Creates a new `ElementSelector` with default values.
    #[must_use]
    pub fn new() -> Self {
        Self::default()
    }

    /// Filters by process ID.
    #[must_use]
    pub fn pid(mut self, pid: u32) -> Self {
        self.pid = Some(pid);
        self
    }

    /// Filters by element name (exact match).
    #[must_use]
    pub fn name(mut self, name: impl Into<String>) -> Self {
        self.name = Some(name.into());
        self
    }

    /// Filters by automation ID.
    #[must_use]
    pub fn automation_id(mut self, automation_id: impl Into<String>) -> Self {
        self.automation_id = Some(automation_id.into());
        self
    }

    /// Filters by control type name (e.g. "Button", "Edit", "Window").
    #[must_use]
    pub fn control_type(mut self, control_type: impl Into<String>) -> Self {
        self.control_type = Some(control_type.into());
        self
    }

    /// Filters by class name.
    #[must_use]
    pub fn class_name(mut self, class_name: impl Into<String>) -> Self {
        self.class_name = Some(class_name.into());
        self
    }

    /// Sets the maximum wait time for element discovery.
    #[must_use]
    pub fn timeout(mut self, timeout: Duration) -> Self {
        self.timeout = timeout;
        self
    }

    /// Builds a `UICondition` from the set fields.
    ///
    /// Returns `None` if no selectors are set (match everything).
    fn build_condition(&self) -> Result<Condition, SmithError> {
        let automation = UIAutomation::new()
            .map_err(|e| SmithError::PlatformError(format!("UIAutomation init: {e}")))?;

        let mut conditions: Vec<Condition> = Vec::new();

        if let Some(ref name) = self.name {
            let cond = automation
                .create_property_condition(
                    UIProperty::Name,
                    Variant::from(name.as_str()),
                    PropertyConditionFlags::None,
                )
                .map_err(|e| SmithError::PlatformError(format!("Name property condition: {e}")))?;
            conditions.push(cond);
        }

        if let Some(ref aid) = self.automation_id {
            let cond = automation
                .create_property_condition(
                    UIProperty::AutomationId,
                    Variant::from(aid.as_str()),
                    PropertyConditionFlags::None,
                )
                .map_err(|e| {
                    SmithError::PlatformError(format!("AutomationId property condition: {e}"))
                })?;
            conditions.push(cond);
        }

        if let Some(ref ct) = self.control_type {
            if let Some(ct_value) = parse_control_type(ct) {
                let cond = automation
                    .create_property_condition(
                        UIProperty::ControlType,
                        Variant::from(ct_value as i32),
                        PropertyConditionFlags::None,
                    )
                    .map_err(|e| {
                        SmithError::PlatformError(format!("ControlType property condition: {e}"))
                    })?;
                conditions.push(cond);
            }
        }

        if let Some(ref cn) = self.class_name {
            let cond = automation
                .create_property_condition(
                    UIProperty::ClassName,
                    Variant::from(cn.as_str()),
                    PropertyConditionFlags::None,
                )
                .map_err(|e| {
                    SmithError::PlatformError(format!("ClassName property condition: {e}"))
                })?;
            conditions.push(cond);
        }

        if let Some(pid) = self.pid {
            let cond = automation
                .create_property_condition(
                    UIProperty::ProcessId,
                    Variant::from(pid as i32),
                    PropertyConditionFlags::None,
                )
                .map_err(|e| {
                    SmithError::PlatformError(format!("ProcessId property condition: {e}"))
                })?;
            conditions.push(cond);
        }

        if conditions.is_empty() {
            return automation
                .create_true_condition()
                .map_err(|e| SmithError::PlatformError(format!("True condition: {e}")));
        }

        let mut iter = conditions.into_iter();
        let first = iter.next().unwrap();
        let result = iter.try_fold(first, |acc, cond| {
            automation
                .create_and_condition(acc, cond)
                .map_err(|e| SmithError::PlatformError(format!("And condition: {e}")))
        })?;

        Ok(result)
    }

    /// Finds the first matching element under `root`.
    ///
    /// # Errors
    ///
    /// Returns `SmithError::ElementNotFound` if no element matches.
    pub fn find_first(&self, root: &UIElement) -> Result<UIElement, SmithError> {
        let condition = self.build_condition()?;
        root.find_first(TreeScope::Descendants, &condition)
            .map_err(|_| SmithError::ElementNotFound)
    }

    /// Finds all matching elements under `root`.
    pub fn find_all(&self, root: &UIElement) -> Result<Vec<UIElement>, SmithError> {
        let condition = self.build_condition()?;
        root.find_all(TreeScope::Descendants, &condition)
            .map_err(|e| SmithError::PlatformError(format!("Find all failed: {e}")))
    }

    /// Finds the first matching element starting from the desktop root.
    ///
    /// # Errors
    ///
    /// Returns `SmithError::ElementNotFound` if no element matches.
    pub fn find_from_desktop(&self) -> Result<UIElement, SmithError> {
        let automation = UIAutomation::new()
            .map_err(|e| SmithError::PlatformError(format!("UIAutomation init: {e}")))?;
        let root = automation
            .get_root_element()
            .map_err(|e| SmithError::PlatformError(format!("Get root element: {e}")))?;
        self.find_first(&root)
    }
}

/// Parses a control type string into its numeric UIA identifier.
fn parse_control_type(s: &str) -> Option<i32> {
    match s.to_lowercase().as_str() {
        "button" => Some(ControlType::Button as i32),
        "calendar" => Some(ControlType::Calendar as i32),
        "checkbox" => Some(ControlType::CheckBox as i32),
        "combobox" => Some(ControlType::ComboBox as i32),
        "edit" | "text" => Some(ControlType::Edit as i32),
        "hyperlink" => Some(ControlType::Hyperlink as i32),
        "image" => Some(ControlType::Image as i32),
        "listitem" => Some(ControlType::ListItem as i32),
        "list" => Some(ControlType::List as i32),
        "menu" => Some(ControlType::Menu as i32),
        "menubar" => Some(ControlType::MenuBar as i32),
        "menuitem" => Some(ControlType::MenuItem as i32),
        "progressbar" => Some(ControlType::ProgressBar as i32),
        "radiobutton" => Some(ControlType::RadioButton as i32),
        "scrollbar" => Some(ControlType::ScrollBar as i32),
        "slider" => Some(ControlType::Slider as i32),
        "spinner" => Some(ControlType::Spinner as i32),
        "statusbar" => Some(ControlType::StatusBar as i32),
        "tab" => Some(ControlType::Tab as i32),
        "tabitem" => Some(ControlType::TabItem as i32),
        "toolbar" => Some(ControlType::ToolBar as i32),
        "tooltip" => Some(ControlType::ToolTip as i32),
        "tree" => Some(ControlType::Tree as i32),
        "treeitem" => Some(ControlType::TreeItem as i32),
        "custom" => Some(ControlType::Custom as i32),
        "group" => Some(ControlType::Group as i32),
        "thumb" => Some(ControlType::Thumb as i32),
        "datagrid" => Some(ControlType::DataGrid as i32),
        "dataitem" => Some(ControlType::DataItem as i32),
        "document" => Some(ControlType::Document as i32),
        "splitbutton" => Some(ControlType::SplitButton as i32),
        "window" => Some(ControlType::Window as i32),
        "pane" => Some(ControlType::Pane as i32),
        "header" => Some(ControlType::Header as i32),
        "headeritem" => Some(ControlType::HeaderItem as i32),
        "table" => Some(ControlType::Table as i32),
        "titlebar" => Some(ControlType::TitleBar as i32),
        "separator" => Some(ControlType::Separator as i32),
        "appbar" => Some(ControlType::AppBar as i32),
        _ => None,
    }
}
