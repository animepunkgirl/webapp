import {Callback} from "./callback";
import TelegramBot from "node-telegram-bot-api";
import {Injectable} from "@nestjs/common";
import {FriendRequestService} from "../../friend-requests/friend-request.service";
import {BotService} from "../bot.service";

@Injectable()
export class RequestCallback extends Callback {
  name = 'request'

  constructor(private friendRequestService: FriendRequestService, private botService: BotService) {
    super();
  }

  // TODO: Notify friend request sender
  async handle(callbackQuery: TelegramBot.CallbackQuery): Promise<void> {
    if(!callbackQuery.data)
      return;

    const data = callbackQuery.data.substring(this.name.length+1).split('_');
    const action = data[0]
    const requestId = data[1]
    if(!action || !requestId)
      return;

    if(action === 'accept') {
      await this.friendRequestService.accept(requestId)
      await this.sendAcceptedAnswer(callbackQuery.id)
    }
    if(action === 'decline') {
      await this.friendRequestService.decline(requestId)
      await this.sendDeclinedAnswer(callbackQuery.id)
    }
    if(callbackQuery.message) {
      await this.botService.deleteMessage(callbackQuery.from.id, callbackQuery.message.message_id.toString())
    }
  }

  // TODO: Add username
  async sendAcceptedAnswer(callback_query_id: TelegramBot.CallbackQuery["id"]) {
    await this.botService.answerCallbackQuery({
      callback_query_id,
      text: `You added #USERNAME# to your friend list!🥰`
    })
  }

  // TODO: Add username
  async sendDeclinedAnswer(callback_query_id: TelegramBot.CallbackQuery["id"]) {
    await this.botService.answerCallbackQuery({
      callback_query_id,
      text: `You declined #USERNAME#'s request😔`
    })
  }
}