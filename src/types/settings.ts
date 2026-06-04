export interface AppSettings {
  break_interval: number;
  break_duration: number;
  dark_mode: boolean;
  sound_enabled: boolean;
  widget_visible: boolean;
  language: string;
}

export interface TaskStats {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
}
