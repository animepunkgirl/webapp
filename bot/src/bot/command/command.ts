import TelegramBot from "node-telegram-bot-api";
import {MetaMessage} from "../bot.types";

export abstract class Command {
    protected constructor() {
    }

    abstract name: string;

    public abstract handle(msg: MetaMessage): Promise<void>;

    public isMatching(msg: TelegramBot.Message): boolean {
        return this.name === msg.text;
    }
}