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
      await this.sendSuccessAcceptMessage(callbackQuery.id)
    }
    return Promise.resolve(undefined);
  }

  // TODO: Add username
  async sendSuccessAcceptMessage(callback_query_id: TelegramBot.CallbackQuery["id"]) {
    await this.botService.answerCallbackQuery({
      callback_query_id,
      text: `You added #USERNAME# to your friend list!`
    })
  }
}