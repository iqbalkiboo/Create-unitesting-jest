import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import TaskStats from "@/components/TaskStats";

export default function Home() {
  return (
    <main className="page-wrapper">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-badge">
            <span className="dot" />
            Next.js · Zustand · Jest · OOP
          </div>
          <h1>Task Manager</h1>
          <p>
            Kelola tugas harianmu dengan cerdas. Prioritaskan, pantau progress,
            dan selesaikan lebih banyak.
          </p>
        </header>

        {/* Form */}
        <TaskForm />

        {/* Stats */}
        <TaskStats />

        {/* List */}
        <TaskList />

        {/* Footer */}
        <footer className="footer">
          <span>Next.js 15</span>
          <span className="footer-dot" />
          <span>Zustand</span>
          <span className="footer-dot" />
          <span>TypeScript</span>
          <span className="footer-dot" />
          <span>Jest</span>
        </footer>
      </div>
    </main>
  );
}
