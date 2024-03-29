import {Injectable} from "@nestjs/common";
import * as crypto from "crypto";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "../schemas/user.schema";
import {Model, Types} from "mongoose";
import {InitData, JwtToken} from "./user.types"
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {Logger} from "../helpers/logger/logger.service";
import {BotService} from "../bot/bot.service";

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private botService: BotService,
    private logger: Logger
  ) {}

  parseInitData(initData: string): InitData | null {
    const isValid = this.validateInitData(initData)
    if(!isValid)
      return null

    return this.getInitData(initData)
  }

  async getUserByChatId(chat_id: User["chat_id"]): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      chat_id
    }).populate('friends').exec()

    if(!user)
      return this.createUser(chat_id)

    return user;
  }

  async getUserById(userId: Types.ObjectId): Promise<UserDocument | null> {
    return await this.userModel.findById(userId).exec()
  }

  async getUserByToken(token: JwtToken): Promise<UserDocument | null> {
    try {
      const chat_id = this.jwtService.verify(token);
      const user = await this.userModel.findOne({
        chat_id
      }).exec();

      if(!user)
        return this.createUser(chat_id);

      return user;
    } catch (e) {
      console.log(e)
      return null;
    }
  }

  async getUserByUsername(username: string): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findOne({
        username
      }).exec()
      if(user)
        return user;

      // If we can't find a user by his username, we assume it may be out of date.
      // Then we search for usernames by chat id for all users and update them at same time.
      const users = await this.userModel.find().exec()

      for (const user of users) {
        const chat = await this.botService.getChat(user.chat_id)
        if(user.username !== chat.username) {
          user.username = chat.username
          await user.save()
        }
        if(chat.username === username)
          return user;
      }
      return null;
    } catch (e) {
      console.log(e)
      return null;
    }
  }

  async getFriendsByIds(friends: User["friends"]): Promise<UserDocument[]> {
    return await this.userModel.find({
      '_id': {
        $in: friends
      }
    }).exec()
  }

  async addFriend(user: UserDocument, friend: UserDocument): Promise<void> {
    user.friends.push(friend)
    await user.save()
  }

  async deleteFriend(user: UserDocument, friendId: string): Promise<void> {
    user.friends = user.friends.filter(friend => friend.chat_id.toString() !== friendId)
    const friend = await this.getUserByChatId(parseInt(friendId))
    friend.friends = friend.friends.filter(friend => friend.chat_id !== user.chat_id)
    await user.save()
    await friend.save()
  }

  async updateUsername(chat_id: User["chat_id"]): Promise<void> {
    const user = await this.userModel.findOne({
      chat_id
    }).exec()
    if(!user)
      return;

    const info = await this.botService.getChat(chat_id)
    if(!info.username)
      return;

    user.username = info.username
    await user.save()
  }

  async isUsersAreFriends(first: Types.ObjectId, second: Types.ObjectId): Promise<boolean> {
    const firstUser = await this.userModel.findById(first).exec()
    const secondUser = await this.userModel.findById(second).exec()
    if(!firstUser || !secondUser)
      throw new Error('Incorrect users')

    // @ts-ignore
    return firstUser.friends.includes(second) && secondUser.friends.includes(first)
  }

  getJwtToken(chat_id: User["chat_id"]): JwtToken {
    return this.jwtService.sign(chat_id.toString())
  }

  private validateInitData(initData: string): boolean {
    const encoded = decodeURIComponent(initData)

    const token = this.configService.get('TELEGRAM_TOKEN')
    const secret = crypto
      .createHmac('sha256', 'WebAppData')
      .update(token)

    const arr = encoded.split('&');
    const hashIndex = arr.findIndex(str => str.startsWith('hash='));
    const hash = arr.splice(hashIndex)[0].split('=')[1];

    if(!hash)
      return false;

    // sorted alphabetically
    arr.sort((a, b) => a.localeCompare(b));
    // in the format key=<value> with a line feed character ('\n', 0x0A) used as separator
    // e.g., 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>
    const dataCheckString = arr.join('\n');

    // The hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the secret key
    const _hash = crypto
      .createHmac('sha256', secret.digest())
      .update(dataCheckString)
      .digest('hex');

    return hash === _hash;
  }

  private getInitData(initData: string): InitData {
    const result = {} as { [key: string]: string }

    initData.split('&').forEach(item => {
      const split = item.split('=')
      const key = split[0]
      const value = split[1]

      if(key === 'hash')
        return;

      if(key === 'user')
        return result[key] = JSON.parse(decodeURIComponent(value))

      result[key] = value
    })

    return result as unknown as InitData;
  }

  private async createUser(chat_id: User["chat_id"]): Promise<UserDocument> {
    const createdUser = new this.userModel({
      chat_id
    })
    return createdUser.save()
  }
}