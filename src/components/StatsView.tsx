import { useEffect, useState, useMemo } from "react";
import { useBreakStore } from "../stores/breakStore";
import { useTranslation } from "../i18n";
import { getTaskStats, getFocusHeatmap, getWeeklyFocus } from "../lib/commands";
import type { TaskStats, FocusHeatmapEntry, WeeklyFocusEntry } from "../types/settings";

const DAYS_HEATMAP = 28;
const WORK_HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 06:00–23:00

function fmtDuration(minutes: number, hoursLabel: string, minsLabel: string): string {
  if (minutes < 1) return `<1${minsLabel}`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}${minsLabel}`;
  if (m === 0) return `${h}${hoursLabel}`;
  return `${h}${hoursLabel} ${m}${minsLabel}`;
}

function dayLabel(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export function StatsView() {
  const { stats: breakStats, fetchStats } = useBreakStore();
  const { t } = useTranslation();
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [heatmap, setHeatmap] = useState<FocusHeatmapEntry[]>([]);
  const [weekly, setWeekly] = useState<WeeklyFocusEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"daily" | "weekly">("weekly");

  useEffect(() => {
    fetchStats();
    getTaskStats().then(setTaskStats).catch(console.error);
    getFocusHeatmap(DAYS_HEATMAP).then(setHeatmap).catch(console.error);
    getWeeklyFocus().then(setWeekly).catch(console.error);
  }, [fetchStats]);

  // Build a lookup: date+hour → minutes
  const heatmapLookup = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of heatmap) {
      map.set(`${e.date}:${e.hour}`, e.focus_minutes);
    }
    return map;
  }, [heatmap]);

  // Max minutes in a single cell (for colour scaling)
  const maxCellMinutes = useMemo(
    () => Math.max(1, ...heatmap.map((e) => e.focus_minutes)),
    [heatmap]
  );

  const totalFocusMin = useMemo(
    () => heatmap.reduce((s, e) => s + e.focus_minutes, 0),
    [heatmap]
  );

  const weeklyMaxMin = useMemo(
    () => Math.max(1, ...weekly.map((e) => e.total_focus_minutes)),
    [weekly]
  );

  const insights = useMemo(() => generateInsights(heatmap, breakStats, weekly), [heatmap, breakStats, weekly]);

  // Build last 28-day date list
  const dateList = useMemo(() => {
    const list: string[] = [];
    for (let i = DAYS_HEATMAP - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      list.push(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
      );
    }
    return list;
  }, []);

  const last7 = useMemo(() => dateList.slice(-7), [dateList]);

  if (!taskStats) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-8">
          <div className="h-6 w-32 bg-surface-tertiary rounded-lg animate-shimmer mb-2" />
          <div className="h-4 w-48 bg-surface-tertiary rounded-lg animate-shimmer mb-8" />
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-surface rounded-xl border border-border p-4">
                <div className="h-8 w-12 bg-surface-tertiary rounded animate-shimmer mx-auto mb-2" />
                <div className="h-3 w-16 bg-surface-tertiary rounded animate-shimmer mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: t.stats_totalTasks, value: taskStats.total_tasks, color: "text-primary-400" },
    { label: t.stats_completed, value: taskStats.completed_tasks, color: "text-emerald-400" },
    { label: t.stats_pending, value: taskStats.pending_tasks, color: "text-amber-400" },
  ];

  const breakCards = [
    { label: t.stats_breaksShown, value: breakStats.breaks_shown, color: "text-blue-400" },
    { label: t.stats_breaksTaken, value: breakStats.breaks_taken, color: "text-emerald-400" },
    { label: t.stats_breaksSkipped, value: breakStats.breaks_skipped, color: "text-red-400" },
  ];

  const breakTotal = breakStats.breaks_taken + breakStats.breaks_skipped;
  const takenPct = breakTotal > 0 ? (breakStats.breaks_taken / breakTotal) * 100 : 0;
  const skippedPct = breakTotal > 0 ? (breakStats.breaks_skipped / breakTotal) * 100 : 0;

  const taskTotal = taskStats.total_tasks;
  const completedPct = taskTotal > 0 ? (taskStats.completed_tasks / taskTotal) * 100 : 0;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-8 py-8">
        <h2 className="text-xl font-semibold text-text-primary mb-1">{t.stats_title}</h2>
        <p className="text-xs text-text-tertiary mb-8">{t.stats_subtitle}</p>

        {/* ─── Focus Summary ─── */}
        <h3 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-3">
          {t.stats_focus}
        </h3>
        <div className="bg-surface rounded-xl border border-border p-4 mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-text-primary">{t.stats_totalFocusTime}</span>
            <span className="text-sm font-semibold text-primary-400 tabular-nums">
              {fmtDuration(totalFocusMin, t.stats_hours, t.stats_mins)}
            </span>
          </div>
          <p className="text-[11px] text-text-tertiary">{t.stats_heatmapHint}</p>
        </div>

        {/* ─── Tab selector ─── */}
        <div className="flex gap-1 mb-3">
          {(["weekly", "daily"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer
                         ${activeTab === tab
                           ? "bg-primary-500 text-white"
                           : "bg-surface-tertiary text-text-secondary hover:bg-border"
                         }`}
            >
              {tab === "weekly" ? t.stats_weeklyFocus : t.stats_focusHeatmap}
            </button>
          ))}
        </div>

        {activeTab === "weekly" ? (
          <div className="bg-surface rounded-xl border border-border p-4 mb-8">
            {weekly.length === 0 ? (
              <p className="text-xs text-text-tertiary text-center py-4">{t.stats_noFocusData}</p>
            ) : (
              <div className="flex items-end gap-1.5 h-24">
                {last7.map((date) => {
                  const entry = weekly.find((w) => w.date === date);
                  const mins = entry?.total_focus_minutes ?? 0;
                  const pct = (mins / weeklyMaxMin) * 100;
                  return (
                    <div key={date} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full relative flex items-end" style={{ height: "80px" }}>
                        <div
                          className="w-full rounded-t-md bg-primary-500/70 transition-all duration-500 min-h-[3px]"
                          style={{ height: `${Math.max(3, pct * 0.8)}%` }}
                          title={fmtDuration(mins, t.stats_hours, t.stats_mins)}
                        />
                      </div>
                      <span className="text-[10px] text-text-tertiary">{dayLabel(date)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-border p-4 mb-8 overflow-x-auto">
            {heatmap.length === 0 ? (
              <p className="text-xs text-text-tertiary text-center py-4">{t.stats_noFocusData}</p>
            ) : (
              <div>
                <div className="flex gap-0.5 mb-1">
                  <div className="w-8 flex-shrink-0" />
                  {dateList.slice(-14).map((date) => (
                    <div key={date} className="flex-1 text-center">
                      <span className="text-[9px] text-text-tertiary">{dayLabel(date).charAt(0)}</span>
                    </div>
                  ))}
                </div>
                {WORK_HOURS.map((hour) => (
                  <div key={hour} className="flex gap-0.5 mb-0.5">
                    <div className="w-8 flex-shrink-0 text-[9px] text-text-tertiary text-right pr-1 leading-4">
                      {hour}
                    </div>
                    {dateList.slice(-14).map((date) => {
                      const mins = heatmapLookup.get(`${date}:${hour}`) ?? 0;
                      const intensity = Math.min(1, mins / (maxCellMinutes * 0.7));
                      return (
                        <div
                          key={date}
                          className="flex-1 h-3.5 rounded-sm transition-all duration-300"
                          style={{
                            backgroundColor:
                              mins > 0
                                ? `rgba(99, 102, 241, ${0.15 + intensity * 0.85})`
                                : "var(--color-surface-tertiary)",
                          }}
                          title={mins > 0 ? fmtDuration(mins, t.stats_hours, t.stats_mins) : ""}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Insights ─── */}
        {insights.length > 0 && (
          <>
            <h3 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-3">
              {t.stats_insights}
            </h3>
            <div className="space-y-2 mb-8">
              {insights.map((insight, i) => (
                <div key={i} className="bg-surface rounded-xl border border-border p-3.5 flex gap-3">
                  <span className="text-lg leading-none flex-shrink-0">{insight.emoji}</span>
                  <p className="text-xs text-text-secondary leading-relaxed">{insight.text}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ─── Tasks ─── */}
        <h3 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-3">
          {t.stats_tasks}
        </h3>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {statCards.map((card) => (
            <div key={card.label} className="bg-surface rounded-xl border border-border p-4 text-center">
              <div className={`text-2xl font-semibold tabular-nums ${card.color}`}>
                {card.value}
              </div>
              <div className="text-[11px] text-text-tertiary mt-1">{card.label}</div>
            </div>
          ))}
        </div>

        {taskTotal > 0 && (
          <div className="bg-surface rounded-xl border border-border p-4 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-text-secondary">{t.stats_completionRate}</span>
              <span className="text-xs text-text-tertiary tabular-nums">{Math.round(completedPct)}%</span>
            </div>
            <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completedPct}%` }}
              />
            </div>
          </div>
        )}

        {/* ─── Breaks ─── */}
        <h3 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-3">
          {t.stats_breaks}
        </h3>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {breakCards.map((card) => (
            <div key={card.label} className="bg-surface rounded-xl border border-border p-4 text-center">
              <div className={`text-2xl font-semibold tabular-nums ${card.color}`}>
                {card.value}
              </div>
              <div className="text-[11px] text-text-tertiary mt-1">{card.label}</div>
            </div>
          ))}
        </div>

        {breakTotal > 0 && (
          <div className="bg-surface rounded-xl border border-border p-4">
            <span className="text-xs font-medium text-text-secondary block mb-3">
              {t.stats_breakDistribution}
            </span>
            <div className="h-3 bg-surface-tertiary rounded-full overflow-hidden flex">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${takenPct}%` }}
              />
              <div
                className="h-full bg-red-400 transition-all duration-500"
                style={{ width: `${skippedPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-text-tertiary">
                  {t.stats_taken} ({Math.round(takenPct)}%)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-[11px] text-text-tertiary">
                  {t.stats_skipped} ({Math.round(skippedPct)}%)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface Insight {
  emoji: string;
  text: string;
}

function generateInsights(
  heatmap: FocusHeatmapEntry[],
  breakStats: { breaks_taken: number; breaks_skipped: number },
  weekly: WeeklyFocusEntry[]
): Insight[] {
  const insights: Insight[] = [];

  // ── Peak focus hour ──────────────────────────────────────────────────────
  const hourTotals = new Map<number, number>();
  for (const e of heatmap) {
    hourTotals.set(e.hour, (hourTotals.get(e.hour) ?? 0) + e.focus_minutes);
  }
  if (hourTotals.size > 0) {
    let peakHour = 0, peakMins = 0;
    for (const [h, m] of hourTotals.entries()) {
      if (m > peakMins) { peakMins = m; peakHour = h; }
    }
    const fmt = (h: number) => `${String(h).padStart(2, "0")}:00`;
    insights.push({
      emoji: "🔥",
      text: `You are most focused around ${fmt(peakHour)}–${fmt(peakHour + 1)}.`,
    });
  }

  // ── Average uninterrupted session length ─────────────────────────────────
  if (weekly.length >= 3) {
    const avgMin = weekly.reduce((s, e) => s + e.total_focus_minutes, 0) / weekly.length;
    if (avgMin > 5) {
      insights.push({
        emoji: "⏱",
        text: `Your average daily focus time this week is ${Math.round(avgMin)} minutes.`,
      });
    }
  }

  // ── Best day of the week ─────────────────────────────────────────────────
  if (weekly.length >= 3) {
    const best = weekly.reduce((a, b) =>
      a.total_focus_minutes > b.total_focus_minutes ? a : b
    );
    const day = new Date(`${best.date}T12:00:00`).toLocaleDateString(undefined, { weekday: "long" });
    insights.push({
      emoji: "📅",
      text: `${day} is currently your most productive day this week.`,
    });
  }

  // ── Break compliance ─────────────────────────────────────────────────────
  const total = breakStats.breaks_taken + breakStats.breaks_skipped;
  if (total >= 3) {
    const skipRate = breakStats.breaks_skipped / total;
    if (skipRate > 0.5) {
      insights.push({
        emoji: "💡",
        text: `You skip ${Math.round(skipRate * 100)}% of break reminders. Regular breaks help with sustained focus.`,
      });
    } else if (skipRate < 0.2) {
      insights.push({
        emoji: "✅",
        text: `Great break compliance — you take ${Math.round((1 - skipRate) * 100)}% of your scheduled breaks.`,
      });
    }
  }

  // ── Late-night work pattern ───────────────────────────────────────────────
  const eveningMins = heatmap
    .filter((e) => e.hour >= 20)
    .reduce((s, e) => s + e.focus_minutes, 0);
  if (eveningMins > 60) {
    insights.push({
      emoji: "🌙",
      text: `You log significant focus time after 20:00. Consider winding down earlier for better sleep.`,
    });
  }

  return insights;
}
