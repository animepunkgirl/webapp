import {Command} from "./command";
import TelegramBot from "node-telegram-bot-api";
import {Injectable} from "@nestjs/common";
import {BotService} from "../bot.service";
import {MetaMessage} from "../bot.types";

@Injectable()
export class IncorrectCommand extends Command {
    name = IncorrectCommand.name;

    constructor(private botService: BotService) {
        super()
    }

    async handle(msg: MetaMessage): Promise<void> {
       await this.botService.sendMessage(msg.chat.id, 'Wrong command, try /help');
    }

    isMatching(msg: TelegramBot.Message): boolean {
        return false;
    }
}