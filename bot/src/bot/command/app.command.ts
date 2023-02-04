import {Command} from "./command";
import TelegramBot from "node-telegram-bot-api";
import {Injectable} from "@nestjs/common";
import {BotService} from "../bot.service";
import {ConfigService} from "@nestjs/config";
import {MetaMessage} from "../bot.types";

@Injectable()
export class AppCommand extends Command {
  name = '/app';

  constructor(private botService: BotService, private configService: ConfigService) {
    super()
  }

  async handle(msg: MetaMessage): Promise<void> {
    const chatId = msg.chat.id;
    const url = this.configService.get<string>("WEB_APP_URL")
    if(!url) {
      await this.botService.sendMessage(chatId, `Our app is shut down =(`)
      return;
    }

    const text = `Click on the link below`
    const message = await this.botService.sendMessage(chatId, text, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Open app', web_app: { url } }]
        ]
      }
    })
  }
}