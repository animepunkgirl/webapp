import {Injectable} from "@nestjs/common";
import * as crypto from "crypto";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "../schemas/user.schema";
import {Model} from "mongoose";
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
      const users = await this.userModel.find().exec()

      for (const user of users) {
        const chat = await this.botService.getChat(user.chat_id)
        if(chat.username === username)
          return user;
      }
      return null;
    } catch (e) {
      console.log(e)
      return null;
    }
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