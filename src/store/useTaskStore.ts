/**
 * Zustand Store
 * -------------
 * Store global yang memakai TaskService di dalamnya.
 * State store hanya menyimpan data sederhana (serializable),
 * sedangkan logika bisnis didelegasikan ke class (OOP core).
 */

import { create } from "zustand";
import { Priority } from "@/core/entities/Task";
import { TaskService, type TaskStats } from "@/core/services/TaskService";

interface TaskState {
  tasks: {
    id: string;
    title: string;
    status: "active" | "done";
    priority?: Priority;
  }[];
  stats: TaskStats;
  addTask: (title: string, priority?: Priority) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  clearDone: () => void;
  reset: () => void;
}

/** Factory supaya mudah reset di test */
export function createTaskStore() {
  const service = new TaskService();
  return create<TaskState>((set) => ({
    tasks: [],
    stats: service.getStats(),

    addTask: (title, priority) => {
      service.addTask(title, priority);
      set({ tasks: [...service.getAll()], stats: service.getStats() });
    },

    toggleTask: (id) => {
      service.toggleTask(id);
      set({ tasks: [...service.getAll()], stats: service.getStats() });
    },

    removeTask: (id) => {
      service.removeTask(id);
      set({ tasks: [...service.getAll()], stats: service.getStats() });
    },

    clearDone: () => {
      service.clearDone();
      set({ tasks: [...service.getAll()], stats: service.getStats() });
    },

    reset: () => {
      set({ tasks: [...service.getAll()], stats: service.getStats() });
    },
  }));
}

export const useTaskStore = createTaskStore();
