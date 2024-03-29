import {Module} from "@nestjs/common";
import {VkService} from "../integrations/vk/vk.service";
import {FeedController} from "./feed.controller";
import {UserModule} from "../user/user.module";
import {BotModule} from "../bot/bot.module";
import {FeedService} from "./feed.service";
import {ShareService} from "./share.service";

@Module({
  imports: [UserModule, BotModule, FeedModule],
  providers: [FeedService, ShareService, VkService],
  controllers: [FeedController]
})
export class FeedModule {}