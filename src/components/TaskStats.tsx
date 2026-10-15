"use client";

import { useTaskStore } from "@/store/useTaskStore";

export default function TaskStats() {
  const stats = useTaskStore((s) => s.stats);
  const clearDone = useTaskStore((s) => s.clearDone);

  const percent = Math.round(stats.completionRate * 100);

  const statItems = [
    {
      key: "total",
      label: "Total",
      value: stats.total,
      icon: "📋",
      cls: "stat-total",
      testId: "stat-total",
    },
    {
      key: "done",
      label: "Selesai",
      value: stats.done,
      icon: "✅",
      cls: "stat-done",
      testId: "stat-done",
    },
    {
      key: "active",
      label: "Aktif",
      value: stats.active,
      icon: "⚡",
      cls: "stat-active",
      testId: "stat-active",
    },
    {
      key: "rate",
      label: "Selesai",
      value: `${percent}%`,
      icon: "📈",
      cls: "stat-rate",
      testId: "stat-rate",
    },
  ];

  return (
    <div>
      {/* Stat Cards */}
      <div className="stats-grid">
        {statItems.map((item) => (
          <div key={item.key} className={`stat-card ${item.cls}`}>
            <div className="stat-icon">{item.icon}</div>
            <div className="stat-value" data-testid={item.testId}>
              {item.value}
            </div>
            <div className="stat-label">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="progress-wrap">
        <span className="progress-label">Progress</span>
        <div className="progress-bar-outer">
          <div
            className="progress-bar-inner"
            style={{ width: `${percent}%` }}
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <span className="progress-pct" data-testid="stat-rate-bar">
          {percent}%
        </span>

        <button
          onClick={clearDone}
          className="btn-clear"
          aria-label="Bersihkan task selesai"
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
          Bersihkan
        </button>
      </div>
    </div>
  );
}
