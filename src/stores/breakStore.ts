import { create } from "zustand";
import * as commands from "../lib/commands";
import type { BreakStats } from "../types/breaks";

const DEFAULT_INTERVAL_MIN = 30;
const NEXT_BREAK_KEY = "reminder_next_break_at";

function loadNextBreakAt(intervalMin: number): number {
  try {
    const stored = localStorage.getItem(NEXT_BREAK_KEY);
    if (stored) {
      const ts = parseInt(stored, 10);
      if (!isNaN(ts)) {
        const now = Date.now();
        // If the stored timestamp is still in the future, use it
        if (ts > now) return ts;
        // If the break was missed within the last 10 minutes, trigger it soon (5s from now)
        if (ts > now - 10 * 60 * 1000) return now + 5_000;
        // Missed break was a long time ago — reset the timer
      }
    }
  } catch {}
  const next = Date.now() + intervalMin * 60 * 1000;
  try { localStorage.setItem(NEXT_BREAK_KEY, String(next)); } catch {}
  return next;
}

function saveNextBreakAt(ts: number) {
  try { localStorage.setItem(NEXT_BREAK_KEY, String(ts)); } catch {}
}

interface BreakStore {
  intervalMin: number;
  paused: boolean;
  breakActive: boolean;
  nextBreakAt: number;
  stats: BreakStats;
  setPaused: (paused: boolean) => void;
  setIntervalMin: (min: number) => void;
  triggerBreak: () => Promise<void>;
  onBreakCompleted: () => void;
  onBreakSkipped: () => void;
  onBreakSnoozed: (minutes: number) => void;
  fetchStats: () => Promise<void>;
  /** Computed helper — seconds remaining until next break */
  secondsUntilBreak: () => number;
}

export const useBreakStore = create<BreakStore>((set, get) => ({
  intervalMin: DEFAULT_INTERVAL_MIN,
  paused: false,
  breakActive: false,
  nextBreakAt: loadNextBreakAt(DEFAULT_INTERVAL_MIN),
  stats: { breaks_shown: 0, breaks_taken: 0, breaks_skipped: 0 },

  secondsUntilBreak: () => {
    const { nextBreakAt, breakActive } = get();
    if (breakActive) return 0;
    return Math.max(0, Math.round((nextBreakAt - Date.now()) / 1000));
  },

  setPaused: (paused) => set({ paused }),

  setIntervalMin: (min) => {
    const next = Date.now() + min * 60 * 1000;
    saveNextBreakAt(next);
    set({ intervalMin: min, nextBreakAt: next });
  },

  fetchStats: async () => {
    try {
      const stats = await commands.getBreakStats();
      set({ stats });
    } catch (err) {
      console.error("Failed to fetch break stats:", err);
    }
  },

  triggerBreak: async () => {
    if (get().breakActive) return;
    set({ breakActive: true });
    try {
      await commands.recordBreakShown();
      await commands.showBreakOverlay();
    } catch (err) {
      console.error("Failed to show break overlay:", err);
      set({ breakActive: false });
    }
    await get().fetchStats();
  },

  onBreakCompleted: () => {
    const next = Date.now() + get().intervalMin * 60 * 1000;
    saveNextBreakAt(next);
    set({ breakActive: false, nextBreakAt: next });
    get().fetchStats();
  },

  onBreakSkipped: () => {
    const next = Date.now() + get().intervalMin * 60 * 1000;
    saveNextBreakAt(next);
    set({ breakActive: false, nextBreakAt: next });
    get().fetchStats();
  },

  onBreakSnoozed: (minutes) => {
    const next = Date.now() + minutes * 60 * 1000;
    saveNextBreakAt(next);
    set({ breakActive: false, nextBreakAt: next });
  },
}));
