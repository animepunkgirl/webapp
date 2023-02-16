import {Module} from "@nestjs/common";
import {NotifierService} from "./notifier.service";
import {BotModule} from "../bot.module";
import {QueryModule} from "../query/query.module";

@Module({
  imports: [BotModule, QueryModule],
  providers: [NotifierService],
  exports: [NotifierService]
})
export class NotifierModule {}