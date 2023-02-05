import {MetaMessage} from "../bot.types";

export abstract class Command {
    protected constructor() {
    }

    abstract name: string;

    public abstract handle(msg: MetaMessage): Promise<void>;

    public isMatching(msg: MetaMessage): boolean {
        return this.name === msg.text;
    }
}