import {Callback} from "./callback";
import TelegramBot from "node-telegram-bot-api";
import {Injectable} from "@nestjs/common";
import {FriendRequestService} from "../../friend-request/friend-request.service";
import {BotService} from "../bot.service";
import {FriendRequestData, QueryService} from "../query/query.service";
import {CallbackList} from "./callback-list.enum";

@Injectable()
export class RequestCallback extends Callback {
  name = CallbackList.REQUEST;

  constructor(private friendRequestService: FriendRequestService, private botService: BotService, private queryService: QueryService) {
    super();
  }

  // TODO: Notify friend request sender
  async handle(callbackQuery: TelegramBot.CallbackQuery): Promise<void> {
    if(!callbackQuery.data)
      return;

    const data = await this.queryService.parseData<FriendRequestData>(callbackQuery.data)

    if(!data)
      return;

    const action = data.action;
    const requestId = data.friend_request;

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