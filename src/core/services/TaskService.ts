/**
 * Layer Service (OOP core)
 * ------------------------
 * Class yang mengelola kumpulan Task.
 * Menerima dependency via constructor (dependency injection)
 * supaya mudah di-mock saat unit test.
 */

import { Priority, PriorityTask, Task, type ITask } from "../entities/Task";

/** Dependency yang bisa di-inject & di-mock */
export interface IdGenerator {
  next(): string;
}

/** Implementasi default: increment sederhana */
export class SequentialIdGenerator implements IdGenerator {
  private counter = 0;
  next(): string {
    this.counter += 1;
    return `task-${this.counter}`;
  }
}

export interface TaskStats {
  total: number;
  done: number;
  active: number;
  completionRate: number; // 0..1
}

export class TaskService {
  private tasks: ITask[] = [];

  constructor(private readonly idGen: IdGenerator = new SequentialIdGenerator()) { }

  /** Menambah task biasa atau priority task */
  addTask(title: string, priority?: Priority): ITask {
    const task =
      priority !== undefined
        ? new PriorityTask(this.idGen.next(), title, priority)
        : new Task(this.idGen.next(), title);
    this.tasks = [task, ...this.tasks];
    return task;
  }

  getAll(): readonly ITask[] {
    return this.tasks;
  }

  findById(id: string): ITask | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  toggleTask(id: string): ITask | undefined {
    const task = this.findById(id);
    task?.toggle();
    return task;
  }

  removeTask(id: string): boolean {
    const before = this.tasks.length;
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return this.tasks.length < before;
  }

  clearDone(): number {
    const before = this.tasks.length;
    this.tasks = this.tasks.filter((t) => !t.isDone);
    return before - this.tasks.length;
  }

  /** Mengurutkan berdasarkan bobot prioritas (tertinggi dulu) */
  sortByPriority(): readonly ITask[] {
    return [...this.tasks]
      .filter((t): t is PriorityTask => t instanceof PriorityTask)
      .sort((a, b) => b.weight - a.weight);
  }

  getStats(): TaskStats {
    const total = this.tasks.length;
    const done = this.tasks.filter((t) => t.isDone).length;
    return {
      total,
      done,
      active: total - done,
      completionRate: total === 0 ? 0 : done / total,
    };
  }
}
