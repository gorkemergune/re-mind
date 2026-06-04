import { useState } from "react";
import { format, parseISO, isToday, isTomorrow, isPast } from "date-fns";
import { tr as trLocale } from "date-fns/locale/tr";
import type { Task } from "../types/task";
import { useTaskStore } from "../stores/taskStore";
import { useTranslation } from "../i18n";
import { ConfirmDialog } from "./ConfirmDialog";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { removeTask, toggleTask } = useTaskStore();
  const { t, locale } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const taskDate = parseISO(task.date);

  const repeatLabels: Record<string, string> = {
    once: t.repeat_once,
    daily: t.repeat_daily,
    weekdays: t.repeat_weekdays,
    weekly: t.repeat_weekly,
  };

  const getDateLabel = () => {
    if (isToday(taskDate)) return t.date_today;
    if (isTomorrow(taskDate)) return t.date_tomorrow;
    return format(taskDate, "d MMM yyyy", locale === "tr" ? { locale: trLocale } : undefined);
  };

  const isOverdue = !task.completed && isPast(new Date(`${task.date}T${task.time}`));

  return (
    <>
      <div
        className={`group relative bg-surface rounded-xl border transition-all duration-200
                    hover:shadow-md hover:shadow-black/10 hover:-translate-y-0.5
                    ${task.completed ? "border-border-light opacity-60" : "border-border"}
                    ${isOverdue ? "border-red-500/30" : ""}`}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => toggleTask(task.id)}
              aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
              className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 cursor-pointer
                         flex items-center justify-center transition-all duration-200
                         ${
                           task.completed
                             ? "bg-primary-500 border-primary-500"
                             : "border-text-tertiary hover:border-primary-400"
                         }`}
            >
              {task.completed && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </button>

            <div className="flex-1 min-w-0">
              <h3
                className={`text-sm font-medium leading-snug
                           ${task.completed ? "line-through text-text-tertiary" : "text-text-primary"}`}
              >
                {task.title}
              </h3>

              {task.description && (
                <p className="text-xs text-text-tertiary mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-2 mt-2.5">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full
                             ${isOverdue ? "bg-red-500/10 text-red-400" : "bg-surface-tertiary text-text-tertiary"}`}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  {getDateLabel()}
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-surface-tertiary text-text-tertiary">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  {task.time}
                </span>

                {task.repeat_mode !== "once" && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-400">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182M2.985 19.644l3.181-3.183" />
                    </svg>
                    {repeatLabels[task.repeat_mode]}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              aria-label={`${t.confirm_deleteTask} ${task.title}`}
              className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 rounded-md
                         text-text-tertiary hover:text-red-400 hover:bg-red-500/10
                         transition-all duration-150 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title={t.confirm_deleteTask}
        description={t.confirm_deleteTaskDesc}
        confirmLabel={t.confirm_delete}
        cancelLabel={t.confirm_cancel}
        variant="danger"
        onConfirm={() => {
          removeTask(task.id);
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
