import {Injectable} from "@nestjs/common";
import {Command} from "./command";
import {MetaMessage} from "../bot.types";
import {UserService} from "../../user/user.service";
import {FriendRequestService} from "../../friend-request/friend-request.service";
import TelegramBot from "node-telegram-bot-api";
import {BotService} from "../bot.service";
import {FriendRequest, FriendRequestDocument} from "../../schemas/friend-request.schema";
import {Types} from "mongoose";

// TODO: Show list of incoming friend requests
@Injectable()
export class RequestsCommand extends Command {
  name ='/requests'

  constructor(private userService: UserService, private botService: BotService, private friendRequestService: FriendRequestService) {
    super();
  }
  async handle(msg: MetaMessage): Promise<void> {
    const chatId = msg.chat.id
    const user = await this.userService.getUserByChatId(chatId)
    const requests = await this.friendRequestService.getIncomingRequests(user._id)
    if(!requests || !requests.length)
      return this.sendNoRequestsMessage(chatId)

    await this.showRequests(chatId, requests)
  }

  private async sendNoRequestsMessage(chatId: TelegramBot.ChatId) {
    await this.botService.sendMessage(chatId, 'You have no incoming friend requests')
  }

  private async showRequests(chatId: TelegramBot.ChatId, requests: FriendRequestDocument[]) {
    for await (const request of requests) {
      await this.showRequest(chatId, request)
    }
  }

  private async showRequest(chatId: TelegramBot.ChatId, request: FriendRequestDocument) {
    const fromId = new Types.ObjectId(request.from._id)
    const from = await this.userService.getUserById(new Types.ObjectId(fromId))
    if(!from)
      return;

    await this.botService.sendMessage(chatId, `<i>From:</i> @${from.username}`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Decline', callback_data: `request_decline_${request._id}` },
            { text: 'Accept', callback_data: `request_accept_${request._id}`}
          ],
        ]
      },
      parse_mode: "HTML"
    })
  }
}