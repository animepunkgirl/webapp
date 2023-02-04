import {Inject, Injectable, OnApplicationBootstrap} from "@nestjs/common";
import {BotService} from "../bot.service";
import {Command} from "../command/command";
import {IncorrectCommand} from "../command/incorrect.command";
import {ConfigService} from "@nestjs/config";
import {Logger} from "../../helpers/logger/logger.service";
import * as TelegramBot from "node-telegram-bot-api";


@Injectable()
export class BotBootstrap implements OnApplicationBootstrap {
  constructor(
    private botService: BotService,
    @Inject('Commands') private commands: Command[],
    private incorrectCommand: IncorrectCommand,
    private configService: ConfigService,
    private logger: Logger
  ) {}

  onApplicationBootstrap(): any {
    this.initBot();
    this.initListeners()
    this.logger.log('Bot successfully started')
  }

  private initBot() {
    const token = this.configService.get("TELEGRAM_TOKEN")
    if(!token)
      throw new Error('Telegram token is undefined')

    this.botService.initBot(new TelegramBot(token, {
      polling: true
    }))
  }

  private initListeners() {
    this.botService.addMessageListener(async (msg, meta) => {
      this.logger.debug(msg)
      for await (const command of this.commands) {
        if(command.isMatching(msg))
          return await command.handle({ ...msg, ...meta });
      }
      await this.incorrectCommand.handle({ ...msg, ...meta });
    })
  }
}