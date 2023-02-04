import {Body, Controller, Get, HttpException, HttpStatus, Param, Post, Scope} from '@nestjs/common';
import {FeedService} from "./feed.service";
import {FeedDto} from "./dto/feed.dto";
import {Auth, Me} from "../guards/auth.guard";
import {User} from "../schemas/user.schema";
import {ShareDto} from "./dto/share.dto";
import {ShareService} from "./share.service";

@Controller({
  path: 'feed'
})
export class FeedController {
  constructor(private feedService: FeedService, private shareService: ShareService) {}

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
  async share(@Me() user: User, @Body() {post}: ShareDto) {
    if (!post)
      throw new HttpException("Wrong data", HttpStatus.BAD_REQUEST);

    await this.shareService.shareMessage(user.chat_id, post);
  }
}
