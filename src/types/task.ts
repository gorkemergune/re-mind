export type RepeatMode = "once" | "daily" | "weekdays" | "weekly";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  repeat_mode: RepeatMode;
  completed: boolean;
  created_at: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  repeat_mode: RepeatMode;
}
