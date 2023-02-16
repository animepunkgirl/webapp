import {Module} from "@nestjs/common";
import {BotBootstrap} from "./bootstrap";
import {IncorrectCommand} from "../command/incorrect.command";
import {CommandModule} from "../command/command.module";
import {BotModule} from "../bot.module";
import {CallbackModule} from "../callback/callback.module";
import {QueryModule} from "../query/query.module";

@Module({
  imports: [BotModule, CommandModule, CallbackModule, QueryModule],
  providers: [
    BotBootstrap,
    IncorrectCommand,
  ]
})
export class BotBootstrapModule {}