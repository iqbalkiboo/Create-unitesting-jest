"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { Priority } from "@/core/entities/Task";

const PRIORITY_LABEL: Record<Priority, string> = {
  [Priority.High]: "High",
  [Priority.Medium]: "Med",
  [Priority.Low]: "Low",
};

export default function TaskList() {
  const tasks = useTaskStore((s) => s.tasks);
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const removeTask = useTaskStore((s) => s.removeTask);

  const totalCount = tasks.length;

  if (tasks.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <p className="empty-title">Belum ada task</p>
          <p className="empty-sub">Tambahkan task pertama kamu di atas!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="task-list-header">
        <div className="task-list-title">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
          </svg>
          Daftar Task
          <span className="task-count-badge">{totalCount}</span>
        </div>
      </div>

      {/* List */}
      <ul className="task-list" role="list">
        {tasks.map((task, index) => {
          const isDone = task.status === "done";
          const priorityClass = task.priority
            ? `priority-${task.priority}`
            : "";

          return (
            <li
              key={task.id}
              data-testid="task-item"
              className={`task-item ${isDone ? "done" : ""} ${priorityClass}`}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {/* Custom Checkbox */}
              <div className="task-checkbox-wrap">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggleTask(task.id)}
                  aria-label={`toggle-${task.id}`}
                  className="task-checkbox"
                />
                <div className="checkbox-visual">
                  <svg width="11" height="11" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Task Content */}
              <div className="task-body">
                <div className="task-title">{task.title}</div>
                <div className="task-meta">
                  {task.priority && (
                    <span className={`priority-badge priority-${task.priority}`}>
                      {PRIORITY_LABEL[task.priority as Priority]}
                    </span>
                  )}
                  <span className="task-id">{task.id}</span>
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => removeTask(task.id)}
                aria-label={`delete-${task.id}`}
                className="btn-delete"
                title="Hapus task"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" strokeLinecap="round" />
                  <path d="M10 11v6M14 11v6" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
