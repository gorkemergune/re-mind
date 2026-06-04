import { useEffect, useRef } from "react";
import { useTaskStore } from "../stores/taskStore";
import { useReminderStore } from "../stores/reminderStore";
import { useSettingsStore } from "../stores/settingsStore";
import { getTranslation } from "../i18n";
import type { Locale } from "../i18n";
import { sendNativeNotification } from "./notifications";
import { playNotificationSound } from "./sound";

const CHECK_INTERVAL = 15_000; // 15 seconds

export function useTaskScheduler() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tasks = useTaskStore((s) => s.tasks);
  const { addReminder, isNotified, markNotified } = useReminderStore();
  const soundEnabled = useSettingsStore((s) => s.settings.sound_enabled);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const nowDate = formatDate(now);
      const nowTime = formatTime(now);

      for (const task of tasks) {
        if (task.completed) continue;
        if (isNotified(task.id)) continue;

        if (isTaskDue(task.date, task.time, nowDate, nowTime)) {
          markNotified(task.id);
          addReminder(task);
          const locale = useSettingsStore.getState().settings.language as Locale;
          const t = getTranslation(locale);
          sendNativeNotification(task.title, task.description || t.notification_scheduledNow);
          if (useSettingsStore.getState().settings.sound_enabled) {
            playNotificationSound();
          }
        }
      }
    };

    check();
    intervalRef.current = setInterval(check, CHECK_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tasks, addReminder, isNotified, markNotified, soundEnabled]);
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatTime(d: Date): string {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function isTaskDue(taskDate: string, taskTime: string, nowDate: string, nowTime: string): boolean {
  if (taskDate < nowDate) return true;
  if (taskDate === nowDate && taskTime <= nowTime) return true;
  return false;
}
