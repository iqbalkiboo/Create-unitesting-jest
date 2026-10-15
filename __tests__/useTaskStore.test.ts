/**
 * Unit test untuk Zustand store.
 * Zustand bisa dites tanpa render React lewat getState()/setState().
 */

import { Priority } from "@/core/entities/Task";
import { createTaskStore } from "@/store/useTaskStore";

describe("useTaskStore (zustand)", () => {
  /** Setiap test pakai store baru supaya tidak saling mempengaruhi */
  const makeStore = () => createTaskStore();

  it("state awal kosong", () => {
    const store = makeStore();

    expect(store.getState().tasks).toEqual([]);
    expect(store.getState().stats).toEqual({
      total: 0,
      done: 0,
      active: 0,
      completionRate: 0,
    });
  });

  it("addTask menambah task dan memperbarui stats", () => {
    const store = makeStore();

    store.getState().addTask("Belajar Zustand", Priority.High);

    const { tasks, stats } = store.getState();
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({
      title: "Belajar Zustand",
      status: "active",
      priority: Priority.High,
    });
    expect(stats.total).toBe(1);
    expect(stats.active).toBe(1);
  });

  it("toggleTask mengubah status dan stats", () => {
    const store = makeStore();
    store.getState().addTask("A");

    store.getState().toggleTask(store.getState().tasks[0].id);

    const { tasks, stats } = store.getState();
    expect(tasks[0].status).toBe("done");
    expect(stats.done).toBe(1);
    expect(stats.active).toBe(0);
    expect(stats.completionRate).toBe(1);
  });

  it("removeTask menghapus task", () => {
    const store = makeStore();
    store.getState().addTask("A");
    const id = store.getState().tasks[0].id;

    store.getState().removeTask(id);

    expect(store.getState().tasks).toHaveLength(0);
  });

  it("clearDone menghapus task yang selesai saja", () => {
    const store = makeStore();
    store.getState().addTask("A");
    store.getState().addTask("B");
    // Task terbaru ada di depan array, jadi "B" ada di indeks 0
    store.getState().toggleTask(store.getState().tasks[0].id);

    store.getState().clearDone();

    const titles = store.getState().tasks.map((t) => t.title);
    expect(titles).toEqual(["A"]);
  });

  it("berlangganan perubahan state (subscribe)", () => {
    const store = makeStore();
    const listener = jest.fn();
    const unsub = store.subscribe(listener);

    store.getState().addTask("A");

    expect(listener).toHaveBeenCalled();
    unsub();
  });
});
