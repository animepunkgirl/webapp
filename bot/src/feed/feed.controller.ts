import {Body, Controller, Get, Param, Post, Scope} from '@nestjs/common';
import {FeedService} from "./feed.service";
import {FeedDto} from "./dto/feed.dto";
import {Post as PostType} from "../feed/types/post.types"
import {BotService} from "../bot/bot.service";
import {Auth, Me} from "../guards/auth.guard";
import {User} from "../schemas/user.schema";

@Controller({
  path: 'feed'
})
export class FeedController {
  constructor(private feedService: FeedService, private botService: BotService) {}

  @Auth()
  @Get('/')
  async getFeed(@Me() user: User): Promise<FeedDto> {
    return await this.feedService.generateFeed(user.access_token)
  }

  @Auth()
  @Get('/:offset')
  async getOffsetFeed(@Me() user: User, @Param('offset') offset: string): Promise<FeedDto> {
    return await this.feedService.generateFeed(user.access_token, offset, 10)
  }

  @Auth()
  @Post('/share')
  async share(@Me() user: User, @Body() post: PostType) {
    const message = 'IN_PROGRESS: POST_SHARED' // TODO: Generate message from post
    await this.botService.sendMessage(user.chat_id, message)
  }
}
