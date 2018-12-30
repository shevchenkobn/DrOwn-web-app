export type Maybe<T> = T | null | undefined;

export interface IDialogData {
  message: string;
  messageParams?: { [param: string]: string };
}
