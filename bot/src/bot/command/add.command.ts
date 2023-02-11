import {Command} from "./command";
import {Injectable} from "@nestjs/common";
import {BotService} from "../bot.service";
import {MetaMessage} from "../bot.types";
import {UserService} from "../../user/user.service";
import TelegramBot from "node-telegram-bot-api";
import {FriendRequestService} from "../../friend-request/friend-request.service";
import {NotifierService} from "../notifier/notifier.service";

@Injectable()
export class AddCommand extends Command {
  name = '/add';

  constructor(
    private botService: BotService,
    private userService: UserService,
    private friendRequestService: FriendRequestService,
    private notifierService: NotifierService
  ) {
    super()
  }

  async handle(msg: MetaMessage): Promise<void> {
    try {
      if (!msg.text)
        return;

      const chatId = msg.chat.id;
      const user = await this.userService.getUserByChatId(chatId)
      const username = this.parseUsername(msg.text)
      if (username) {
        const friend = await this.userService.getUserByUsername(username)
        if (!friend) {
          return await this.sendUserNotFoundMessage(chatId)
        }
        const incomingFriendRequest = await this.friendRequestService.getByUsers(friend._id, user._id)
        if(incomingFriendRequest) {
          await this.friendRequestService.accept(incomingFriendRequest._id.toString())
          await this.botService.sendMessage(chatId, `@${username} has already sent you a friend request, so we added him to your list of friends😊`)
          return;
        }

        const friendRequest = await this.friendRequestService.create(user._id, friend._id);
        if (friendRequest) {
          await this.sendFriendRequestMadeMessage(chatId, username)
          return this.notifierService.incomingFriendRequest(friend.chat_id.toString(), user.username!, friendRequest._id,)
        }
      }
    } catch (e) {

    }
  }

  private parseUsername(text: MetaMessage["text"]): string | null {
    if (!text)
      return null

    const username = text.split(' ')[1]
    if (!username)
      return null;

    if (username.startsWith('@'))
      return username.substring(1);

    if (username.startsWith('http://') || username.startsWith('https://'))
      return username.split('/')[3] ?? null;

    return username;
  }

  private async sendFriendRequestMadeMessage(chatId: TelegramBot.ChatId, username: string) {
    await this.botService.sendMessage(chatId, `We sent a friend request to @${username}. We'll notify you when he adds you!`)
  }

  private async sendUserNotFoundMessage(chatId: TelegramBot.ChatId) {
    await this.botService.sendMessage(chatId, `Sorry, but we couldn't find your friend in our system. Convince him to use our bot and then you can add him as a friend😉`)
  }

  isMatching(msg: MetaMessage): boolean {
    return !!msg.text?.startsWith(this.name);
  }
}