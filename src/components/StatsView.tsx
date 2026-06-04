import { useEffect, useState } from "react";
import { useBreakStore } from "../stores/breakStore";
import { useTranslation } from "../i18n";
import { getTaskStats } from "../lib/commands";
import type { TaskStats } from "../types/settings";

export function StatsView() {
  const { stats: breakStats, fetchStats } = useBreakStore();
  const { t } = useTranslation();
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);

  useEffect(() => {
    fetchStats();
    getTaskStats().then(setTaskStats).catch(console.error);
  }, [fetchStats]);

  if (!taskStats) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-8 py-8">
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
    { label: t.stats_totalTasks, value: taskStats.total_tasks, color: "bg-primary-500" },
    { label: t.stats_completed, value: taskStats.completed_tasks, color: "bg-emerald-500" },
    { label: t.stats_pending, value: taskStats.pending_tasks, color: "bg-amber-500" },
  ];

  const breakCards = [
    { label: t.stats_breaksShown, value: breakStats.breaks_shown, color: "bg-blue-500" },
    { label: t.stats_breaksTaken, value: breakStats.breaks_taken, color: "bg-emerald-500" },
    { label: t.stats_breaksSkipped, value: breakStats.breaks_skipped, color: "bg-red-400" },
  ];

  const breakTotal = breakStats.breaks_taken + breakStats.breaks_skipped;
  const takenPct = breakTotal > 0 ? (breakStats.breaks_taken / breakTotal) * 100 : 0;
  const skippedPct = breakTotal > 0 ? (breakStats.breaks_skipped / breakTotal) * 100 : 0;

  const taskTotal = taskStats.total_tasks;
  const completedPct = taskTotal > 0 ? (taskStats.completed_tasks / taskTotal) * 100 : 0;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-xl mx-auto px-8 py-8">
        <h2 className="text-xl font-semibold text-text-primary mb-1">{t.stats_title}</h2>
        <p className="text-xs text-text-tertiary mb-8">{t.stats_subtitle}</p>

        <h3 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-3">
          {t.stats_tasks}
        </h3>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {statCards.map((card) => (
            <div key={card.label} className="bg-surface rounded-xl border border-border p-4 text-center">
              <div className="text-2xl font-semibold text-text-primary tabular-nums">
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

        <h3 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-3">
          {t.stats_breaks}
        </h3>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {breakCards.map((card) => (
            <div key={card.label} className="bg-surface rounded-xl border border-border p-4 text-center">
              <div className="text-2xl font-semibold text-text-primary tabular-nums">
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
