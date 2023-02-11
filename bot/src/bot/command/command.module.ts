import {StartCommand} from "./start.command";
import {AppCommand} from "./app.command";
import {AddCommand} from "./add.command";
import {FriendsCommand} from "./friends.command";
import {FactoryProvider, Module} from "@nestjs/common";
import {UserModule} from "../../user/user.module";
import {BotModule} from "../bot.module";
import {FriendRequestModule} from "../../friend-request/friend-request.module";
import {NotifierModule} from "../notifier/notifier.module";
import {RequestsCommand} from "./requests.command";

const commands = [StartCommand, AppCommand, AddCommand, FriendsCommand, RequestsCommand]
const commandsFactory: FactoryProvider = {
  provide: 'Commands',
  useFactory: (...args) => [...args],
  inject: commands
}

@Module({
  imports: [BotModule, UserModule, FriendRequestModule, NotifierModule],
  providers: [
    ...commands,
    commandsFactory
  ],
  exports: [commandsFactory]
})
export class CommandModule {}