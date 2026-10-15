/**
 * Unit test untuk TaskService.
 * Menguji dependency injection (IdGenerator di-mock)
 * dan seluruh operasi CRUD + statistik.
 */

import { Priority } from "@/core/entities/Task";
import { SequentialIdGenerator, TaskService } from "@/core/services/TaskService";

/** Mock IdGenerator dengan jest.fn() — contoh test double */
const makeMockIdGen = () => {
  let i = 0;
  return { next: jest.fn(() => `mock-${++i}`) };
};

describe("TaskService", () => {
  let service: TaskService;

  beforeEach(() => {
    service = new TaskService(makeMockIdGen());
  });

  describe("addTask", () => {
    it("menambah task biasa di posisi paling depan", () => {
      service.addTask("A");
      service.addTask("B");

      const all = service.getAll();
      expect(all).toHaveLength(2);
      expect(all[0].title).toBe("B");
      expect(all[1].title).toBe("A");
    });

    it("memakai IdGenerator yang di-inject", () => {
      service.addTask("A");

      expect(service.findById("mock-1")).toBeDefined();
    });

    it("menambah PriorityTask jika prioritas diberikan", () => {
      const task = service.addTask("Penting", Priority.High);

      expect(task).toMatchObject({ title: "Penting", priority: Priority.High });
    });
  });

  describe("toggleTask", () => {
    it("toggle status task berdasarkan id", () => {
      const task = service.addTask("A");

      service.toggleTask(task.id);

      expect(task.isDone).toBe(true);
    });

    it("mengembalikan undefined jika id tidak ada", () => {
      expect(service.toggleTask("tidak-ada")).toBeUndefined();
    });
  });

  describe("removeTask & clearDone", () => {
    it("menghapus task dan mengembalikan true", () => {
      const task = service.addTask("A");

      expect(service.removeTask(task.id)).toBe(true);
      expect(service.getAll()).toHaveLength(0);
    });

    it("mengembalikan false jika id tidak ditemukan", () => {
      expect(service.removeTask("ghost")).toBe(false);
    });

    it("clearDone hanya menghapus task yang selesai", () => {
      const a = service.addTask("A");
      const b = service.addTask("B");
      a.toggle();

      const removed = service.clearDone();

      expect(removed).toBe(1);
      expect(service.findById(b.id)).toBeDefined();
      expect(service.findById(a.id)).toBeUndefined();
    });
  });

  describe("sortByPriority", () => {
    it("mengurutkan PriorityTask dari prioritas tertinggi", () => {
      service.addTask("Low", Priority.Low);
      service.addTask("High", Priority.High);
      service.addTask("Medium", Priority.Medium);

      const sorted = service.sortByPriority();

      expect(sorted.map((t) => t.title)).toEqual(["High", "Medium", "Low"]);
    });
  });

  describe("getStats", () => {
    it("menghitung statistik dengan benar", () => {
      service.addTask("A");
      service.addTask("B");
      service.addTask("C");

      service.getAll()[2].toggle(); // selesaikan 1 task

      expect(service.getStats()).toEqual({
        total: 3,
        done: 1,
        active: 2,
        completionRate: 1 / 3,
      });
    });

    it("completionRate 0 saat belum ada task", () => {
      expect(service.getStats().completionRate).toBe(0);
    });
  });

  describe("SequentialIdGenerator", () => {
    it("menghasilkan id increment", () => {
      const gen = new SequentialIdGenerator();
      expect(gen.next()).toBe("task-1");
      expect(gen.next()).toBe("task-2");
    });
  });
});
