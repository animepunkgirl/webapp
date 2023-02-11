import {Module} from "@nestjs/common";
import {NotifierService} from "./notifier.service";
import {BotModule} from "../bot.module";

@Module({
  imports: [BotModule],
  providers: [NotifierService],
  exports: [NotifierService]
})
export class NotifierModule {}