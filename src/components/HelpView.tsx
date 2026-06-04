import { useState } from "react";
import { useTranslation } from "../i18n";
import type { TranslationDictionary } from "../i18n";

interface HelpSection {
  titleKey: keyof TranslationDictionary;
  contentKey: keyof TranslationDictionary;
  icon: string;
}

const helpSections: HelpSection[] = [
  { titleKey: "help_gettingStarted", contentKey: "help_gettingStartedContent", icon: "rocket" },
  { titleKey: "help_creatingTasks", contentKey: "help_creatingTasksContent", icon: "plus" },
  { titleKey: "help_notifications", contentKey: "help_notificationsContent", icon: "bell" },
  { titleKey: "help_breakReminders", contentKey: "help_breakRemindersContent", icon: "heart" },
  { titleKey: "help_floatingWidget", contentKey: "help_floatingWidgetContent", icon: "widget" },
  { titleKey: "help_systemTray", contentKey: "help_systemTrayContent", icon: "tray" },
  { titleKey: "help_faq", contentKey: "help_faqContent", icon: "question" },
];

export function HelpView() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>("help_gettingStarted");

  const toggle = (key: string) => {
    setExpanded(expanded === key ? null : key);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-xl mx-auto px-8 py-8">
        <h2 className="text-xl font-semibold text-text-primary mb-1">{t.help_title}</h2>
        <p className="text-xs text-text-tertiary mb-8">{t.help_subtitle}</p>

        <div className="space-y-2">
          {helpSections.map((section) => {
            const isOpen = expanded === section.titleKey;
            const title = t[section.titleKey];
            const content = t[section.contentKey];

            return (
              <div
                key={section.titleKey}
                className="bg-surface rounded-xl border border-border overflow-hidden"
              >
                <button
                  onClick={() => toggle(section.titleKey)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer
                             hover:bg-surface-tertiary transition-colors duration-150"
                >
                  <HelpIcon name={section.icon} />
                  <span className="flex-1 text-sm font-medium text-text-primary">
                    {title}
                  </span>
                  <svg
                    className={`w-4 h-4 text-text-tertiary transition-transform duration-200
                               ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-200
                             ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="px-4 pb-4 pt-0">
                    <div className="border-t border-border-light pt-3">
                      {content.split("\n\n").map((paragraph, i) => (
                        <p key={i} className="text-sm text-text-secondary leading-relaxed mb-2 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HelpIcon({ name }: { name: string }) {
  const cls = "w-4 h-4 text-text-tertiary";
  switch (name) {
    case "rocket":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      );
    case "plus":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      );
    case "bell":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
      );
    case "heart":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      );
    case "widget":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      );
    case "tray":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
        </svg>
      );
    case "question":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
        </svg>
      );
    default:
      return null;
  }
}
