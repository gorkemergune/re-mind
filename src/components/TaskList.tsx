import { useTaskStore } from "../stores/taskStore";
import { useTranslation } from "../i18n";
import { TaskCard } from "./TaskCard";
import { isToday, isTomorrow, parseISO, isAfter } from "date-fns";

interface TaskListProps {
  view: string;
}

export function TaskList({ view }: TaskListProps) {
  const { tasks, loading, setShowAddForm } = useTaskStore();
  const { t } = useTranslation();

  const filteredTasks = tasks.filter((task) => {
    if (view === "upcoming") return !task.completed;
    if (view === "completed") return task.completed;
    return true;
  });

  const getTitle = () => {
    switch (view) {
      case "upcoming": return t.taskList_upcoming;
      case "completed": return t.taskList_completed;
      default: return t.taskList_allTasks;
    }
  };

  const getSubtitle = () => {
    const count = filteredTasks.length;
    if (count === 0) return t.taskList_noTasks;
    return `${count} ${count > 1 ? t.taskList_taskPlural : t.taskList_taskSingular}`;
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-8">
          <div className="mb-6">
            <div className="h-6 w-32 bg-surface-tertiary rounded-lg animate-shimmer" />
            <div className="h-4 w-20 bg-surface-tertiary rounded-lg mt-2 animate-shimmer" />
          </div>
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-surface rounded-xl border border-border p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-surface-tertiary animate-shimmer" />
                  <div className="flex-1">
                    <div className="h-4 w-48 bg-surface-tertiary rounded animate-shimmer" />
                    <div className="h-3 w-32 bg-surface-tertiary rounded mt-3 animate-shimmer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const todayTasks = filteredTasks.filter((task) => isToday(parseISO(task.date)));
  const tomorrowTasks = filteredTasks.filter((task) => isTomorrow(parseISO(task.date)));
  const laterTasks = filteredTasks.filter((task) => {
    const d = parseISO(task.date);
    return !isToday(d) && !isTomorrow(d) && isAfter(d, new Date());
  });
  const pastTasks = filteredTasks.filter((task) => {
    const d = parseISO(task.date);
    return !isToday(d) && !isTomorrow(d) && !isAfter(d, new Date());
  });

  const sections = [
    { title: t.taskList_today, tasks: todayTasks },
    { title: t.taskList_tomorrow, tasks: tomorrowTasks },
    { title: t.taskList_upcomingSection, tasks: laterTasks },
    { title: t.taskList_past, tasks: pastTasks },
  ].filter((s) => s.tasks.length > 0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">{getTitle()}</h2>
            <p className="text-xs text-text-tertiary mt-0.5">{getSubtitle()}</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                       text-primary-400 bg-primary-50 hover:bg-primary-100
                       transition-colors duration-150 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {t.taskList_addTask}
          </button>
        </div>

        {filteredTasks.length === 0 ? (
          <EmptyState view={view} onAdd={() => setShowAddForm(true)} />
        ) : (
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2 px-1">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ view, onAdd }: { view: string; onAdd: () => void }) {
  const { t } = useTranslation();
  const isCompleted = view === "completed";

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-surface-tertiary flex items-center justify-center mb-4">
        {isCompleted ? (
          <svg className="w-8 h-8 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        )}
      </div>
      <p className="text-sm font-medium text-text-secondary mb-1">
        {isCompleted ? t.taskList_noCompletedTasks : t.taskList_noUpcomingTasks}
      </p>
      <p className="text-xs text-text-tertiary mb-4">
        {isCompleted ? t.taskList_completedHint : t.taskList_getStartedHint}
      </p>
      {!isCompleted && (
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
                     text-white bg-primary-500 hover:bg-primary-600
                     transition-colors duration-150 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {t.taskList_createTask}
        </button>
      )}
    </div>
  );
}
