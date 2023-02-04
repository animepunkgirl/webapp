import {Injectable} from '@nestjs/common';
import * as TelegramBot from "node-telegram-bot-api";
import {Stream} from "stream";
import {MessageListener} from "./bot.types";

@Injectable()
export class BotService {
  private bot: TelegramBot = null as unknown as TelegramBot; // Hack to tell TS that bot always initialized

  initBot(bot: TelegramBot) {
    if (this.bot)
      return;

    this.bot = bot;
  }

  addMessageListener(callback: MessageListener) {
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

  async sendPhoto(chatId: TelegramBot.ChatId,
                  photo: string | Stream | Buffer,
                  options?: TelegramBot.SendPhotoOptions,
                  fileOptions?: TelegramBot.FileOptions): Promise<TelegramBot.Message> {
    return this.bot.sendPhoto(chatId, photo, options, fileOptions);
  }

  async sendDocument(
      chatId: TelegramBot.ChatId,
      doc: string | Stream | Buffer,
      options?: TelegramBot.SendDocumentOptions,
      fileOptions?: TelegramBot.FileOptions,
  ): Promise<TelegramBot.Message> {
    return this.bot.sendDocument(chatId, doc, options, fileOptions);
  }

  async sendMediaGroup(
      chatId: TelegramBot.ChatId,
      media: ReadonlyArray<TelegramBot.InputMedia>,
      options?: TelegramBot.SendMediaGroupOptions,
  ): Promise<TelegramBot.Message> {
    return await this.bot.sendMediaGroup(chatId, media, options);
  }
}
