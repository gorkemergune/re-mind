import type { TranslationDictionary } from "./types";

export const tr: TranslationDictionary = {
  // Sidebar
  sidebar_appTitle: "Hatırlatıcı",
  sidebar_subtitle: "Yolunda kal",
  sidebar_newTask: "Yeni Görev",
  sidebar_upcoming: "Yaklaşan",
  sidebar_completed: "Tamamlanan",
  sidebar_allTasks: "Tüm Görevler",
  sidebar_statistics: "İstatistikler",
  sidebar_settings: "Ayarlar",
  sidebar_help: "Yardım",
  sidebar_version: "Hatırlatıcı v0.1.0",

  // TaskList
  taskList_upcoming: "Yaklaşan",
  taskList_completed: "Tamamlanan",
  taskList_allTasks: "Tüm Görevler",
  taskList_noTasks: "Görev yok",
  taskList_taskSingular: "görev",
  taskList_taskPlural: "görev",
  taskList_loading: "Görevler yükleniyor...",
  taskList_addTask: "Görev Ekle",
  taskList_today: "Bugün",
  taskList_tomorrow: "Yarın",
  taskList_upcomingSection: "Yaklaşan",
  taskList_past: "Geçmiş",
  taskList_noCompletedTasks: "Tamamlanan görev yok",
  taskList_noUpcomingTasks: "Yaklaşan görev yok",
  taskList_completedHint: "Tamamladığınız görevler burada görünecek",
  taskList_getStartedHint: "Başlamak için ilk görevinizi oluşturun",
  taskList_createTask: "Görev Oluştur",

  // TaskCard
  repeat_once: "Bir kez",
  repeat_daily: "Günlük",
  repeat_weekdays: "Hafta içi",
  repeat_weekly: "Haftalık",
  date_today: "Bugün",
  date_tomorrow: "Yarın",

  // AddTaskModal
  addTask_title: "Yeni Görev",
  addTask_subtitle: "Yeni bir hatırlatıcı planla",
  addTask_titleLabel: "Başlık",
  addTask_titlePlaceholder: "örn., LeetCode Çalışması",
  addTask_descriptionLabel: "Açıklama",
  addTask_optional: "(isteğe bağlı)",
  addTask_descriptionPlaceholder: "Detay ekle...",
  addTask_dateLabel: "Tarih",
  addTask_timeLabel: "Saat",
  addTask_repeatLabel: "Tekrar",
  addTask_cancel: "İptal",
  addTask_creating: "Oluşturuluyor...",
  addTask_createTask: "Görev Oluştur",
  addTask_validationTitle: "Lütfen bir görev başlığı girin",
  addTask_successCreated: "Görev oluşturuldu",
  addTask_errorCreate: "Görev oluşturulamadı",

  // ReminderPopup
  reminder_taskStarted: "Görev başlatıldı!",
  reminder_snoozedFor: "Ertelendi:",
  reminder_minutes: "dakika",
  reminder_snoozeError: "Erteleme başarısız oldu",
  reminder_scheduledFor: "Planlanan saat:",
  reminder_start: "Başlat",
  reminder_dismiss: "Kapat",
  reminder_snooze10m: "10dk Ertele",

  // BreakWindow
  break_drinkWater: "Su iç",
  break_stretch: "Esne",
  break_standUp: "Ayağa kalk",
  break_timeForBreak: "Mola zamanı",
  break_workingHard: "Çok çalıştınız. Kendinize bir an verin.",
  break_selectDuration: "Mola süresini seçin",
  break_minutes: "dk",
  break_skipBreak: "Molayı Atla",
  break_snooze10: "10 Dakika Ertele",
  break_breakEndsIn: "Mola bitiyor",
  break_breakComplete: "Mola tamamlandı!",
  break_letsGetBack: "Harika bir mola verdiniz. Çalışmaya geri dönelim.",
  break_continue: "Devam Et",

  // SettingsView
  settings_title: "Ayarlar",
  settings_subtitle: "Deneyiminizi özelleştirin",
  settings_appearance: "Görünüm",
  settings_breakInterval: "Mola Aralığı",
  settings_breakIntervalDesc: "Ne sıklıkla mola hatırlatması yapılsın",
  settings_notificationSound: "Bildirim Sesi",
  settings_notificationSoundDesc: "Hatırlatıcılar çaldığında ses çal",
  settings_darkMode: "Karanlık Mod",
  settings_darkModeDesc: "Daha koyu tema varyantına geç",
  settings_floatingWidget: "Kayan Widget",
  settings_floatingWidgetDesc: "Her zaman üstte kalan mini widget'ı göster",
  settings_language: "Dil",
  settings_languageDesc: "Tercih ettiğiniz dili seçin",
  settings_breaks: "Molalar",
  settings_notifications: "Bildirimler",
  settings_widgets: "Widget'lar",
  settings_about: "Hakkında",
  settings_helpSupport: "Yardım ve Destek",
  settings_min: "dk",

  // StatsView
  stats_title: "İstatistikler",
  stats_subtitle: "Üretkenliğinizi takip edin",
  stats_tasks: "Görevler",
  stats_totalTasks: "Toplam Görev",
  stats_completed: "Tamamlanan",
  stats_pending: "Bekleyen",
  stats_completionRate: "Tamamlanma Oranı",
  stats_breaks: "Molalar",
  stats_breaksShown: "Gösterilen Mola",
  stats_breaksTaken: "Alınan Mola",
  stats_breaksSkipped: "Atlanan Mola",
  stats_breakDistribution: "Mola Yanıt Dağılımı",
  stats_taken: "Alınan",
  stats_skipped: "Atlanan",

  // WidgetView
  widget_nextTask: "Sonraki görev",
  widget_noUpcoming: "Yaklaşan görev yok",
  widget_breakIn: "Molaya",

  // Scheduler / notifications
  notification_scheduledNow: "Şimdi planlandı",
  notification_startsIn: "Başlıyor",
  notification_upcomingTask: "Yaklaşan Görev",

  // StatsView analytics
  stats_focus: "Odak",
  stats_focusHeatmap: "Odak Isı Haritası",
  stats_totalFocusTime: "Toplam Odak Süresi",
  stats_weeklyFocus: "Haftalık Odak",
  stats_insights: "Öngörüler",
  stats_noFocusData: "Henüz odak verisi yok. Çalışırken uygulamayı açık tutun.",
  stats_hours: "s",
  stats_mins: "d",
  stats_daily: "Günlük",
  stats_weekly: "Haftalık",
  stats_heatmapHint: "Koyu = daha fazla odak süresi",

  // ConfirmDialog
  confirm_deleteTask: "Görevi Sil?",
  confirm_deleteTaskDesc: "Bu işlem geri alınamaz.",
  confirm_delete: "Sil",
  confirm_cancel: "İptal",

  // Help Center
  help_title: "Yardım Merkezi",
  help_subtitle: "Hatırlatıcı'yı nasıl kullanacağınızı öğrenin",
  help_gettingStarted: "Başlarken",
  help_gettingStartedContent:
    "Hatırlatıcı'ya hoş geldiniz! Bu uygulama, görevlerinizi planlayarak ve düzenli molalar hatırlatarak üretken kalmanıza yardımcı olur.\n\nKenar çubuğundaki \"Yeni Görev\" düğmesini kullanarak ilk görevinizi oluşturun. Bir başlık, tarih, saat ve isteğe bağlı olarak tekrar planı belirleyin.\n\nUygulama sistem tepsisi aracılığıyla arka planda çalışır, bu nedenle pencereyi kapatsanız bile hatırlatıcılarınız çalışmaya devam eder.",
  help_creatingTasks: "Görev Oluşturma",
  help_creatingTasksContent:
    "Kenar çubuğunda \"Yeni Görev\"e tıklayın veya görev listesinin üstündeki Görev Ekle düğmesini kullanın.\n\nHer görevin bir başlığı (zorunlu), isteğe bağlı açıklaması, tarihi, saati ve tekrar modu vardır. Tekrar modları: Bir kez, Günlük, Hafta içi (Pzt-Cum) ve Haftalık.\n\nGörevler Yaklaşan görünümünde Bugün, Yarın, Yaklaşan ve Geçmiş olarak gruplandırılır.",
  help_notifications: "Bildirimler",
  help_notificationsContent:
    "Bir görevin planlanan saati geldiğinde, yerel macOS bildirimi, uygulama içi açılır pencere ve isteğe bağlı ses uyarısı alırsınız.\n\nHatırlatıcı açılır penceresinden görevi Başlatabilir (tamamlandı olarak işaretler), Kapatabilir veya 10 dakika Erteleyebilirsiniz.\n\nBildirim seslerini Ayarlar'dan açıp kapatabilirsiniz.",
  help_breakReminders: "Mola Hatırlatıcıları",
  help_breakRemindersContent:
    "Hatırlatıcı, sağlığınız için düzenli molalar vermenizi teşvik eder. Varsayılan olarak, her 30 dakikada bir mola hatırlatıcısı görünür.\n\nMola tetiklendiğinde, su içme, esneme ve yürüyüş gibi öneriler içeren tam ekran bir kaplama görürsünüz.\n\nMola aralığını (15-60 dk) ve mola süresini (1-10 dk) Ayarlar'dan yapılandırabilirsiniz. Molalar sistem tepsisi menüsünden duraklatılabilir.",
  help_floatingWidget: "Kayan Widget",
  help_floatingWidgetContent:
    "Kayan widget, geçerli saati, bir sonraki görevinizi ve bir sonraki molanıza olan geri sayımı gösteren küçük, her zaman üstte kalan bir penceredir.\n\nAyarlar'dan veya sistem tepsisi menüsünden etkinleştirin. Ekranınızda herhangi bir yere, ikinci monitör dahil, sürükleyebilirsiniz.",
  help_systemTray: "Sistem Tepsisi",
  help_systemTrayContent:
    "Ana pencereyi kapattığınızda, Hatırlatıcı menü çubuğundaki sistem tepsisi simgesi aracılığıyla arka planda çalışmaya devam eder.\n\nTepsi simgesine tıklayarak hızlı eylemlere erişin: Uygulamayı açma, Görev ekleme, Mola hatırlatıcılarını duraklatma/devam ettirme, Kayan widget'ı açma/kapama veya tamamen çıkma.",
  help_faq: "Sık Sorulan Sorular",
  help_faqContent:
    "S: Uygulamayı tamamen nasıl kapatırım?\nC: Menü çubuğundaki tepsi simgesine sağ tıklayın ve \"Quit Reminder\"ı seçin.\n\nS: Bildirim sesini değiştirebilir miyim?\nC: Ayarlar'dan sesi açıp kapatabilirsiniz. Uygulama dahili bir zil sesi kullanır.\n\nS: Verilerim nerede saklanıyor?\nC: Tüm veriler uygulama veri klasörünüzdeki yerel SQLite veritabanında saklanır. Hiçbir şey buluta gönderilmez.\n\nS: Dili nasıl değiştiririm?\nC: Ayarlar'a gidin ve Dil bölümünden tercih ettiğiniz dili seçin.",
};
