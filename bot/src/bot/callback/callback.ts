import {CallbackQuery} from "node-telegram-bot-api";

export abstract class Callback {
  protected constructor() {}

  abstract name: string;

  public abstract handle(query: CallbackQuery): Promise<void>;

  public isMatching(query: CallbackQuery): boolean {
    return !!query.data?.startsWith(`${this.name}_`);
  }
}