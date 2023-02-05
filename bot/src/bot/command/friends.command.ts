import {Command} from "./command";
import {MetaMessage} from "../bot.types";
import {UserService} from "../../user/user.service";
import {Injectable} from "@nestjs/common";
import {BotService} from "../bot.service";
import TelegramBot from "node-telegram-bot-api";

@Injectable()
export class FriendsCommand extends Command {
  name = '/friends'

  constructor(private botService: BotService, private userService: UserService) {
    super();
  }

  async handle(msg: MetaMessage): Promise<void> {
    if(!msg.from)
      return;

    const {friends} = await this.userService.getUserByChatId(msg.chat.id)
    if (!friends || !Array.isArray(friends) || !friends.length)
      return this.sendNoFriendsMessage(msg.chat.id)

    for (const friend of friends) {
      const info = await this.botService.getChat(friend.chat_id)
      await this.botService.sendMessage(msg.chat.id, this.formatUserInfo(info), {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Delete', callback_data: `delete_request_${info.username}_${friend.chat_id}` }]
          ]
        }
      })
    }
  }

  private async sendNoFriendsMessage(chatId: TelegramBot.ChatId) {
   await this.botService.sendMessage(chatId, 'Sorry, but your friend list is empty🥺\nYou can add friends by using /add command!')
  }

  private formatUserInfo(info: TelegramBot.Chat) {
    const formattedUsername = `(@${info.username})`
    return [info.first_name, info.last_name, formattedUsername].filter(item => typeof item !== 'undefined').join(' ')
  }
}