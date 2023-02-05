import {Injectable} from "@nestjs/common";
import TelegramBot from "node-telegram-bot-api";
import {BotService} from "../bot/bot.service";
import {Types} from "mongoose";

@Injectable()
export class NotificationsService {
  constructor(
    private botService: BotService
  ) {}

  async notifyAboutIncomingFriendRequest(chatId: TelegramBot.ChatId, request_id: Types.ObjectId, from_username: string) {
    await this.botService.sendMessage(chatId, `@${from_username} wants to add you as a friend to send you memes`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Decline', callback_data: `request_decline_${request_id}` },
            { text: 'Accept', callback_data: `request_accept_${request_id}`}
          ],
        ]
      }
    })
  }
}
