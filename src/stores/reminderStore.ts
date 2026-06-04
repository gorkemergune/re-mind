import { create } from "zustand";
import type { Task } from "../types/task";

interface ReminderStore {
  activeReminders: Task[];
  notifiedIds: Set<string>;
  addReminder: (task: Task) => void;
  dismissReminder: (taskId: string) => void;
  clearReminder: (taskId: string) => void;
  markNotified: (taskId: string) => void;
  clearNotified: (taskId: string) => void;
  isNotified: (taskId: string) => boolean;
}

export const useReminderStore = create<ReminderStore>((set, get) => ({
  activeReminders: [],
  notifiedIds: new Set(),

  addReminder: (task) => {
    const current = get().activeReminders;
    if (current.some((r) => r.id === task.id)) return;
    set({ activeReminders: [...current, task] });
  },

  dismissReminder: (taskId) => {
    set({
      activeReminders: get().activeReminders.filter((r) => r.id !== taskId),
    });
  },

  clearReminder: (taskId) => {
    set({
      activeReminders: get().activeReminders.filter((r) => r.id !== taskId),
    });
  },

  markNotified: (taskId) => {
    const ids = new Set(get().notifiedIds);
    ids.add(taskId);
    set({ notifiedIds: ids });
  },

  clearNotified: (taskId) => {
    const ids = new Set(get().notifiedIds);
    ids.delete(taskId);
    set({ notifiedIds: ids });
  },

  isNotified: (taskId) => {
    return get().notifiedIds.has(taskId);
  },
}));
