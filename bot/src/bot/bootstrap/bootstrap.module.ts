import {FactoryProvider, Module} from "@nestjs/common";
import {StartCommand} from "../command/start.command";
import {AppCommand} from "../command/app.command";
import {BotModule} from "../bot.module";
import {UserModule} from "../../user/user.module";
import {BotBootstrap} from "./bootstrap";
import {IncorrectCommand} from "../command/incorrect.command";

const commands = [StartCommand, AppCommand]
const commandsFactory: FactoryProvider = {
  provide: 'Commands',
  useFactory: (...args) => [...args],
  inject: commands
}

@Module({
  imports: [BotModule, UserModule],
  providers: [BotBootstrap, ...commands, commandsFactory, IncorrectCommand],
  exports: [...commands, commandsFactory]
})
export class BotBootstrapModule {}