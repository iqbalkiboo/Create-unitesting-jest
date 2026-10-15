/**
 * Unit test untuk layer Entity (class Task & PriorityTask)
 * Menguji: encapsulation, inheritance, polymorphism, validation.
 */

import { Priority, PriorityTask, Task } from "@/core/entities/Task";

describe("Task (base class)", () => {
  it("membuat task dengan status awal 'active'", () => {
    const task = new Task("1", "Belajar Jest");

    expect(task.id).toBe("1");
    expect(task.title).toBe("Belajar Jest");
    expect(task.status).toBe("active");
    expect(task.isDone).toBe(false);
  });

  it("toggle mengubah status active -> done", () => {
    const task = new Task("1", "Belajar Jest");

    expect(task.toggle()).toBe("done");
    expect(task.isDone).toBe(true);
  });

  it("toggle dua kali kembali ke active", () => {
    const task = new Task("1", "Belajar Jest");

    task.toggle();
    task.toggle();

    expect(task.status).toBe("active");
  });

  it("menolak title kosong (validation / encapsulation)", () => {
    expect(() => new Task("1", "")).toThrow("Title tidak boleh kosong");
    expect(() => new Task("1", "   ")).toThrow();
  });

  it("getDetails mengembalikan title saja", () => {
    const task = new Task("1", "Belajar Jest");
    expect(task.getDetails()).toBe("Belajar Jest");
  });
});

describe("PriorityTask (inheritance)", () => {
  it("instance dari Task dan PriorityTask (extends)", () => {
    const task = new PriorityTask("1", "Kerjakan PR", Priority.High);

    expect(task).toBeInstanceOf(PriorityTask);
    expect(task).toBeInstanceOf(Task);
  });

  it("weight sesuai prioritas", () => {
    expect(new PriorityTask("1", "a", Priority.High).weight).toBe(3);
    expect(new PriorityTask("2", "b", Priority.Medium).weight).toBe(2);
    expect(new PriorityTask("3", "c", Priority.Low).weight).toBe(1);
  });

  it("default prioritas adalah Medium", () => {
    const task = new PriorityTask("1", "Kerjakan PR");
    expect(task.priority).toBe(Priority.Medium);
  });
});

describe("Polymorphism (method overriding)", () => {
  it("getDetails() berperilaku beda antara Task dan PriorityTask", () => {
    const base: Task = new Task("1", "Review kode");
    const derived: Task = new PriorityTask("2", "Review kode", Priority.High);

    // Keduanya bertipe Task, tapi hasilnya berbeda -> polymorphism
    expect(base.getDetails()).toBe("Review kode");
    expect(derived.getDetails()).toBe("[ ] [HIGH] Review kode");
  });

  it("getDetails menampilkan [x] setelah done", () => {
    const task = new PriorityTask("1", "Review kode", Priority.High);
    task.toggle();

    expect(task.getDetails()).toBe("[x] [HIGH] Review kode");
  });
});
