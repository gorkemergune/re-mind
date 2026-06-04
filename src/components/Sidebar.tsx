import { useTaskStore } from "../stores/taskStore";
import { useTranslation } from "../i18n";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { tasks, setShowAddForm } = useTaskStore();
  const { t } = useTranslation();

  const upcomingCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.filter((task) => task.completed).length;

  const taskNavItems = [
    { id: "upcoming", label: t.sidebar_upcoming, icon: "clock", count: upcomingCount },
    { id: "completed", label: t.sidebar_completed, icon: "check", count: completedCount },
    { id: "all", label: t.sidebar_allTasks, icon: "list", count: tasks.length },
  ];

  const appNavItems = [
    { id: "stats", label: t.sidebar_statistics, icon: "chart" },
    { id: "help", label: t.sidebar_help, icon: "question" },
    { id: "settings", label: t.sidebar_settings, icon: "gear" },
  ];

  return (
    <nav className="w-60 flex-shrink-0 bg-surface border-r border-border flex flex-col h-full">
      <div className="p-5 pb-3">
        <h1 className="text-lg font-semibold text-text-primary tracking-tight">
          {t.sidebar_appTitle}
        </h1>
        <p className="text-xs text-text-tertiary mt-0.5">{t.sidebar_subtitle}</p>
      </div>

      <div className="px-3 mb-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg
                     bg-primary-500 text-white text-sm font-medium
                     hover:bg-primary-600 active:bg-primary-700
                     transition-colors duration-150 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {t.sidebar_newTask}
        </button>
      </div>

      <div className="flex-1 px-3 overflow-y-auto">
        <div className="space-y-0.5">
          {taskNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              aria-current={activeView === item.id ? "page" : undefined}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm
                         transition-colors duration-150 cursor-pointer
                         ${activeView === item.id
                           ? "bg-primary-50 text-primary-400 font-medium"
                           : "text-text-secondary hover:bg-surface-tertiary"
                         }`}
            >
              <span className="flex items-center gap-2.5">
                <NavIcon name={item.icon} active={activeView === item.id} />
                {item.label}
              </span>
              {item.count > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                             ${activeView === item.id
                               ? "bg-primary-100 text-primary-400"
                               : "bg-surface-tertiary text-text-tertiary"
                             }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-border-light">
          <div className="space-y-0.5">
            {appNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                aria-current={activeView === item.id ? "page" : undefined}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                           transition-colors duration-150 cursor-pointer
                           ${activeView === item.id
                             ? "bg-primary-50 text-primary-400 font-medium"
                             : "text-text-secondary hover:bg-surface-tertiary"
                           }`}
              >
                <NavIcon name={item.icon} active={activeView === item.id} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-3 py-4 border-t border-border-light">
        <p className="text-[11px] text-text-tertiary text-center">
          {t.sidebar_version}
        </p>
      </div>
    </nav>
  );
}

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const color = active ? "text-primary-400" : "text-text-tertiary";
  const cls = `w-4 h-4 ${color}`;

  switch (name) {
    case "clock":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      );
    case "check":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      );
    case "list":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      );
    case "chart":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      );
    case "question":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
        </svg>
      );
    case "gear":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      );
    default:
      return null;
  }
}
