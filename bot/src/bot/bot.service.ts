import {Injectable, Scope} from '@nestjs/common';
import * as TelegramBot from "node-telegram-bot-api";

type Listener = (message: TelegramBot.Message, metadata: TelegramBot.Metadata) => void

@Injectable()
export class BotService {
  private bot: TelegramBot = null as unknown as TelegramBot; // Hack to tell TS that bot always initialized

  initBot(bot: TelegramBot) {
    if (this.bot)
      return;

    this.bot = bot;
  }

  addMessageListener(callback: Listener) {
    this.bot.on('message', (message, metadata) => {
      callback(message, metadata)
    })
  }

  async sendMessage(
      chatId: TelegramBot.ChatId,
      text: string,
      options?: TelegramBot.SendMessageOptions,
  ): Promise<TelegramBot.Message> {
    return this.bot.sendMessage(chatId, text, options)
  }
}
