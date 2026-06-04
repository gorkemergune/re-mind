import { useReminderStore } from "../stores/reminderStore";
import { useTranslation } from "../i18n";

export function PreReminderToast() {
  const { preReminders, dismissPreReminder } = useReminderStore();
  const { t } = useTranslation();

  if (preReminders.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[90] flex flex-col gap-2 pointer-events-none">
      {preReminders.map((entry) => (
        <div
          key={entry.id}
          className="pointer-events-auto w-72 bg-surface/95 backdrop-blur-sm rounded-2xl
                     border border-border shadow-lg shadow-black/10 overflow-hidden
                     animate-slide-in-right"
        >
          <div className="h-0.5 bg-gradient-to-r from-amber-400 to-orange-400" />
          <div className="p-3.5">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-amber-400 text-base leading-none flex-shrink-0">🔔</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-text-primary leading-snug truncate">
                    {entry.taskTitle}
                  </p>
                  {entry.taskDescription && (
                    <p className="text-[11px] text-text-tertiary truncate">
                      {entry.taskDescription}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => dismissPreReminder(entry.id)}
                className="text-text-tertiary hover:text-text-secondary transition-colors
                           flex-shrink-0 p-0.5 rounded cursor-pointer"
                aria-label="Dismiss"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full
                               bg-amber-500/10 text-amber-500 font-medium">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {t.notification_upcomingTask}
              </span>
              <span className="text-[11px] text-text-tertiary">
                {t.notification_startsIn} {entry.minutesBefore} {t.reminder_minutes} · {entry.taskTime}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
