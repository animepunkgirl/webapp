import {Injectable} from "@nestjs/common";
import TelegramBot from "node-telegram-bot-api";
import {BotService} from "../bot.service";
import {Types} from "mongoose";
import {FriendRequestData, QueryService} from "../query/query.service";
import {CallbackList} from "../callback/callback-list.enum";
@Injectable()
export class NotifierService {
  constructor(
    private botService: BotService,
    private queryService: QueryService,
  ) {}

  async incomingFriendRequest(chatId: TelegramBot.ChatId, from_username: string, request_id: Types.ObjectId) {
    const decline_key = await this.queryService.setQuery<FriendRequestData>(chatId, CallbackList.REQUEST, { action: 'decline', friend_request: request_id.toString() })
    const accept_key = await this.queryService.setQuery<FriendRequestData>(chatId, CallbackList.REQUEST, { action: 'accept', friend_request: request_id.toString() })
    await this.botService.sendMessage(chatId, `@${from_username} wants to add you as a friend to send you memes`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Decline', callback_data: decline_key },
            { text: 'Accept', callback_data: accept_key }
          ],
        ]
      }
    })
  }

  async deletedFromFriendList(chatId: TelegramBot.ChatId, friendUsername: string) {
   await this.botService.sendMessage(chatId, `@${friendUsername} removed you from his list of friends. I don't know what happened between you two, but I hope you make up :(`)
  }
}
