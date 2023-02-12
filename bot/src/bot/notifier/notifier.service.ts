import {Injectable} from "@nestjs/common";
import TelegramBot from "node-telegram-bot-api";
import {BotService} from "../bot.service";
import {Types} from "mongoose";

@Injectable()
export class NotifierService {
  constructor(
    private botService: BotService
  ) {}

  async incomingFriendRequest(chatId: TelegramBot.ChatId, from_username: string, request_id: Types.ObjectId,) {
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

  async deletedFromFriendList(chatId: TelegramBot.ChatId, friendUsername: string) {
   await this.botService.sendMessage(chatId, `@${friendUsername} removed you from his list of friends. I don't know what happened between you two, but I hope you make up :(`)
  }
}
