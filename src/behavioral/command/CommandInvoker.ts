import type { CartCommand } from './CartCommand';

export class CommandInvoker {
  private history: CartCommand[] = [];
  private pointer = -1;

  execute(command: CartCommand): void {
    this.history = this.history.slice(0, this.pointer + 1);
    command.execute();
    this.history.push(command);
    this.pointer += 1;
  }

  undo(): boolean {
    if (this.pointer < 0) return false;
    this.history[this.pointer].undo();
    this.pointer -= 1;
    return true;
  }

  canUndo(): boolean {
    return this.pointer >= 0;
  }

  peekUndoLabel(): string | null {
    if (this.pointer < 0) return null;
    return this.history[this.pointer].label;
  }
}
