import {Injectable} from "@nestjs/common";
import {Callback} from "./callback";
import TelegramBot from "node-telegram-bot-api";
import {BotService} from "../bot.service";
import {UserService} from "../../user/user.service";

@Injectable()
export class DeleteCallback extends Callback {
  name = 'delete'

  constructor(private botService: BotService, private userService: UserService) {
    super();
  }

  async handle(query: TelegramBot.CallbackQuery): Promise<void> {
    if(!query.data)
      return;

    const data = query.data.substring(this.name.length+1).split('_');
    const action = data[0]
    console.log(data)
    if(!action)
      return;

    if(action === 'request') {
      const username = data[1]
      const userId = data[2]
      return this.sendConfirmMessage(query.from.id, userId, username)
    }
    if(action === 'confirm') {
      const friendId = data[1]
      const user = await this.userService.getUserByChatId(query.from.id)
      await this.userService.deleteFriend(user, friendId)
      if(query.message)
        await this.botService.deleteMessage(query.from.id, query.message.message_id.toString())

      await this.botService.sendMessage(query.from.id, `Too bad, I hope you two will make up`)
    }
    if(action === 'decline') {
      if(query.message)
        await this.botService.deleteMessage(query.from.id, query.message.message_id.toString())

      await this.botService.sendMessage(query.from.id, `Cool, I'm glad you guys are still friends`)
    }
  }

  async sendConfirmMessage(chatId: TelegramBot.ChatId, userId: string, username: string) {
    await this.botService.sendMessage(chatId, `Are you sure you want to delete @${username} from your friend list?`, {
      reply_markup: {
        inline_keyboard: [
          [{text: 'No', callback_data: 'delete_decline'}, {text: `Delete`, callback_data: `delete_confirm_${userId}`}]
        ]
      }
    })
  }
}