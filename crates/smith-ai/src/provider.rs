// crates/smith-ai/src/provider.rs
//! Конфигурация LLM-провайдера.

/// Конфигурация провайдера LLM.
#[derive(Clone)]
pub enum ProviderConfig {
    /// OpenAI (GPT-4o, o4-mini, GPT-4.1 и т.д.).
    OpenAi {
        /// API ключ.
        api_key: String,
        /// Модель (по умолчанию "gpt-4o", обычно заменяется под ваш прокси).
        model: String,
        /// Базовый URL (для self-hosted / proxy).
        base_url: Option<String>,
    },
    /// Anthropic (Claude).
    Anthropic {
        /// API ключ.
        api_key: String,
        /// Модель (по умолчанию "claude-sonnet-4-20250514").
        model: String,
        /// Базовый URL (для self-hosted / proxy).
        base_url: Option<String>,
    },
}

impl ProviderConfig {
    /// Создаёт конфиг OpenAI.
    #[must_use]
    pub fn openai(api_key: impl Into<String>) -> Self {
        Self::OpenAi {
            api_key: api_key.into(),
            model: "gpt-4o".to_string(),
            base_url: None,
        }
    }

    /// Создаёт конфиг Anthropic.
    #[must_use]
    pub fn anthropic(api_key: impl Into<String>) -> Self {
        Self::Anthropic {
            api_key: api_key.into(),
            model: "claude-sonnet-4-20250514".to_string(),
            base_url: None,
        }
    }

    /// Задаёт модель.
    #[must_use]
    pub fn with_model(mut self, model: impl Into<String>) -> Self {
        match &mut self {
            Self::OpenAi { model: m, .. } | Self::Anthropic { model: m, .. } => {
                *m = model.into();
            }
        }
        self
    }

    /// Задаёт базовый URL.
    #[must_use]
    pub fn with_base_url(mut self, url: impl Into<String>) -> Self {
        match &mut self {
            Self::OpenAi { base_url: b, .. } | Self::Anthropic { base_url: b, .. } => {
                *b = Some(url.into());
            }
        }
        self
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_openai_default_model() {
        let config = ProviderConfig::openai("sk-test");
        match config {
            ProviderConfig::OpenAi {
                api_key,
                model,
                base_url,
            } => {
                assert_eq!(api_key, "sk-test");
                assert_eq!(model, "gpt-4o");
                assert!(base_url.is_none());
            }
            _ => panic!("Expected OpenAi variant"),
        }
    }

    #[test]
    fn test_anthropic_default_model() {
        let config = ProviderConfig::anthropic("sk-ant-test");
        match config {
            ProviderConfig::Anthropic {
                api_key,
                model,
                base_url,
            } => {
                assert_eq!(api_key, "sk-ant-test");
                assert_eq!(model, "claude-sonnet-4-20250514");
                assert!(base_url.is_none());
            }
            _ => panic!("Expected Anthropic variant"),
        }
    }

    #[test]
    fn test_with_model_override() {
        let config = ProviderConfig::openai("key").with_model("o4-mini");
        match config {
            ProviderConfig::OpenAi { model, .. } => assert_eq!(model, "o4-mini"),
            _ => panic!("Expected OpenAi variant"),
        }
    }

    #[test]
    fn test_with_base_url() {
        let config = ProviderConfig::openai("key").with_base_url("https://my-proxy.example.com/v1");
        match config {
            ProviderConfig::OpenAi { base_url, .. } => {
                assert_eq!(
                    base_url,
                    Some("https://my-proxy.example.com/v1".to_string())
                );
            }
            _ => panic!("Expected OpenAi variant"),
        }
    }
}
