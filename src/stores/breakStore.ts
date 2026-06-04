import { create } from "zustand";
import * as commands from "../lib/commands";
import type { BreakStats } from "../types/breaks";

const DEFAULT_INTERVAL_MIN = 30;

interface BreakStore {
  intervalMin: number;
  paused: boolean;
  breakActive: boolean;
  secondsUntilBreak: number;
  stats: BreakStats;
  setPaused: (paused: boolean) => void;
  setSecondsUntilBreak: (seconds: number) => void;
  triggerBreak: () => Promise<void>;
  onBreakCompleted: () => void;
  onBreakSkipped: () => void;
  onBreakSnoozed: (minutes: number) => void;
  fetchStats: () => Promise<void>;
}

export const useBreakStore = create<BreakStore>((set, get) => ({
  intervalMin: DEFAULT_INTERVAL_MIN,
  paused: false,
  breakActive: false,
  secondsUntilBreak: DEFAULT_INTERVAL_MIN * 60,
  stats: { breaks_shown: 0, breaks_taken: 0, breaks_skipped: 0 },

  setPaused: (paused) => set({ paused }),
  setSecondsUntilBreak: (seconds) => set({ secondsUntilBreak: seconds }),

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
    set({
      breakActive: false,
      secondsUntilBreak: get().intervalMin * 60,
    });
    get().fetchStats();
  },

  onBreakSkipped: () => {
    set({
      breakActive: false,
      secondsUntilBreak: get().intervalMin * 60,
    });
    get().fetchStats();
  },

  onBreakSnoozed: (minutes) => {
    set({
      breakActive: false,
      secondsUntilBreak: minutes * 60,
    });
  },
}));
