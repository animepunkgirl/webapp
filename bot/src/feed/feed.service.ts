import {Injectable, Scope} from "@nestjs/common";
import {VkService} from "../integrations/vk/vk.service";
import {FeedDto} from "./dto/feed.dto";
import {JwtService} from "@nestjs/jwt";
import {Post} from "./types/post.types";
import {User} from "../schemas/user.schema";

@Injectable({ scope: Scope.REQUEST })
export class FeedService {
  constructor(
    private jwtService: JwtService,
    private vkService: VkService
  ) {}

  async generateFeed(access_token: User["access_token"], offsetString?: FeedDto["offset_key"], count: number = 20): Promise<FeedDto> {
    this.vkService.connect(access_token)

    const offset = this.decodeOffset(offsetString)
    const vkFeed = await this.vkService.getFeed(offset, count);
    const offset_key = this.signOffset(vkFeed.new_offset)

    return {
      items: vkFeed.posts,
      offset_key
    }
  }

  // TODO: Converting post to message
  convertPostToMessage(post: Post): string {
    return 'NOTHING'
  }

  private signOffset(offset: string): string {
    return this.jwtService.sign(offset)
  }

  private decodeOffset(offsetString?: string) {
    if(!offsetString)
      return ''

    const decoded = this.jwtService.decode(offsetString)
    if(!decoded || typeof decoded !== 'string')
      return ''

    return decoded
  }
}