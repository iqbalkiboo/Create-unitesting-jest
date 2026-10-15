/**
 * Layer Entity (OOP core)
 * -----------------------
 * Berisi class murni (pure TypeScript) tanpa React/Next.
 * Semua logika bisnis ada di sini supaya mudah di-unit-test dengan Jest.
 */

export type TaskStatus = "active" | "done";

/** Interface kontrak — contoh abstraction */
export interface ITask {
  readonly id: string;
  readonly title: string;
  readonly status: TaskStatus;
  readonly isDone: boolean;
  readonly createdAt: Date;
  toggle(): TaskStatus;
  getDetails(): string;
}

/** Enum untuk prioritas */
export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

/**
 * Base class — contoh encapsulation.
 * Field `status` dibuat private dan hanya bisa diakses lewat method/getter.
 */
export class Task implements ITask {
  private _status: TaskStatus = "active";

  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly createdAt: Date = new Date(),
  ) {
    if (!title.trim()) {
      throw new Error("Title tidak boleh kosong");
    }
  }

  get status(): TaskStatus {
    return this._status;
  }

  get isDone(): boolean {
    return this._status === "done";
  }

  /** Toggle status active <-> done */
  toggle(): TaskStatus {
    this._status = this._status === "active" ? "done" : "active";
    return this._status;
  }

  /** Polymorphism: method ini akan di-override subclass */
  getDetails(): string {
    return this.title;
  }
}

/**
 * Subclass — contoh inheritance.
 * PriorityTask mewarisi Task, menambah properti `priority`
 * dan meng-override getDetails() (polymorphism / overriding).
 */
export class PriorityTask extends Task {
  constructor(
    id: string,
    title: string,
    public readonly priority: Priority = Priority.Medium,
    createdAt: Date = new Date(),
  ) {
    super(id, title, createdAt);
  }

  /** Bobot prioritas, dipakai untuk sorting di service */
  get weight(): number {
    switch (this.priority) {
      case Priority.High:
        return 3;
      case Priority.Medium:
        return 2;
      case Priority.Low:
        return 1;
    }
  }

  override getDetails(): string {
    const label = this.priority.toUpperCase();
    return this.isDone ? `[x] [${label}] ${this.title}` : `[ ] [${label}] ${this.title}`;
  }
}
