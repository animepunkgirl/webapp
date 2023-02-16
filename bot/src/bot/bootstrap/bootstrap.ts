import {Inject, Injectable, OnApplicationBootstrap} from "@nestjs/common";
import {BotService} from "../bot.service";
import {Command} from "../command/command";
import {IncorrectCommand} from "../command/incorrect.command";
import {ConfigService} from "@nestjs/config";
import {Logger} from "../../helpers/logger/logger.service";
import * as TelegramBot from "node-telegram-bot-api";
import {MetaMessage} from "../bot.types";
import {Callback} from "../callback/callback";
import {QueryService} from "../query/query.service";


@Injectable()
export class BotBootstrap implements OnApplicationBootstrap {
  constructor(
    private botService: BotService,
    @Inject('Commands') private commands: Command[],
    @Inject('Callbacks') private callbacks: Callback[],
    private incorrectCommand: IncorrectCommand,
    private configService: ConfigService,
    private logger: Logger,
    private queryService: QueryService
  ) {
  }

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
      const message: MetaMessage = {...msg, ...meta}
      for await (const command of this.commands) {
        if(command.isMatching(message))
          return await command.handle(message);
      }
      await this.incorrectCommand.handle(message);
    })

    this.botService.addCallbackQueryListener(async (callback_query) => {
      this.logger.debug(callback_query)
      const handler = await this.queryService.getHandler(callback_query.data)
      if(!handler)
        return;
      for await (const callback of this.callbacks) {
        if(callback.isMatching(handler))
          return await callback.handle(callback_query);
      }
    })
  }
}