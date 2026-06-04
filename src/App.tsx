import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "./components/Sidebar";
import { TaskList } from "./components/TaskList";
import { AddTaskModal } from "./components/AddTaskModal";
import { ReminderPopup } from "./components/ReminderPopup";
import { BreakWindow } from "./components/BreakWindow";
import { WidgetView } from "./components/WidgetView";
import { StatsView } from "./components/StatsView";
import { SettingsView } from "./components/SettingsView";
import { HelpView } from "./components/HelpView";
import { useTaskStore } from "./stores/taskStore";
import { useBreakStore } from "./stores/breakStore";
import { useSettingsStore } from "./stores/settingsStore";
import { I18nProvider } from "./i18n";
import type { Locale } from "./i18n";
import { useTaskScheduler } from "./lib/scheduler";
import { useBreakTimer } from "./lib/breakTimer";

function isWidgetMode(): boolean {
  return window.location.hash === "#widget";
}

function isBreakMode(): boolean {
  return window.location.hash === "#break";
}

export default function App() {
  if (isWidgetMode()) return <WidgetView />;
  if (isBreakMode()) return <BreakWindow />;
  return <MainApp />;
}

function MainApp() {
  const [activeView, setActiveView] = useState("upcoming");
  const { showAddForm, setShowAddForm, fetchTasks } = useTaskStore();
  const { setPaused, fetchStats } = useBreakStore();
  const { fetchSettings, settings, loaded, updateSettings } = useSettingsStore();

  // Fetch initial data
  useEffect(() => {
    fetchTasks();
    fetchStats();
    fetchSettings();
  }, [fetchTasks, fetchStats, fetchSettings]);

  // Auto-detect system language on first load
  useEffect(() => {
    if (!loaded) return;
    const autoDetected = localStorage.getItem("reminder_lang_detected");
    if (!autoDetected) {
      localStorage.setItem("reminder_lang_detected", "1");
      const sysLang = navigator.language || "";
      if (sysLang.startsWith("tr") && settings.language === "en") {
        updateSettings({ language: "tr" });
      }
    }
  }, [loaded, settings.language, updateSettings]);

  // Apply dark mode from settings
  useEffect(() => {
    if (loaded) {
      document.documentElement.classList.toggle("dark", settings.dark_mode);
    }
  }, [loaded, settings.dark_mode]);

  // Sync break interval to break store
  useEffect(() => {
    if (loaded) {
      const breakState = useBreakStore.getState();
      if (breakState.intervalMin !== settings.break_interval) {
        useBreakStore.setState({
          intervalMin: settings.break_interval,
          secondsUntilBreak: settings.break_interval * 60,
        });
      }
    }
  }, [loaded, settings.break_interval]);

  // Tray events
  useEffect(() => {
    const unlisteners = [
      listen("tray-add-task", () => setShowAddForm(true)),
      listen("tray-pause-breaks", () => setPaused(true)),
      listen("tray-resume-breaks", () => setPaused(false)),
    ];
    return () => {
      unlisteners.forEach((p) => p.then((fn) => fn()));
    };
  }, [setShowAddForm, setPaused]);

  useTaskScheduler();
  useBreakTimer();

  const locale = (settings.language === "tr" ? "tr" : "en") as Locale;

  const renderContent = () => {
    switch (activeView) {
      case "stats":
        return <StatsView />;
      case "settings":
        return <SettingsView onViewChange={setActiveView} />;
      case "help":
        return <HelpView />;
      default:
        return <TaskList view={activeView} />;
    }
  };

  return (
    <I18nProvider locale={locale}>
      <div className="flex h-screen bg-surface-secondary overflow-hidden select-none">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 flex flex-col overflow-hidden">
          {renderContent()}
        </main>
        {showAddForm && <AddTaskModal />}
        <ReminderPopup />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 2500,
            style: {
              background: "var(--color-surface)",
              color: "var(--color-text-primary)",
              fontSize: "13px",
              borderRadius: "10px",
              padding: "10px 16px",
              border: "1px solid var(--color-border)",
            },
          }}
        />
      </div>
    </I18nProvider>
  );
}
