"use client";

import { useState } from "react";
import { Priority } from "@/core/entities/Task";
import { useTaskStore } from "@/store/useTaskStore";

const PRIORITY_ICONS: Record<Priority, string> = {
  [Priority.High]: "🔴",
  [Priority.Medium]: "🟡",
  [Priority.Low]: "🔵",
};

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.Medium);
  const addTask = useTaskStore((s) => s.addTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title.trim(), priority);
    setTitle("");
  };

  return (
    <div className="card">
      <form
        onSubmit={handleSubmit}
        aria-label="form-task"
        className="task-form"
      >
        <div className="form-row">
          <div className="input-wrapper">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tambah task baru..."
              aria-label="input-task"
              className="task-input"
              autoComplete="off"
            />
            <svg
              className="input-icon"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </div>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            aria-label="select-priority"
            className="priority-select"
          >
            <option value={Priority.High}>{PRIORITY_ICONS[Priority.High]} High</option>
            <option value={Priority.Medium}>{PRIORITY_ICONS[Priority.Medium]} Medium</option>
            <option value={Priority.Low}>{PRIORITY_ICONS[Priority.Low]} Low</option>
          </select>

          <button type="submit" className="btn-add">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Tambah
          </button>
        </div>
      </form>
    </div>
  );
}
