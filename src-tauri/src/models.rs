use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Task {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub date: String,
    pub time: String,
    pub repeat_mode: String,
    pub completed: bool,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BreakStats {
    pub breaks_shown: i64,
    pub breaks_taken: i64,
    pub breaks_skipped: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    pub break_interval: i64,
    pub break_duration: i64,
    pub dark_mode: bool,
    pub sound_enabled: bool,
    pub widget_visible: bool,
    pub language: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskStats {
    pub total_tasks: i64,
    pub completed_tasks: i64,
    pub pending_tasks: i64,
}
