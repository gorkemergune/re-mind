import { create } from "zustand";
import type { Task } from "../types/task";

export interface PreReminderEntry {
  id: string;           // unique: `${taskId}:pre:${minutesBefore}`
  taskId: string;
  taskTitle: string;
  taskDescription: string | null;
  taskTime: string;
  minutesBefore: number;
}

// Persist notified keys to localStorage so they survive app restarts
const NOTIFIED_KEY = "reminder_notified_v2";

function loadNotified(): Map<string, Set<string>> {
  try {
    const raw = localStorage.getItem(NOTIFIED_KEY);
    if (!raw) return new Map();
    const obj = JSON.parse(raw) as Record<string, string[]>;
    const map = new Map<string, Set<string>>();
    for (const [k, v] of Object.entries(obj)) {
      map.set(k, new Set(v));
    }
    return map;
  } catch {
    return new Map();
  }
}

function saveNotified(map: Map<string, Set<string>>) {
  try {
    const obj: Record<string, string[]> = {};
    for (const [k, v] of map.entries()) {
      obj[k] = Array.from(v);
    }
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify(obj));
  } catch {}
}

interface ReminderStore {
  activeReminders: Task[];
  preReminders: PreReminderEntry[];
  notifiedMap: Map<string, Set<string>>;

  addReminder: (task: Task) => void;
  dismissReminder: (taskId: string) => void;

  addPreReminder: (entry: PreReminderEntry) => void;
  dismissPreReminder: (id: string) => void;

  markNotified: (taskId: string, key: string) => void;
  clearNotified: (taskId: string) => void;
  isNotified: (taskId: string, key: string) => boolean;
}

export const useReminderStore = create<ReminderStore>((set, get) => ({
  activeReminders: [],
  preReminders: [],
  notifiedMap: loadNotified(),

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

  addPreReminder: (entry) => {
    const current = get().preReminders;
    if (current.some((r) => r.id === entry.id)) return;
    set({ preReminders: [...current, entry] });
    // Auto-dismiss after 12 seconds
    setTimeout(() => {
      get().dismissPreReminder(entry.id);
    }, 12_000);
  },

  dismissPreReminder: (id) => {
    set({
      preReminders: get().preReminders.filter((r) => r.id !== id),
    });
  },

  markNotified: (taskId, key) => {
    const map = new Map(get().notifiedMap);
    if (!map.has(taskId)) map.set(taskId, new Set());
    map.get(taskId)!.add(key);
    saveNotified(map);
    set({ notifiedMap: map });
  },

  clearNotified: (taskId) => {
    const map = new Map(get().notifiedMap);
    map.delete(taskId);
    saveNotified(map);
    set({ notifiedMap: map });
  },

  isNotified: (taskId, key) => {
    return get().notifiedMap.get(taskId)?.has(key) ?? false;
  },
}));
