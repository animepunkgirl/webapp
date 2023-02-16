import {FactoryProvider, Module} from "@nestjs/common";
import {RequestCallback} from "./request.callback";
import {BotModule} from "../bot.module";
import {FriendRequestModule} from "../../friend-request/friend-request.module";
import {DeleteCallback} from "./delete.callback";
import {UserModule} from "../../user/user.module";
import {NotifierModule} from "../notifier/notifier.module";
import {QueryModule} from "../query/query.module";

export const callbacks = [RequestCallback, DeleteCallback]
const callbacksFactory: FactoryProvider = {
  provide: 'Callbacks',
  useFactory: (...args) => [...args],
  inject: callbacks
}

@Module({
  imports: [BotModule, UserModule, FriendRequestModule, NotifierModule, QueryModule],
  providers: [...callbacks, callbacksFactory],
  exports: [callbacksFactory, ...callbacks]
})
export class CallbackModule {}