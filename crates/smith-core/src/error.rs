use thiserror::Error;

#[derive(Error, Debug)]
pub enum SmithError {
    #[error("Invalid parameters: {0}")]
    InvalidParams(String),

    #[error("UI element not found or selector invalid")]
    ElementNotFound,

    #[error("Operation cancelled by user")]
    Cancelled,

    #[error("Context error: {0}")]
    ContextError(String),

    #[error("Platform error: {0}")]
    PlatformError(String),

    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

pub type SmithResult<T> = Result<T, SmithError>;
