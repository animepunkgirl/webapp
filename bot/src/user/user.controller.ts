import {Body, Controller, Get, HttpException, HttpStatus, Post, Query} from "@nestjs/common";
import {UserService} from "./user.service";
import {AuthorizeDto} from "./dto/authorize.dto";
import {ChangeTokenDto} from "./dto/change-token.dto";
import {Auth, Me} from "../guards/auth.guard";
import {User} from "../schemas/user.schema";
import {FriendsDto} from "./dto/friends.dto";
import {BotService} from "../bot/bot.service";
import {Friend} from "./user.types";

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private botService: BotService
  ) {}

  @Get()
  async authorize(@Query('init_data') initData: string): Promise<AuthorizeDto> {
    const data = this.userService.parseInitData(initData);
    if(!data)
      throw new HttpException('Wrong telegram data', HttpStatus.UNAUTHORIZED)

    const user = await this.userService.getUserByChatId(data.user.id);

    //Fire and forget
    this.userService.updateUsername(data.user.id)

    return {
      init_data: data,
      token: this.userService.getJwtToken(user.chat_id),
      is_connected: !!user.access_token
    }
  }

  @Auth()
  @Get('/friends')
  async getFriends(@Me() user: User): Promise<FriendsDto> {
    const friends = await this.userService.getFriendsByIds(user.friends)
    const friendList: Friend[] = []
    for await (const friend of friends) {
      const info = await this.botService.getChat(friend.chat_id)
      const avatar_url = await this.botService.getFileLink(info?.photo?.small_file_id)
      friendList.push({
        id: friend.chat_id,
        name: info.first_name!,
        avatar_url
      })
    }
    return {
      friends: friendList
    };
  }

  @Post('/access-token')
  async changeAccessToken(@Body() dto: ChangeTokenDto): Promise<string> {
    const user = await this.userService.getUserByToken(dto.telegram_token);

    if (!user)
      throw new HttpException('Incorrect telegram token', HttpStatus.UNAUTHORIZED);

    user.access_token = dto.access_token;
    await user.save();
    console.debug(`${user.chat_id}'s token changed to ${dto.access_token}`)

    return 'success';
  }
}