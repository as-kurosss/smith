// crates/smith-windows/src/tools/process.rs
use async_trait::async_trait;
use serde_json::{Value, json};
use smith_core::{ExecutionContext, SmithError, SmithResult, Tool, ToolConfig, ToolResult};
use tokio_util::sync::CancellationToken;

/// Инструмент для управления процессами Windows.
///
/// Поддерживает действия:
/// - `start` — запуск нового процесса
/// - `stop` — остановка процесса по PID или имени
/// - `list` — получение списка запущенных процессов
pub struct ProcessTool;

impl ProcessTool {
    /// Создаёт новый экземпляр `ProcessTool`.
    #[must_use]
    pub fn new() -> Self {
        Self
    }
}

impl Default for ProcessTool {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Tool for ProcessTool {
    fn name(&self) -> &'static str {
        "windows.process"
    }

    fn description(&self) -> &'static str {
        "Manages Windows processes: start, stop, or list"
    }

    fn schema(&self) -> Value {
        json!({
            "type": "object",
            "properties": {
                "action": {
                    "type": "string",
                    "enum": ["start", "stop", "list"],
                    "description": "Action to perform"
                },
                "command": {
                    "type": "string",
                    "description": "Executable path (required for start)"
                },
                "args": {
                    "type": "array",
                    "items": { "type": "string" },
                    "description": "Command-line arguments (for start)"
                },
                "working_dir": {
                    "type": "string",
                    "description": "Working directory (for start)"
                },
                "pid": {
                    "type": "integer",
                    "description": "Process ID to stop"
                },
                "name": {
                    "type": "string",
                    "description": "Process image name to stop (e.g. notepad.exe)"
                }
            },
            "required": ["action"]
        })
    }

    async fn execute(
        &self,
        config: ToolConfig,
        _ctx: &mut ExecutionContext,
        token: CancellationToken,
    ) -> SmithResult<ToolResult> {
        let action = config
            .get("action")
            .and_then(|v| v.as_str())
            .ok_or_else(|| SmithError::InvalidParams("Missing 'action'".into()))?;

        if token.is_cancelled() {
            return Err(SmithError::Cancelled);
        }

        match action {
            "start" => self::action_start(&config),
            "stop" => self::action_stop(&config),
            "list" => self::action_list(),
            other => Err(SmithError::InvalidParams(format!(
                "Unknown action: {other}"
            ))),
        }
    }
}

fn action_start(config: &Value) -> SmithResult<ToolResult> {
    // Валидация: command обязателен
    let cmd_str = config
        .get("command")
        .and_then(|v| v.as_str())
        .ok_or_else(|| SmithError::InvalidParams("Missing 'command' for start action".into()))?;

    let mut cmd = std::process::Command::new(cmd_str);

    if let Some(args) = config.get("args").and_then(|v| v.as_array()) {
        for arg in args {
            if let Some(s) = arg.as_str() {
                cmd.arg(s);
            }
        }
    }

    if let Some(dir) = config.get("working_dir").and_then(|v| v.as_str()) {
        cmd.current_dir(dir);
    }

    let child = cmd
        .spawn()
        .map_err(|e| SmithError::PlatformError(format!("Failed to start process: {e}")))?;

    let pid = child.id();

    Ok(json!({
        "status": "started",
        "pid": pid
    }))
}

fn action_stop(config: &Value) -> SmithResult<ToolResult> {
    if let Some(pid) = config.get("pid").and_then(|v| v.as_u64()) {
        // Остановка по PID через taskkill
        let output = std::process::Command::new("taskkill")
            .args(["/F", "/PID", &pid.to_string()])
            .output()
            .map_err(|e| SmithError::PlatformError(format!("taskkill failed: {e}")))?;

        if output.status.success() {
            Ok(json!({ "status": "stopped", "method": "pid", "pid": pid }))
        } else {
            let stderr = String::from_utf8_lossy(&output.stderr);
            Err(SmithError::PlatformError(format!(
                "Failed to stop process {pid}: {stderr}"
            )))
        }
    } else if let Some(name) = config.get("name").and_then(|v| v.as_str()) {
        // Остановка по имени через taskkill
        let output = std::process::Command::new("taskkill")
            .args(["/F", "/IM", name])
            .output()
            .map_err(|e| SmithError::PlatformError(format!("taskkill failed: {e}")))?;

        if output.status.success() {
            Ok(json!({ "status": "stopped", "method": "name", "name": name }))
        } else {
            let stderr = String::from_utf8_lossy(&output.stderr);
            Err(SmithError::PlatformError(format!(
                "Failed to stop process '{name}': {stderr}"
            )))
        }
    } else {
        Err(SmithError::InvalidParams(
            "Must provide 'pid' or 'name' for stop action".into(),
        ))
    }
}

fn action_list() -> SmithResult<ToolResult> {
    let output = std::process::Command::new("tasklist")
        .args(["/FO", "CSV", "/NH"])
        .output()
        .map_err(|e| SmithError::PlatformError(format!("tasklist failed: {e}")))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(SmithError::PlatformError(format!(
            "tasklist error: {stderr}"
        )));
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut processes: Vec<Value> = Vec::new();

    // CSV format: "Image Name","PID","Session Name","Session#","Mem Usage"
    for line in stdout.lines() {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }
        // Remove outer quotes and split by "," (keeping quoted values together)
        let parts: Vec<&str> = line.split(',').map(|s| s.trim_matches('"')).collect();

        if parts.len() >= 2 {
            let name = parts[0].to_string();
            let pid: u64 = parts[1].parse().unwrap_or(0);

            processes.push(json!({
                "name": name,
                "pid": pid
            }));
        }
    }

    Ok(json!({
        "status": "ok",
        "processes": processes,
        "count": processes.len()
    }))
}
