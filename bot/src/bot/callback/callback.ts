import {CallbackQuery} from "node-telegram-bot-api";
import {Handler} from "../query/query.service";

export abstract class Callback {
  abstract name: string;

  public abstract handle(query: CallbackQuery): Promise<void>;

  public isMatching(handler: Handler): boolean {
    return handler === this.name;
  }
}