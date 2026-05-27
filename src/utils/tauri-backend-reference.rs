// ============================================================
// TAURI RUST BACKEND — src-tauri/src/lib.rs
// This file is a REFERENCE ONLY. It does not run in the browser.
// Copy this into your Tauri project's src-tauri/src/lib.rs
// ============================================================

use tauri::command;
use std::fs;
use std::process::Command;

// Command 1: Read a local file and return its contents as a string
#[tauri::command]
async fn read_local_file(path: String) -> Result<String, String> {
    match fs::read_to_string(&path) {
        Ok(content) => Ok(content),
        Err(e) => Err(format!("Failed to read file: {}", e)),
    }
}

// Command 2: Execute a local Python or Shell script by name
// Scripts should live in a known safe directory (e.g. ~/.controlroom/scripts/)
#[tauri::command]
async fn run_local_script(script_name: String) -> Result<String, String> {
    // Security: only allow alphanumeric names + underscores, no path traversal
    if !script_name.chars().all(|c| c.is_alphanumeric() || c == '_' || c == '-') {
        return Err("Invalid script name: only alphanumeric, dashes and underscores allowed".into());
    }

    let output = Command::new("python3")
        .arg(format!("scripts/{}", script_name))
        .output()
        .map_err(|e| format!("Failed to execute script: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

// Register all commands in the Tauri builder
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            read_local_file,
            run_local_script
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}