import {Command} from "./command";
import {Injectable} from "@nestjs/common";
import {BotService} from "../bot.service";
import {MetaMessage} from "../bot.types";
import {UserService} from "../../user/user.service";
import TelegramBot from "node-telegram-bot-api";

@Injectable()
export class AddCommand extends Command {
  name = '/add';

  constructor(private botService: BotService, private userService: UserService) {
    super()
  }

  async handle(msg: MetaMessage): Promise<void> {
    if(!msg.text)
      return;

    console.log(msg)

    const chatId = msg.chat.id;
    const username = this.parseUsername(msg.text)
    if(username) {
      const user = await this.userService.getUserByUsername(username)
      if(!user) {
        return await this.sendUserNotFoundMessage(chatId)
      }
      const friendRequest = false;// TODO: Send friend request
      if(friendRequest) {
      }
      return await this.sendFriendRequestMadeMessage(chatId, username)
    }
    await this.botService.sendMessage(chatId, 'App command')
  }

  parseUsername(text: MetaMessage["text"]): string | null {
    if(!text)
      return null

    const username = text.split(' ')[1]
    if(!username)
      return null;

    if(username.startsWith('@'))
      return username.substring(1);

    if(username.startsWith('http://') || username.startsWith('https://'))
      return username.split('/')[3] ?? null;

    return username;
  }

  async sendFriendRequestMadeMessage(chatId: TelegramBot.ChatId, username: string) {
    await this.botService.sendMessage(chatId, `We sent a friend request to @${username}. We'll notify you when he adds you!`)
  }
  async sendUserNotFoundMessage(chatId: TelegramBot.ChatId) {
    await this.botService.sendMessage(chatId, `Sorry, but we couldn't find your friend in our system. Convince him to use our bot and then you can add him as a friend😉`)
  }

  isMatching(msg: MetaMessage): boolean {
    return !!msg.text?.startsWith(this.name);
  }
}

type ContactInfo = [isContactFounded: boolean, contact: string | null]