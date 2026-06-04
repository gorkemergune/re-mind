import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { Task, TaskFormData } from "../types/task";
import * as commands from "../lib/commands";
import { fireCelebration } from "../lib/confetti";

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  fetchTasks: () => Promise<void>;
  addTask: (data: TaskFormData) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  showAddForm: false,

  setShowAddForm: (show) => set({ showAddForm: show }),

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const tasks = await commands.getTasks();
      set({ tasks });
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      set({ loading: false });
    }
  },

  addTask: async (data) => {
    const task: Task = {
      id: uuidv4(),
      title: data.title,
      description: data.description || null,
      date: data.date,
      time: data.time,
      repeat_mode: data.repeat_mode,
      completed: false,
      created_at: new Date().toISOString(),
    };
    try {
      await commands.createTask(task);
      await get().fetchTasks();
    } catch (err) {
      console.error("Failed to add task:", err);
      throw err;
    }
  },

  removeTask: async (id) => {
    try {
      await commands.deleteTask(id);
      set({ tasks: get().tasks.filter((t) => t.id !== id) });
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  },

  toggleTask: async (id) => {
    try {
      const task = get().tasks.find((t) => t.id === id);
      const willComplete = task && !task.completed;
      await commands.toggleTask(id);
      set({
        tasks: get().tasks.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ),
      });
      if (willComplete) fireCelebration();
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  },

  updateTask: async (task) => {
    try {
      await commands.updateTask(task);
      await get().fetchTasks();
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  },
}));
