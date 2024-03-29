import {Command} from "./command";
import {Injectable} from "@nestjs/common";
import {BotService} from "../bot.service";
import {UserService} from "../../user/user.service";
import {MetaMessage} from "../bot.types";
import {ConfigService} from "@nestjs/config";
import {Logger} from "../../helpers/logger/logger.service";

@Injectable()
export class StartCommand extends Command {
    name = '/start';

    constructor(
      private botService: BotService,
      private userService: UserService,
      private configService: ConfigService,
      private logger: Logger
    ) {
        super()
    }

    async handle(msg: MetaMessage): Promise<void> {
        const chatId = msg.chat.id;
        const user = await this.userService.getUserByChatId(chatId);
        if(!user) {
            await this.botService.sendMessage(chatId, 'Sorry, we had some problems on our side, try to /start later :(')
            return;
        }

        await this.botService.sendMessage(chatId, 'Welcome to Feeder bot!')
        const token = this.userService.getJwtToken(chatId);
        const oauth = this.generateLogInLink(token)
        const text = `
            Please connect your VK account to our bot
            ${oauth}
        `

        await this.botService.sendMessage(chatId, text)
    }

    private generateLogInLink(token: string) {
        const oauthLink = this.configService.get('OAUTH_LINK').replace('REDIRECT_URI', 'https://vk.com/blank.html')
        this.logger.debug(oauthLink)
        return oauthLink;
    }
}