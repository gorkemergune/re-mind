import { useEffect, useRef } from "react";
import { useTaskStore } from "../stores/taskStore";
import { useReminderStore } from "../stores/reminderStore";
import { useSettingsStore } from "../stores/settingsStore";
import { getTranslation } from "../i18n";
import type { Locale } from "../i18n";
import { sendNativeNotification } from "./notifications";
import { playNotificationSound } from "./sound";
import type { Task } from "../types/task";

const CHECK_INTERVAL_MS = 15_000;

// How many minutes before the task to show pre-reminders
const PRE_REMINDER_OFFSETS_MIN = [60, 30, 15, 5];

// Grace window (minutes) — main notification fires within ±2 minutes of task time
const MAIN_GRACE_MIN = 2;
// Pre-reminder window — fires when time-until-task crosses the offset ± 1 minute
const PRE_GRACE_MIN = 1;

export function useTaskScheduler() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tasks = useTaskStore((s) => s.tasks);
  const { addReminder, addPreReminder, markNotified, isNotified } = useReminderStore();

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const settings = useSettingsStore.getState().settings;
      const locale = settings.language as Locale;
      const t = getTranslation(locale);

      for (const task of tasks) {
        if (task.completed) continue;

        const taskMs = taskToMs(task);
        if (taskMs === null) continue;

        const diffMin = (taskMs - now.getTime()) / 60_000; // positive = future

        // --- Main notification: fires when task time is now (±MAIN_GRACE_MIN) ---
        if (Math.abs(diffMin) <= MAIN_GRACE_MIN && !isNotified(task.id, "main")) {
          markNotified(task.id, "main");
          addReminder(task);
          sendNativeNotification(
            `⏰ ${task.title}`,
            task.description ?? t.notification_scheduledNow
          );
          if (settings.sound_enabled) playNotificationSound();
        }

        // --- Pre-reminders (only for future tasks) ---
        if (diffMin > 0) {
          for (const offset of PRE_REMINDER_OFFSETS_MIN) {
            if (diffMin <= offset + PRE_GRACE_MIN && diffMin > offset - PRE_GRACE_MIN) {
              const key = `pre:${offset}`;
              if (!isNotified(task.id, key)) {
                markNotified(task.id, key);
                addPreReminder({
                  id: `${task.id}:${key}`,
                  taskId: task.id,
                  taskTitle: task.title,
                  taskDescription: task.description,
                  taskTime: task.time,
                  minutesBefore: offset,
                });
                sendNativeNotification(
                  `🔔 ${task.title}`,
                  `${t.notification_startsIn} ${offset} ${t.reminder_minutes}`
                );
              }
            }
          }
        }
      }
    };

    check();
    intervalRef.current = setInterval(check, CHECK_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tasks, addReminder, addPreReminder, markNotified, isNotified]);
}

function taskToMs(task: Task): number | null {
  try {
    const dt = new Date(`${task.date}T${task.time}:00`);
    if (isNaN(dt.getTime())) return null;
    return dt.getTime();
  } catch {
    return null;
  }
}
