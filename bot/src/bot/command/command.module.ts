import {StartCommand} from "./start.command";
import {AppCommand} from "./app.command";
import {AddCommand} from "./add.command";
import {FriendsCommand} from "./friends.command";
import {FactoryProvider, Module} from "@nestjs/common";
import {UserModule} from "../../user/user.module";
import {BotModule} from "../bot.module";
import {FriendRequestModule} from "../../friend-requests/friend-request.module";
import {NotificationsModule} from "../../notifications/notifications.module";

const commands = [StartCommand, AppCommand, AddCommand, FriendsCommand]
const commandsFactory: FactoryProvider = {
  provide: 'Commands',
  useFactory: (...args) => [...args],
  inject: commands
}

@Module({
  imports: [BotModule, UserModule, FriendRequestModule, NotificationsModule],
  providers: [
    ...commands,
    commandsFactory
  ],
  exports: [commandsFactory]
})
export class CommandModule {}