import { useReminderStore } from "../stores/reminderStore";
import { useTaskStore } from "../stores/taskStore";
import { useTranslation } from "../i18n";
import { snoozeTask } from "../lib/commands";
import { fireConfetti } from "../lib/confetti";
import toast from "react-hot-toast";

export function ReminderPopup() {
  const { activeReminders, dismissReminder, clearNotified } = useReminderStore();
  const { toggleTask, fetchTasks } = useTaskStore();
  const { t } = useTranslation();

  if (activeReminders.length === 0) return null;

  const handleStart = async (taskId: string) => {
    await toggleTask(taskId);
    dismissReminder(taskId);
    fireConfetti();
    toast.success(t.reminder_taskStarted);
  };

  const handleDismiss = (taskId: string) => {
    dismissReminder(taskId);
  };

  const handleSnooze = async (taskId: string, minutes: number) => {
    try {
      await snoozeTask(taskId, minutes);
      clearNotified(taskId);
      dismissReminder(taskId);
      await fetchTasks();
      toast(`${t.reminder_snoozedFor} ${minutes} ${t.reminder_minutes}`, { icon: "\u{23F0}" });
    } catch {
      toast.error(t.reminder_snoozeError);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" role="alertdialog">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
      <div className="relative flex flex-col gap-3 max-h-[80vh] overflow-y-auto px-4">
        {activeReminders.map((task) => (
          <ReminderCard
            key={task.id}
            title={task.title}
            description={task.description}
            time={task.time}
            onStart={() => handleStart(task.id)}
            onDismiss={() => handleDismiss(task.id)}
            onSnooze={(mins) => handleSnooze(task.id, mins)}
          />
        ))}
      </div>
    </div>
  );
}

interface ReminderCardProps {
  title: string;
  description: string | null;
  time: string;
  onStart: () => void;
  onDismiss: () => void;
  onSnooze: (minutes: number) => void;
}

function ReminderCard({ title, description, time, onStart, onDismiss, onSnooze }: ReminderCardProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-sm bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden animate-slide-up">
      <div className="h-1 bg-gradient-to-r from-primary-400 to-primary-600" />

      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-text-primary leading-snug">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-text-tertiary mt-0.5 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-medium">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {t.reminder_scheduledFor} {time}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onStart}
            className="flex-1 px-4 py-2 rounded-xl text-sm font-medium
                       text-white bg-primary-500 hover:bg-primary-600
                       transition-colors duration-150 cursor-pointer
                       shadow-sm shadow-primary-500/20"
          >
            {t.reminder_start}
          </button>
          <button
            onClick={onDismiss}
            className="flex-1 px-4 py-2 rounded-xl text-sm font-medium
                       text-text-secondary bg-surface-tertiary hover:bg-border
                       transition-colors duration-150 cursor-pointer"
          >
            {t.reminder_dismiss}
          </button>
          <button
            onClick={() => onSnooze(10)}
            className="flex-1 px-4 py-2 rounded-xl text-sm font-medium
                       text-amber-400 bg-amber-500/10 hover:bg-amber-500/20
                       transition-colors duration-150 cursor-pointer"
          >
            {t.reminder_snooze10m}
          </button>
        </div>
      </div>
    </div>
  );
}
