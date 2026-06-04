import type { TranslationDictionary } from "./types";

export const en: TranslationDictionary = {
  // Sidebar
  sidebar_appTitle: "Reminder",
  sidebar_subtitle: "Stay on track",
  sidebar_newTask: "New Task",
  sidebar_upcoming: "Upcoming",
  sidebar_completed: "Completed",
  sidebar_allTasks: "All Tasks",
  sidebar_statistics: "Statistics",
  sidebar_settings: "Settings",
  sidebar_help: "Help",
  sidebar_version: "Reminder v0.1.0",

  // TaskList
  taskList_upcoming: "Upcoming",
  taskList_completed: "Completed",
  taskList_allTasks: "All Tasks",
  taskList_noTasks: "No tasks",
  taskList_taskSingular: "task",
  taskList_taskPlural: "tasks",
  taskList_loading: "Loading tasks...",
  taskList_addTask: "Add Task",
  taskList_today: "Today",
  taskList_tomorrow: "Tomorrow",
  taskList_upcomingSection: "Upcoming",
  taskList_past: "Past",
  taskList_noCompletedTasks: "No completed tasks",
  taskList_noUpcomingTasks: "No upcoming tasks",
  taskList_completedHint: "Tasks you complete will appear here",
  taskList_getStartedHint: "Create your first task to get started",
  taskList_createTask: "Create Task",

  // TaskCard
  repeat_once: "Once",
  repeat_daily: "Daily",
  repeat_weekdays: "Weekdays",
  repeat_weekly: "Weekly",
  date_today: "Today",
  date_tomorrow: "Tomorrow",

  // AddTaskModal
  addTask_title: "New Task",
  addTask_subtitle: "Schedule a new reminder",
  addTask_titleLabel: "Title",
  addTask_titlePlaceholder: "e.g., LeetCode Practice",
  addTask_descriptionLabel: "Description",
  addTask_optional: "(optional)",
  addTask_descriptionPlaceholder: "Add details...",
  addTask_dateLabel: "Date",
  addTask_timeLabel: "Time",
  addTask_repeatLabel: "Repeat",
  addTask_cancel: "Cancel",
  addTask_creating: "Creating...",
  addTask_createTask: "Create Task",
  addTask_validationTitle: "Please enter a task title",
  addTask_successCreated: "Task created",
  addTask_errorCreate: "Failed to create task",

  // ReminderPopup
  reminder_taskStarted: "Task started!",
  reminder_snoozedFor: "Snoozed for",
  reminder_minutes: "minutes",
  reminder_snoozeError: "Failed to snooze task",
  reminder_scheduledFor: "Scheduled for",
  reminder_start: "Start",
  reminder_dismiss: "Dismiss",
  reminder_snooze10m: "Snooze 10m",

  // BreakWindow
  break_drinkWater: "Drink water",
  break_stretch: "Stretch",
  break_standUp: "Stand up",
  break_timeForBreak: "Time for a break",
  break_workingHard: "You've been working hard. Take a moment for yourself.",
  break_selectDuration: "Select break duration",
  break_minutes: "min",
  break_skipBreak: "Skip Break",
  break_snooze10: "Snooze 10 Minutes",
  break_breakEndsIn: "Break ends in",
  break_breakComplete: "Break complete!",
  break_letsGetBack: "Great job taking a break. Let's get back to work.",
  break_continue: "Continue",

  // SettingsView
  settings_title: "Settings",
  settings_subtitle: "Customize your experience",
  settings_appearance: "Appearance",
  settings_breakInterval: "Break Interval",
  settings_breakIntervalDesc: "How often to remind you to take a break",
  settings_notificationSound: "Notification Sound",
  settings_notificationSoundDesc: "Play a sound when reminders fire",
  settings_darkMode: "Dark Mode",
  settings_darkModeDesc: "Switch to darker theme variant",
  settings_floatingWidget: "Floating Widget",
  settings_floatingWidgetDesc: "Show the always-on-top mini widget",
  settings_language: "Language",
  settings_languageDesc: "Choose your preferred language",
  settings_breaks: "Breaks",
  settings_notifications: "Notifications",
  settings_widgets: "Widgets",
  settings_about: "About",
  settings_helpSupport: "Help & Support",
  settings_min: "min",

  // StatsView
  stats_title: "Statistics",
  stats_subtitle: "Track your productivity",
  stats_tasks: "Tasks",
  stats_totalTasks: "Total Tasks",
  stats_completed: "Completed",
  stats_pending: "Pending",
  stats_completionRate: "Completion Rate",
  stats_breaks: "Breaks",
  stats_breaksShown: "Breaks Shown",
  stats_breaksTaken: "Breaks Taken",
  stats_breaksSkipped: "Breaks Skipped",
  stats_breakDistribution: "Break Response Distribution",
  stats_taken: "Taken",
  stats_skipped: "Skipped",

  // WidgetView
  widget_nextTask: "Next task",
  widget_noUpcoming: "No upcoming tasks",
  widget_breakIn: "Break in",

  // Scheduler
  notification_scheduledNow: "Scheduled for now",

  // ConfirmDialog
  confirm_deleteTask: "Delete Task?",
  confirm_deleteTaskDesc: "This action cannot be undone.",
  confirm_delete: "Delete",
  confirm_cancel: "Cancel",

  // Help Center
  help_title: "Help Center",
  help_subtitle: "Learn how to use Reminder",
  help_gettingStarted: "Getting Started",
  help_gettingStartedContent:
    "Welcome to Reminder! This app helps you stay productive by scheduling tasks and reminding you to take regular breaks.\n\nStart by creating your first task using the \"New Task\" button in the sidebar. Set a title, date, time, and optionally a repeat schedule.\n\nThe app runs in the background via the system tray, so even when you close the window, your reminders will still fire.",
  help_creatingTasks: "Creating Tasks",
  help_creatingTasksContent:
    "Click \"New Task\" in the sidebar or use the Add Task button at the top of the task list.\n\nEach task has a title (required), an optional description, a date, a time, and a repeat mode. Repeat modes include Once, Daily, Weekdays (Mon-Fri), and Weekly.\n\nTasks appear in the Upcoming view grouped by Today, Tomorrow, Upcoming, and Past.",
  help_notifications: "Notifications",
  help_notificationsContent:
    "When a task's scheduled time arrives, you'll receive a native macOS notification, an in-app popup, and an optional sound alert.\n\nFrom the reminder popup, you can Start the task (marks it complete), Dismiss it, or Snooze it for 10 minutes.\n\nYou can enable or disable notification sounds in Settings.",
  help_breakReminders: "Break Reminders",
  help_breakRemindersContent:
    "Reminder encourages you to take regular breaks for your health. By default, a break reminder appears every 30 minutes.\n\nWhen a break triggers, you'll see a fullscreen overlay with suggestions like drinking water, stretching, and taking a walk.\n\nYou can configure the break interval (15-60 min) and break duration (1-10 min) in Settings. Breaks can be paused from the system tray menu.",
  help_floatingWidget: "Floating Widget",
  help_floatingWidgetContent:
    "The floating widget is a small always-on-top window that displays the current time, your next upcoming task, and a countdown to your next break.\n\nEnable it from Settings or toggle it from the system tray menu. You can drag it anywhere on your screen, including a second monitor.",
  help_systemTray: "System Tray",
  help_systemTrayContent:
    "When you close the main window, Reminder continues running in the background via the system tray icon in your menu bar.\n\nRight-click (or click) the tray icon to access quick actions: Open the app, Add a Task, Pause/Resume break reminders, Toggle the floating widget, or Quit entirely.",
  help_faq: "Frequently Asked Questions",
  help_faqContent:
    "Q: How do I quit the app completely?\nA: Right-click the tray icon in the menu bar and select \"Quit Reminder.\"\n\nQ: Can I change the notification sound?\nA: You can enable or disable the sound in Settings. The app uses a built-in chime.\n\nQ: Where is my data stored?\nA: All data is stored locally in a SQLite database in your app data folder. Nothing is sent to the cloud.\n\nQ: How do I change the language?\nA: Go to Settings and select your preferred language from the Language section.",
};
