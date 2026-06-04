import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { getTasks, getSettings } from "../lib/commands";
import { getTranslation } from "../i18n";
import type { Locale } from "../i18n";
import type { Task } from "../types/task";

export function WidgetView() {
  const [time, setTime] = useState(new Date());
  const [nextTask, setNextTask] = useState<Task | null>(null);
  const [breakCountdown, setBreakCountdown] = useState(30 * 60);
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    getSettings()
      .then((s) => setLocale((s.language === "tr" ? "tr" : "en") as Locale))
      .catch(() => {});
  }, []);

  const t = getTranslation(locale);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setBreakCountdown((prev) => (prev > 0 ? prev - 1 : 30 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchNext = async () => {
      try {
        const tasks = await getTasks();
        const now = new Date();
        const nowStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        const nowTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        const upcoming = tasks
          .filter((t) => !t.completed && (t.date > nowStr || (t.date === nowStr && t.time > nowTime)))
          .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

        setNextTask(upcoming[0] || null);
      } catch {
        // ignore
      }
    };

    fetchNext();
    const interval = setInterval(fetchNext, 30_000);
    return () => clearInterval(interval);
  }, []);

  const handleDrag = async () => {
    try {
      await getCurrentWindow().startDragging();
    } catch {
      // ignore
    }
  };

  const handleClose = async () => {
    try {
      await getCurrentWindow().hide();
    } catch {
      // ignore
    }
  };

  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const seconds = String(time.getSeconds()).padStart(2, "0");

  const breakMin = Math.floor(breakCountdown / 60);
  const breakSec = breakCountdown % 60;

  return (
    <div
      className="h-screen w-screen bg-surface/95 backdrop-blur-xl rounded-2xl overflow-hidden
                 border border-border shadow-lg select-none cursor-default"
      onMouseDown={handleDrag}
    >
      <div className="flex items-center justify-between px-3 pt-2 pb-1">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-surface-tertiary" />
          <div className="w-2 h-2 rounded-full bg-surface-tertiary" />
          <div className="w-2 h-2 rounded-full bg-surface-tertiary" />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded-full bg-surface-tertiary hover:bg-red-500 hover:text-white
                     flex items-center justify-center transition-colors cursor-pointer"
        >
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-4 pb-3">
        <div className="text-2xl font-light text-text-primary tabular-nums tracking-tight leading-none mb-2.5">
          {hours}:{minutes}
          <span className="text-sm text-text-tertiary ml-0.5">{seconds}</span>
        </div>

        <div className="mb-2">
          <div className="text-[10px] uppercase tracking-wider text-text-tertiary mb-0.5">
            {t.widget_nextTask}
          </div>
          <div className="text-xs text-text-secondary font-medium truncate">
            {nextTask ? nextTask.title : t.widget_noUpcoming}
          </div>
          {nextTask && (
            <div className="text-[10px] text-text-tertiary">{nextTask.time}</div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-text-tertiary">
            {t.widget_breakIn} {breakMin}:{String(breakSec).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
