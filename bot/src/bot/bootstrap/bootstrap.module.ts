import {FactoryProvider, Module} from "@nestjs/common";
import {StartCommand} from "../command/start.command";
import {AppCommand} from "../command/app.command";
import {BotModule} from "../bot.module";
import {UserModule} from "../../user/user.module";
import {BotBootstrap} from "./bootstrap";
import {IncorrectCommand} from "../command/incorrect.command";
import {AddCommand} from "../command/add.command";
import {FriendRequestModule} from "../../friend-requests/friend-request.module";
import {NotificationsModule} from "../../notifications/notifications.module";
import {RequestCallback} from "../callback/request.callback";
import {FriendsCommand} from "../command/friends.command";

const commands = [StartCommand, AppCommand, AddCommand, FriendsCommand]
const commandsFactory: FactoryProvider = {
  provide: 'Commands',
  useFactory: (...args) => [...args],
  inject: commands
}

const callbacks = [RequestCallback]
const callbacksFactory: FactoryProvider = {
  provide: 'Callbacks',
  useFactory: (...args) => [...args],
  inject: callbacks
}

@Module({
  imports: [BotModule, UserModule, FriendRequestModule, NotificationsModule],
  providers: [
    BotBootstrap,
    // @ts-ignore
    ...commands,
    // @ts-ignore
    commandsFactory,
    // @ts-ignore
    IncorrectCommand,
    // @ts-ignore
    ...callbacks,
    // @ts-ignore
    callbacksFactory
  ],
  exports: [...commands, commandsFactory, ...callbacks, callbacksFactory]
})
export class BotBootstrapModule {}