import { useSettingsStore } from "../stores/settingsStore";
import { useBreakStore } from "../stores/breakStore";
import { useTranslation } from "../i18n";
import { toggleWidget } from "../lib/commands";
import type { Locale } from "../i18n";

const intervalOptions = [1, 15, 30, 45, 60];

interface SettingsViewProps {
  onViewChange?: (view: string) => void;
}

export function SettingsView({ onViewChange }: SettingsViewProps) {
  const { settings, updateSettings } = useSettingsStore();
  const breakStore = useBreakStore();
  const { t } = useTranslation();

  const handleIntervalChange = (val: number) => {
    updateSettings({ break_interval: val });
    breakStore.setSecondsUntilBreak(val * 60);
  };

  const handleDarkMode = (val: boolean) => {
    updateSettings({ dark_mode: val });
    document.documentElement.classList.toggle("dark", val);
  };

  const handleLanguageChange = (lang: Locale) => {
    updateSettings({ language: lang });
  };

  const handleWidgetToggle = async () => {
    const next = !settings.widget_visible;
    updateSettings({ widget_visible: next });
    try {
      await toggleWidget();
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-xl mx-auto px-8 py-8">
        <h2 className="text-xl font-semibold text-text-primary mb-1">{t.settings_title}</h2>
        <p className="text-xs text-text-tertiary mb-8">{t.settings_subtitle}</p>

        {/* Appearance */}
        <SectionHeader>{t.settings_appearance}</SectionHeader>
        <div className="space-y-3 mb-8">
          <SettingSection title={t.settings_language} description={t.settings_languageDesc}>
            <div className="flex gap-2">
              {([["en", "English"], ["tr", "Türkçe"]] as const).map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer
                             ${settings.language === code
                               ? "bg-primary-500 text-white shadow-sm"
                               : "bg-surface-tertiary text-text-secondary hover:bg-border"
                             }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </SettingSection>

          <SettingSection title={t.settings_darkMode} description={t.settings_darkModeDesc}>
            <ToggleSwitch
              enabled={settings.dark_mode}
              onChange={handleDarkMode}
            />
          </SettingSection>
        </div>

        {/* Breaks */}
        <SectionHeader>{t.settings_breaks}</SectionHeader>
        <div className="space-y-3 mb-8">
          <SettingSection title={t.settings_breakInterval} description={t.settings_breakIntervalDesc}>
            <div className="flex gap-2">
              {intervalOptions.map((min) => (
                <button
                  key={min}
                  onClick={() => handleIntervalChange(min)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer
                             ${settings.break_interval === min
                               ? "bg-primary-500 text-white shadow-sm"
                               : "bg-surface-tertiary text-text-secondary hover:bg-border"
                             }`}
                >
                  {min} {t.settings_min}
                </button>
              ))}
            </div>
          </SettingSection>
        </div>

        {/* Notifications */}
        <SectionHeader>{t.settings_notifications}</SectionHeader>
        <div className="space-y-3 mb-8">
          <SettingSection title={t.settings_notificationSound} description={t.settings_notificationSoundDesc}>
            <ToggleSwitch
              enabled={settings.sound_enabled}
              onChange={(val) => updateSettings({ sound_enabled: val })}
            />
          </SettingSection>
        </div>

        {/* Widgets */}
        <SectionHeader>{t.settings_widgets}</SectionHeader>
        <div className="space-y-3 mb-8">
          <SettingSection title={t.settings_floatingWidget} description={t.settings_floatingWidgetDesc}>
            <ToggleSwitch
              enabled={settings.widget_visible}
              onChange={handleWidgetToggle}
            />
          </SettingSection>
        </div>

        {/* About */}
        <SectionHeader>{t.settings_about}</SectionHeader>
        <div className="space-y-3">
          {onViewChange && (
            <button
              onClick={() => onViewChange("help")}
              className="w-full bg-surface rounded-xl border border-border p-4 text-left
                         hover:bg-surface-tertiary transition-colors duration-150 cursor-pointer
                         flex items-center justify-between"
            >
              <div>
                <h3 className="text-sm font-medium text-text-primary">{t.settings_helpSupport}</h3>
                <p className="text-xs text-text-tertiary mt-0.5">{t.help_subtitle}</p>
              </div>
              <svg className="w-4 h-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
          <div className="bg-surface rounded-xl border border-border p-4">
            <div className="text-xs text-text-tertiary">{t.sidebar_version}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-3">
      {children}
    </h3>
  );
}

function SettingSection({ title, description, children }: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <div className="flex items-center justify-between">
        <div className="mr-4">
          <h3 className="text-sm font-medium text-text-primary">{title}</h3>
          <p className="text-xs text-text-tertiary mt-0.5">{description}</p>
        </div>
        <div className="flex-shrink-0">{children}</div>
      </div>
    </div>
  );
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (val: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      role="switch"
      aria-checked={enabled}
      className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 cursor-pointer
                 ${enabled ? "bg-primary-500" : "bg-surface-tertiary border border-border"}`}
    >
      <span
        className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm
                   transition-transform duration-200
                   ${enabled ? "translate-x-[18px]" : "translate-x-0"}`}
      />
    </button>
  );
}
