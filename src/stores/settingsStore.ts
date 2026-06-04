import { create } from "zustand";
import type { AppSettings } from "../types/settings";
import * as commands from "../lib/commands";

interface SettingsStore {
  settings: AppSettings;
  loaded: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (partial: Partial<AppSettings>) => Promise<void>;
}

const defaults: AppSettings = {
  break_interval: 30,
  break_duration: 5,
  dark_mode: false,
  sound_enabled: true,
  widget_visible: false,
  language: "en",
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: defaults,
  loaded: false,

  fetchSettings: async () => {
    try {
      const settings = await commands.getSettings();
      set({ settings, loaded: true });
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      set({ loaded: true });
    }
  },

  updateSettings: async (partial) => {
    const merged = { ...get().settings, ...partial };
    set({ settings: merged });
    try {
      await commands.saveSettings(merged);
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  },
}));
