import {Module} from "@nestjs/common";
import {NotificationsService} from "./notifications.service";
import {BotModule} from "../bot/bot.module";

@Module({
  imports: [BotModule],
  providers: [NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule {}