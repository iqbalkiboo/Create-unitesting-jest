/**
 * Component test dengan React Testing Library.
 * Menguji interaksi UI: form, checkbox, tombol hapus, dan statistik.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import TaskStats from "@/components/TaskStats";
import { createTaskStore } from "@/store/useTaskStore";
import { Priority } from "@/core/entities/Task";

/**
 * Komponen membaca store via `useTaskStore`.
 * Untuk test, kita render komponen dengan store terisolasi:
 * cara termudah adalah me-mock module store-nya.
 */
jest.mock("@/store/useTaskStore", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const actual = jest.requireActual<typeof import("@/store/useTaskStore")>(
    "@/store/useTaskStore",
  );
  return { ...actual, useTaskStore: actual.createTaskStore() };
});

import { useTaskStore } from "@/store/useTaskStore";

beforeEach(() => {
  // Reset state store antar test
  const store = useTaskStore as ReturnType<typeof createTaskStore>;
  store.getState().tasks.forEach(() => undefined);
  useTaskStore.setState({ tasks: [], stats: { total: 0, done: 0, active: 0, completionRate: 0 } });
});

describe("TaskForm", () => {
  it("menambah task ketika form disubmit", async () => {
    const user = userEvent.setup();
    render(<TaskForm />);

    await user.type(screen.getByLabelText(/input-task/i), "Task dari UI");
    await user.click(screen.getByRole("button", { name: /tambah/i }));

    const state = (useTaskStore as unknown as ReturnType<typeof createTaskStore>).getState();
    expect(state.tasks[0]?.title).toBe("Task dari UI");
    expect(screen.getByLabelText(/input-task/i)).toHaveValue("");
  });

  it("tidak menambah task jika input kosong", async () => {
    const user = userEvent.setup();
    render(<TaskForm />);

    await user.click(screen.getByRole("button", { name: /tambah/i }));

    const state = (useTaskStore as unknown as ReturnType<typeof createTaskStore>).getState();
    expect(state.tasks).toHaveLength(0);
  });
});

describe("TaskList", () => {
  it("menampilkan pesan kosong saat belum ada task", () => {
    render(<TaskList />);
    expect(screen.getByText(/belum ada task/i)).toBeInTheDocument();
  });

  it("menampilkan task, toggle checkbox, dan hapus", async () => {
    const user = userEvent.setup();
    const store = useTaskStore as unknown as ReturnType<typeof createTaskStore>;
    useTaskStore.setState({
      tasks: [
        { id: "task-1", title: "Kerjakan PR", status: "active", priority: Priority.High },
      ],
      stats: { total: 1, done: 0, active: 1, completionRate: 0 },
    });

    render(<TaskList />);

    expect(screen.getByText("Kerjakan PR")).toBeInTheDocument();

    // Toggle selesai -> title jadi strikethrough (class line-through)
    await user.click(screen.getByLabelText(/toggle-task-1/i));
    expect(store.getState().tasks[0].status).toBe("done");

    // Hapus task
    await user.click(screen.getByLabelText(/delete-task-1/i));
    expect(store.getState().tasks).toHaveLength(0);
  });
});

describe("TaskStats", () => {
  it("menampilkan statistik dari store", () => {
    useTaskStore.setState({
      tasks: [],
      stats: { total: 4, done: 1, active: 3, completionRate: 0.25 },
    });

    render(<TaskStats />);

    expect(screen.getByTestId("stat-total")).toHaveTextContent("4");
    expect(screen.getByTestId("stat-done")).toHaveTextContent("1");
    expect(screen.getByTestId("stat-active")).toHaveTextContent("3");
    expect(screen.getByTestId("stat-rate")).toHaveTextContent("25%");
  });
});
