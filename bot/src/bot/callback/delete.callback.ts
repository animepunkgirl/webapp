import {Injectable} from "@nestjs/common";
import {Callback} from "./callback";
import TelegramBot from "node-telegram-bot-api";
import {BotService} from "../bot.service";
import {UserService} from "../../user/user.service";
import {NotifierService} from "../notifier/notifier.service";

@Injectable()
export class DeleteCallback extends Callback {
  name = 'delete'

  constructor(
    private botService: BotService,
    private userService: UserService,
    private notifierService: NotifierService
  ) {
    super();
  }

  async handle(query: TelegramBot.CallbackQuery): Promise<void> {
    if(!query.data)
      return;

    const data = query.data.substring(this.name.length+1).split('_');
    const action = data[0]
    if(!action)
      return;

    await this.botService.answerCallbackQuery({
      callback_query_id: query.id,
    })

    if(action === 'request') {
      const username = data[1]
      const userId = data[2]
      return this.sendConfirmMessage(query, userId, username)
    }
    if(action === 'confirm') {
      const friendId = data[1]
      await this.confirmRequest(query, friendId)
    }
    if(action === 'decline') {
      await this.declineRequest(query)
    }
  }

  private async sendConfirmMessage(query: TelegramBot.CallbackQuery, userId: string, username: string) {
    if(query.message) {
      await this.botService.deleteMessage(query.from.id, query.message.message_id.toString())
    }
    await this.botService.sendMessage(query.from.id, `Are you sure you want to delete @${username} from your friend list?`, {
      reply_markup: {
        inline_keyboard: [
          [{text: 'No', callback_data: 'delete_decline'}, {text: `Delete`, callback_data: `delete_confirm_${userId}`}]
        ]
      }
    })
  }

  private async confirmRequest(query: TelegramBot.CallbackQuery, friendId: string) {
    const user = await this.userService.getUserByChatId(query.from.id)
    await this.userService.deleteFriend(user, friendId)

    if(query.message)
      await this.botService.deleteMessage(query.from.id, query.message.message_id.toString())

    await this.botService.sendMessage(query.from.id, `Too bad, I hope you two will make up`)

    await this.notifierService.deletedFromFriendList(friendId, query.from.username!)
  }

  private async declineRequest(query: TelegramBot.CallbackQuery) {
    if(query.message)
      await this.botService.deleteMessage(query.from.id, query.message.message_id.toString())

    await this.botService.sendMessage(query.from.id, `Cool, I'm glad you guys are still friends`)
  }
}