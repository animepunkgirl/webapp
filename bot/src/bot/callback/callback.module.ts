import {FactoryProvider, Module} from "@nestjs/common";
import {RequestCallback} from "./request.callback";
import {BotModule} from "../bot.module";
import {FriendRequestModule} from "../../friend-requests/friend-request.module";
import {DeleteCallback} from "./delete.callback";
import {UserModule} from "../../user/user.module";

const callbacks = [RequestCallback, DeleteCallback]
const callbacksFactory: FactoryProvider = {
  provide: 'Callbacks',
  useFactory: (...args) => [...args],
  inject: callbacks
}

@Module({
  imports: [BotModule, UserModule, FriendRequestModule],
  providers: [...callbacks, callbacksFactory],
  exports: [callbacksFactory]
})
export class CallbackModule {}