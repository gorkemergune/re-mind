export type Locale = "en" | "tr";

export interface TranslationDictionary {
  // Sidebar
  sidebar_appTitle: string;
  sidebar_subtitle: string;
  sidebar_newTask: string;
  sidebar_upcoming: string;
  sidebar_completed: string;
  sidebar_allTasks: string;
  sidebar_statistics: string;
  sidebar_settings: string;
  sidebar_help: string;
  sidebar_version: string;

  // TaskList
  taskList_upcoming: string;
  taskList_completed: string;
  taskList_allTasks: string;
  taskList_noTasks: string;
  taskList_taskSingular: string;
  taskList_taskPlural: string;
  taskList_loading: string;
  taskList_addTask: string;
  taskList_today: string;
  taskList_tomorrow: string;
  taskList_upcomingSection: string;
  taskList_past: string;
  taskList_noCompletedTasks: string;
  taskList_noUpcomingTasks: string;
  taskList_completedHint: string;
  taskList_getStartedHint: string;
  taskList_createTask: string;

  // TaskCard
  repeat_once: string;
  repeat_daily: string;
  repeat_weekdays: string;
  repeat_weekly: string;
  date_today: string;
  date_tomorrow: string;

  // AddTaskModal
  addTask_title: string;
  addTask_subtitle: string;
  addTask_titleLabel: string;
  addTask_titlePlaceholder: string;
  addTask_descriptionLabel: string;
  addTask_optional: string;
  addTask_descriptionPlaceholder: string;
  addTask_dateLabel: string;
  addTask_timeLabel: string;
  addTask_repeatLabel: string;
  addTask_cancel: string;
  addTask_creating: string;
  addTask_createTask: string;
  addTask_validationTitle: string;
  addTask_successCreated: string;
  addTask_errorCreate: string;

  // ReminderPopup
  reminder_taskStarted: string;
  reminder_snoozedFor: string;
  reminder_minutes: string;
  reminder_snoozeError: string;
  reminder_scheduledFor: string;
  reminder_start: string;
  reminder_dismiss: string;
  reminder_snooze10m: string;

  // BreakWindow
  break_drinkWater: string;
  break_stretch: string;
  break_standUp: string;
  break_timeForBreak: string;
  break_workingHard: string;
  break_selectDuration: string;
  break_minutes: string;
  break_skipBreak: string;
  break_snooze10: string;
  break_breakEndsIn: string;
  break_breakComplete: string;
  break_letsGetBack: string;
  break_continue: string;

  // SettingsView
  settings_title: string;
  settings_subtitle: string;
  settings_appearance: string;
  settings_breakInterval: string;
  settings_breakIntervalDesc: string;
  settings_notificationSound: string;
  settings_notificationSoundDesc: string;
  settings_darkMode: string;
  settings_darkModeDesc: string;
  settings_floatingWidget: string;
  settings_floatingWidgetDesc: string;
  settings_language: string;
  settings_languageDesc: string;
  settings_breaks: string;
  settings_notifications: string;
  settings_widgets: string;
  settings_about: string;
  settings_helpSupport: string;
  settings_min: string;

  // StatsView
  stats_title: string;
  stats_subtitle: string;
  stats_tasks: string;
  stats_totalTasks: string;
  stats_completed: string;
  stats_pending: string;
  stats_completionRate: string;
  stats_breaks: string;
  stats_breaksShown: string;
  stats_breaksTaken: string;
  stats_breaksSkipped: string;
  stats_breakDistribution: string;
  stats_taken: string;
  stats_skipped: string;

  // WidgetView
  widget_nextTask: string;
  widget_noUpcoming: string;
  widget_breakIn: string;

  // Scheduler
  notification_scheduledNow: string;

  // ConfirmDialog
  confirm_deleteTask: string;
  confirm_deleteTaskDesc: string;
  confirm_delete: string;
  confirm_cancel: string;

  // Help Center
  help_title: string;
  help_subtitle: string;
  help_gettingStarted: string;
  help_gettingStartedContent: string;
  help_creatingTasks: string;
  help_creatingTasksContent: string;
  help_notifications: string;
  help_notificationsContent: string;
  help_breakReminders: string;
  help_breakRemindersContent: string;
  help_floatingWidget: string;
  help_floatingWidgetContent: string;
  help_systemTray: string;
  help_systemTrayContent: string;
  help_faq: string;
  help_faqContent: string;
}
