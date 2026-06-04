mod db;
mod models;

use db::Database;
use models::{AppSettings, BreakStats, FocusHeatmapEntry, Task, TaskStats, WeeklyFocusEntry};
use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::TrayIconBuilder,
    webview::WebviewWindowBuilder,
    Emitter, Manager,
};

#[tauri::command]
fn create_task(state: tauri::State<'_, Database>, task: Task) -> Result<(), String> {
    state.create_task(&task)
}

#[tauri::command]
fn get_tasks(state: tauri::State<'_, Database>) -> Result<Vec<Task>, String> {
    state.get_tasks()
}

#[tauri::command]
fn update_task(state: tauri::State<'_, Database>, task: Task) -> Result<(), String> {
    state.update_task(&task)
}

#[tauri::command]
fn delete_task(state: tauri::State<'_, Database>, id: String) -> Result<(), String> {
    state.delete_task(&id)
}

#[tauri::command]
fn toggle_task(state: tauri::State<'_, Database>, id: String) -> Result<(), String> {
    state.toggle_task(&id)
}

#[tauri::command]
fn snooze_task(
    state: tauri::State<'_, Database>,
    id: String,
    minutes: i64,
) -> Result<(), String> {
    state.snooze_task(&id, minutes)
}

#[tauri::command]
fn get_break_stats(state: tauri::State<'_, Database>) -> Result<BreakStats, String> {
    state.get_break_stats()
}

#[tauri::command]
fn record_break_shown(state: tauri::State<'_, Database>) -> Result<(), String> {
    state.record_break_shown()
}

#[tauri::command]
fn record_break_taken(state: tauri::State<'_, Database>) -> Result<(), String> {
    state.record_break_taken()
}

#[tauri::command]
fn record_break_skipped(state: tauri::State<'_, Database>) -> Result<(), String> {
    state.record_break_skipped()
}

#[tauri::command]
fn get_settings(state: tauri::State<'_, Database>) -> Result<AppSettings, String> {
    state.get_settings()
}

#[tauri::command]
fn save_settings(state: tauri::State<'_, Database>, settings: AppSettings) -> Result<(), String> {
    state.save_settings(&settings)
}

#[tauri::command]
fn get_task_stats(state: tauri::State<'_, Database>) -> Result<TaskStats, String> {
    state.get_task_stats()
}

#[tauri::command]
fn toggle_widget(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(widget) = app.get_webview_window("widget") {
        if widget.is_visible().unwrap_or(false) {
            widget.hide().map_err(|e| e.to_string())?;
        } else {
            widget.show().map_err(|e| e.to_string())?;
            widget.set_focus().map_err(|e| e.to_string())?;
        }
    } else {
        let url = if cfg!(debug_assertions) {
            "http://localhost:1420/#widget"
        } else {
            "tauri://localhost/#widget"
        };

        let builder = WebviewWindowBuilder::new(&app, "widget", tauri::WebviewUrl::External(url.parse().unwrap()))
            .title("Reminder Widget")
            .inner_size(280.0, 180.0)
            .min_inner_size(240.0, 160.0)
            .max_inner_size(400.0, 250.0)
            .resizable(true)
            .decorations(false)
            .always_on_top(true)
            .skip_taskbar(true);

        builder.build().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn show_break_overlay(app: tauri::AppHandle) -> Result<(), String> {
    // If break overlay already exists, just show and focus it
    if let Some(win) = app.get_webview_window("break-overlay") {
        win.show().map_err(|e| e.to_string())?;
        win.set_focus().map_err(|e| e.to_string())?;
        return Ok(());
    }

    let url = if cfg!(debug_assertions) {
        "http://localhost:1420/#break"
    } else {
        "tauri://localhost/#break"
    };

    let builder = WebviewWindowBuilder::new(
        &app,
        "break-overlay",
        tauri::WebviewUrl::External(url.parse().unwrap()),
    )
    .title("Break Reminder")
    .fullscreen(true)
    .always_on_top(true)
    .decorations(false)
    .skip_taskbar(true)
    .resizable(false);

    builder.build().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn close_break_overlay(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(win) = app.get_webview_window("break-overlay") {
        win.destroy().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn record_focus_time(
    state: tauri::State<'_, Database>,
    date: String,
    hour: i64,
    minutes: f64,
) -> Result<(), String> {
    state.record_focus_time(&date, hour, minutes)
}

#[tauri::command]
fn get_focus_heatmap(
    state: tauri::State<'_, Database>,
    days: i64,
) -> Result<Vec<FocusHeatmapEntry>, String> {
    state.get_focus_heatmap(days)
}

#[tauri::command]
fn get_weekly_focus(
    state: tauri::State<'_, Database>,
) -> Result<Vec<WeeklyFocusEntry>, String> {
    state.get_weekly_focus()
}

fn show_main_window(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            let app_dir = app.path().app_data_dir().expect("failed to get app data dir");
            let database = Database::new(&app_dir).expect("failed to initialize database");
            app.manage(database);

            // Build tray menu
            let open_item = MenuItemBuilder::with_id("open", "Open Reminder").build(app)?;
            let add_task_item = MenuItemBuilder::with_id("add_task", "Add Task").build(app)?;
            let separator1 = tauri::menu::PredefinedMenuItem::separator(app)?;
            let pause_breaks_item =
                MenuItemBuilder::with_id("pause_breaks", "Pause Break Reminders").build(app)?;
            let resume_breaks_item =
                MenuItemBuilder::with_id("resume_breaks", "Resume Break Reminders")
                    .enabled(false)
                    .build(app)?;
            let separator2 = tauri::menu::PredefinedMenuItem::separator(app)?;
            let widget_item =
                MenuItemBuilder::with_id("toggle_widget", "Toggle Widget").build(app)?;
            let separator3 = tauri::menu::PredefinedMenuItem::separator(app)?;
            let quit_item = MenuItemBuilder::with_id("quit", "Quit Reminder").build(app)?;

            let menu = MenuBuilder::new(app)
                .item(&open_item)
                .item(&add_task_item)
                .item(&separator1)
                .item(&pause_breaks_item)
                .item(&resume_breaks_item)
                .item(&separator2)
                .item(&widget_item)
                .item(&separator3)
                .item(&quit_item)
                .build()?;

            let icon = app
                .default_window_icon()
                .cloned()
                .expect("failed to get default window icon");

            // Background heartbeat — fires every 30 seconds regardless of WebKit throttling.
            // The frontend listens to "backend-tick" to check if a break is due.
            let tick_handle = app.handle().clone();
            std::thread::spawn(move || {
                loop {
                    std::thread::sleep(std::time::Duration::from_secs(30));
                    let _ = tick_handle.emit("backend-tick", ());
                }
            });

            let _tray = TrayIconBuilder::new()
                .icon(icon)
                .menu(&menu)
                .tooltip("Reminder")
                .on_menu_event(move |app, event| match event.id().as_ref() {
                    "open" => {
                        show_main_window(app);
                    }
                    "add_task" => {
                        show_main_window(app);
                        let _ = app.emit("tray-add-task", ());
                    }
                    "pause_breaks" => {
                        let _ = app.emit("tray-pause-breaks", ());
                        let _ = pause_breaks_item.set_enabled(false);
                        let _ = resume_breaks_item.set_enabled(true);
                    }
                    "resume_breaks" => {
                        let _ = app.emit("tray-resume-breaks", ());
                        let _ = pause_breaks_item.set_enabled(true);
                        let _ = resume_breaks_item.set_enabled(false);
                    }
                    "toggle_widget" => {
                        let _ = toggle_widget(app.clone());
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let tauri::tray::TrayIconEvent::DoubleClick { .. } = event {
                        show_main_window(tray.app_handle());
                    }
                })
                .build(app)?;

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                // Widget window can be destroyed; main window hides to tray
                if window.label() == "main" {
                    let _ = window.hide();
                    api.prevent_close();
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            create_task,
            get_tasks,
            update_task,
            delete_task,
            toggle_task,
            snooze_task,
            get_break_stats,
            record_break_shown,
            record_break_taken,
            record_break_skipped,
            get_settings,
            save_settings,
            get_task_stats,
            toggle_widget,
            show_break_overlay,
            close_break_overlay,
            record_focus_time,
            get_focus_heatmap,
            get_weekly_focus,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
