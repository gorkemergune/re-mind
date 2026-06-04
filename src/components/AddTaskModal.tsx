import { useState, useEffect } from "react";
import { format } from "date-fns";
import type { RepeatMode, TaskFormData } from "../types/task";
import { useTaskStore } from "../stores/taskStore";
import { useTranslation } from "../i18n";
import toast from "react-hot-toast";

export function AddTaskModal() {
  const { setShowAddForm, addTask } = useTaskStore();
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<TaskFormData>({
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: format(new Date(), "HH:mm"),
    repeat_mode: "once",
  });

  const repeatOptions: { value: RepeatMode; label: string }[] = [
    { value: "once", label: t.repeat_once },
    { value: "daily", label: t.repeat_daily },
    { value: "weekdays", label: t.repeat_weekdays },
    { value: "weekly", label: t.repeat_weekly },
  ];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowAddForm(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setShowAddForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error(t.addTask_validationTitle);
      return;
    }
    setSubmitting(true);
    try {
      await addTask(form);
      toast.success(t.addTask_successCreated);
      setShowAddForm(false);
    } catch {
      toast.error(t.addTask_errorCreate);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="add-task-title">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => setShowAddForm(false)}
      />
      <div className="relative bg-surface rounded-2xl shadow-2xl border border-border w-full max-w-md mx-4 overflow-hidden animate-scale-in">
        <div className="px-6 pt-5 pb-4 border-b border-border-light">
          <h2 id="add-task-title" className="text-base font-semibold text-text-primary">{t.addTask_title}</h2>
          <p className="text-xs text-text-tertiary mt-0.5">
            {t.addTask_subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              {t.addTask_titleLabel}
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={t.addTask_titlePlaceholder}
              autoFocus
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary
                         text-sm text-text-primary placeholder:text-text-tertiary
                         focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
                         transition-all duration-150"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              {t.addTask_descriptionLabel}
              <span className="font-normal text-text-tertiary ml-1">{t.addTask_optional}</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder={t.addTask_descriptionPlaceholder}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary
                         text-sm text-text-primary placeholder:text-text-tertiary resize-none
                         focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
                         transition-all duration-150"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                {t.addTask_dateLabel}
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary
                           text-sm text-text-primary
                           focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
                           transition-all duration-150"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                {t.addTask_timeLabel}
              </label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary
                           text-sm text-text-primary
                           focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
                           transition-all duration-150"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              {t.addTask_repeatLabel}
            </label>
            <div className="flex gap-2">
              {repeatOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, repeat_mode: opt.value })}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer
                             ${
                               form.repeat_mode === opt.value
                                 ? "bg-primary-500 text-white shadow-sm"
                                 : "bg-surface-tertiary text-text-secondary hover:bg-border"
                             }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium
                         text-text-secondary bg-surface-tertiary
                         hover:bg-border transition-colors duration-150 cursor-pointer"
            >
              {t.addTask_cancel}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium
                         text-white bg-primary-500 hover:bg-primary-600
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-150 cursor-pointer"
            >
              {submitting ? t.addTask_creating : t.addTask_createTask}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
