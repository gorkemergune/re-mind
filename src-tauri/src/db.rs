use rusqlite::{Connection, params};
use std::sync::Mutex;
use crate::models::{Task, BreakStats, AppSettings, TaskStats};

pub struct Database {
    conn: Mutex<Connection>,
}

impl Database {
    pub fn new(app_dir: &std::path::Path) -> Result<Self, String> {
        std::fs::create_dir_all(app_dir).map_err(|e| e.to_string())?;
        let db_path = app_dir.join("reminder.db");
        let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                date TEXT NOT NULL,
                time TEXT NOT NULL,
                repeat_mode TEXT NOT NULL DEFAULT 'once',
                completed INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS break_stats (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                breaks_shown INTEGER NOT NULL DEFAULT 0,
                breaks_taken INTEGER NOT NULL DEFAULT 0,
                breaks_skipped INTEGER NOT NULL DEFAULT 0
            );

            INSERT OR IGNORE INTO break_stats (id, breaks_shown, breaks_taken, breaks_skipped)
            VALUES (1, 0, 0, 0);

            CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                break_interval INTEGER NOT NULL DEFAULT 30,
                break_duration INTEGER NOT NULL DEFAULT 5,
                dark_mode INTEGER NOT NULL DEFAULT 0,
                sound_enabled INTEGER NOT NULL DEFAULT 1,
                widget_visible INTEGER NOT NULL DEFAULT 0
            );

            INSERT OR IGNORE INTO settings (id) VALUES (1);"
        ).map_err(|e| e.to_string())?;

        // Migration: add language column if missing
        conn.execute(
            "ALTER TABLE settings ADD COLUMN language TEXT NOT NULL DEFAULT 'en'",
            [],
        ).ok();

        Ok(Self { conn: Mutex::new(conn) })
    }

    pub fn create_task(&self, task: &Task) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.execute(
            "INSERT INTO tasks (id, title, description, date, time, repeat_mode, completed, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            params![
                task.id,
                task.title,
                task.description,
                task.date,
                task.time,
                task.repeat_mode,
                task.completed as i32,
                task.created_at,
            ],
        ).map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn get_tasks(&self) -> Result<Vec<Task>, String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        let mut stmt = conn.prepare(
            "SELECT id, title, description, date, time, repeat_mode, completed, created_at
             FROM tasks ORDER BY date ASC, time ASC"
        ).map_err(|e| e.to_string())?;

        let tasks = stmt.query_map([], |row| {
            Ok(Task {
                id: row.get(0)?,
                title: row.get(1)?,
                description: row.get(2)?,
                date: row.get(3)?,
                time: row.get(4)?,
                repeat_mode: row.get(5)?,
                completed: row.get::<_, i32>(6)? != 0,
                created_at: row.get(7)?,
            })
        }).map_err(|e| e.to_string())?;

        let mut result = Vec::new();
        for task in tasks {
            result.push(task.map_err(|e| e.to_string())?);
        }
        Ok(result)
    }

    pub fn update_task(&self, task: &Task) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.execute(
            "UPDATE tasks SET title = ?1, description = ?2, date = ?3, time = ?4,
             repeat_mode = ?5, completed = ?6 WHERE id = ?7",
            params![
                task.title,
                task.description,
                task.date,
                task.time,
                task.repeat_mode,
                task.completed as i32,
                task.id,
            ],
        ).map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn delete_task(&self, id: &str) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.execute("DELETE FROM tasks WHERE id = ?1", params![id])
            .map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn toggle_task(&self, id: &str) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.execute(
            "UPDATE tasks SET completed = CASE WHEN completed = 0 THEN 1 ELSE 0 END WHERE id = ?1",
            params![id],
        ).map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn snooze_task(&self, id: &str, minutes: i64) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;

        let (date_str, time_str): (String, String) = conn.query_row(
            "SELECT date, time FROM tasks WHERE id = ?1",
            params![id],
            |row| Ok((row.get(0)?, row.get(1)?)),
        ).map_err(|e| e.to_string())?;

        let datetime_str = format!("{}T{}:00", date_str, time_str);
        let naive = chrono::NaiveDateTime::parse_from_str(&datetime_str, "%Y-%m-%dT%H:%M:%S")
            .map_err(|e| e.to_string())?;
        let new_dt = naive + chrono::Duration::minutes(minutes);

        let new_date = new_dt.format("%Y-%m-%d").to_string();
        let new_time = new_dt.format("%H:%M").to_string();

        conn.execute(
            "UPDATE tasks SET date = ?1, time = ?2 WHERE id = ?3",
            params![new_date, new_time, id],
        ).map_err(|e| e.to_string())?;

        Ok(())
    }

    pub fn get_break_stats(&self) -> Result<BreakStats, String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.query_row(
            "SELECT breaks_shown, breaks_taken, breaks_skipped FROM break_stats WHERE id = 1",
            [],
            |row| {
                Ok(BreakStats {
                    breaks_shown: row.get(0)?,
                    breaks_taken: row.get(1)?,
                    breaks_skipped: row.get(2)?,
                })
            },
        ).map_err(|e| e.to_string())
    }

    pub fn record_break_shown(&self) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.execute(
            "UPDATE break_stats SET breaks_shown = breaks_shown + 1 WHERE id = 1",
            [],
        ).map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn record_break_taken(&self) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.execute(
            "UPDATE break_stats SET breaks_taken = breaks_taken + 1 WHERE id = 1",
            [],
        ).map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn record_break_skipped(&self) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.execute(
            "UPDATE break_stats SET breaks_skipped = breaks_skipped + 1 WHERE id = 1",
            [],
        ).map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn get_settings(&self) -> Result<AppSettings, String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.query_row(
            "SELECT break_interval, break_duration, dark_mode, sound_enabled, widget_visible, language
             FROM settings WHERE id = 1",
            [],
            |row| {
                Ok(AppSettings {
                    break_interval: row.get(0)?,
                    break_duration: row.get(1)?,
                    dark_mode: row.get::<_, i32>(2)? != 0,
                    sound_enabled: row.get::<_, i32>(3)? != 0,
                    widget_visible: row.get::<_, i32>(4)? != 0,
                    language: row.get(5)?,
                })
            },
        ).map_err(|e| e.to_string())
    }

    pub fn save_settings(&self, settings: &AppSettings) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.execute(
            "UPDATE settings SET break_interval = ?1, break_duration = ?2,
             dark_mode = ?3, sound_enabled = ?4, widget_visible = ?5, language = ?6 WHERE id = 1",
            params![
                settings.break_interval,
                settings.break_duration,
                settings.dark_mode as i32,
                settings.sound_enabled as i32,
                settings.widget_visible as i32,
                settings.language,
            ],
        ).map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn get_task_stats(&self) -> Result<TaskStats, String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        let total: i64 = conn.query_row("SELECT COUNT(*) FROM tasks", [], |row| row.get(0))
            .map_err(|e| e.to_string())?;
        let completed: i64 = conn.query_row(
            "SELECT COUNT(*) FROM tasks WHERE completed = 1", [], |row| row.get(0)
        ).map_err(|e| e.to_string())?;
        Ok(TaskStats {
            total_tasks: total,
            completed_tasks: completed,
            pending_tasks: total - completed,
        })
    }
}
