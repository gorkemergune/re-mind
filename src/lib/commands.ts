import { invoke } from "@tauri-apps/api/core";
import type { Task } from "../types/task";
import type { BreakStats } from "../types/breaks";
import type { AppSettings, TaskStats } from "../types/settings";

export async function createTask(task: Task): Promise<void> {
  return invoke("create_task", { task });
}

export async function getTasks(): Promise<Task[]> {
  return invoke("get_tasks");
}

export async function updateTask(task: Task): Promise<void> {
  return invoke("update_task", { task });
}

export async function deleteTask(id: string): Promise<void> {
  return invoke("delete_task", { id });
}

export async function toggleTask(id: string): Promise<void> {
  return invoke("toggle_task", { id });
}

export async function snoozeTask(id: string, minutes: number): Promise<void> {
  return invoke("snooze_task", { id, minutes });
}

export async function getBreakStats(): Promise<BreakStats> {
  return invoke("get_break_stats");
}

export async function recordBreakShown(): Promise<void> {
  return invoke("record_break_shown");
}

export async function recordBreakTaken(): Promise<void> {
  return invoke("record_break_taken");
}

export async function recordBreakSkipped(): Promise<void> {
  return invoke("record_break_skipped");
}

export async function getSettings(): Promise<AppSettings> {
  return invoke("get_settings");
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  return invoke("save_settings", { settings });
}

export async function getTaskStats(): Promise<TaskStats> {
  return invoke("get_task_stats");
}

export async function toggleWidget(): Promise<void> {
  return invoke("toggle_widget");
}

export async function showBreakOverlay(): Promise<void> {
  return invoke("show_break_overlay");
}

export async function closeBreakOverlay(): Promise<void> {
  return invoke("close_break_overlay");
}
