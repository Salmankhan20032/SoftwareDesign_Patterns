export interface CartCommand {
  readonly label: string;
  execute(): void;
  undo(): void;
}
