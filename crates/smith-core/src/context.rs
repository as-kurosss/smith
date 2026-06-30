// crates/smith-core/src/context.rs
use std::any::Any;
use std::collections::HashMap;
use std::sync::Arc;

use crate::error::{SmithError, SmithResult};

/// Алгебраический тип данных для хранения значений в контексте.
#[derive(Debug, Clone)]
pub enum ContextValue {
    String(String),
    Number(f64),
    Boolean(bool),
    List(Vec<ContextValue>),
    Bytes(Vec<u8>),
    /// Платформо-специфичные объекты (например, `UIElement` из `smith-windows`).
    Custom(Arc<dyn Any + Send + Sync>),
    Null,
}

impl ContextValue {
    /// Извлекает строковое значение.
    ///
    /// # Errors
    ///
    /// Возвращает `SmithError::InvalidParams`, если значение не является `String`.
    pub fn try_as_string(&self) -> SmithResult<&str> {
        match self {
            ContextValue::String(s) => Ok(s.as_str()),
            _ => Err(SmithError::InvalidParams("Expected String".into())),
        }
    }

    /// Извлекает числовое значение.
    ///
    /// # Errors
    ///
    /// Возвращает `SmithError::InvalidParams`, если значение не является `Number`.
    pub fn try_as_number(&self) -> SmithResult<f64> {
        match self {
            ContextValue::Number(n) => Ok(*n),
            _ => Err(SmithError::InvalidParams("Expected Number".into())),
        }
    }

    /// Извлекает булево значение.
    ///
    /// # Errors
    ///
    /// Возвращает `SmithError::InvalidParams`, если значение не является `Boolean`.
    pub fn try_as_boolean(&self) -> SmithResult<bool> {
        match self {
            ContextValue::Boolean(b) => Ok(*b),
            _ => Err(SmithError::InvalidParams("Expected Boolean".into())),
        }
    }

    /// Извлекает кастомный тип через `Any`.
    ///
    /// # Errors
    ///
    /// Возвращает `SmithError::InvalidParams`, если значение не является `Custom`
    /// или внутренний тип не совпадает с запрашиваемым `T`.
    pub fn try_as_custom<T: 'static>(&self) -> SmithResult<&T> {
        match self {
            ContextValue::Custom(arc) => arc
                .downcast_ref::<T>()
                .ok_or_else(|| SmithError::InvalidParams("Custom type mismatch".into())),
            _ => Err(SmithError::InvalidParams("Expected Custom type".into())),
        }
    }
}

/// Контекст выполнения со стеком скоупов для изоляции переменных.
pub struct ExecutionContext {
    scopes: Vec<HashMap<String, ContextValue>>,
}

impl ExecutionContext {
    /// Создаёт новый контекст с глобальным скоупом.
    #[must_use]
    pub fn new() -> Self {
        Self {
            scopes: vec![HashMap::new()],
        }
    }

    /// Создаёт новый локальный скоуп (например, при входе в цикл или функцию).
    pub fn push_scope(&mut self) {
        self.scopes.push(HashMap::new());
    }

    /// Уничтожает текущий локальный скоуп, освобождая память от временных переменных.
    pub fn pop_scope(&mut self) {
        if self.scopes.len() > 1 {
            self.scopes.pop();
        }
    }

    /// Записывает переменную в текущий (самый верхний) скоуп.
    pub fn set(&mut self, key: impl Into<String>, value: ContextValue) {
        if let Some(scope) = self.scopes.last_mut() {
            scope.insert(key.into(), value);
        }
    }

    /// Читает переменную, начиная поиск с локального скоупа к глобальному (LIFO).
    #[must_use]
    pub fn get(&self, key: &str) -> Option<&ContextValue> {
        for scope in self.scopes.iter().rev() {
            if let Some(value) = scope.get(key) {
                return Some(value);
            }
        }
        None
    }
}

impl Default for ExecutionContext {
    fn default() -> Self {
        Self::new()
    }
}
