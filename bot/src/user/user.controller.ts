import {Body, Controller, Get, HttpException, HttpStatus, Post, Query} from "@nestjs/common";
import {UserService} from "./user.service";
import {AuthorizeDto} from "./dto/authorize.dto";
import {ChangeTokenDto} from "./dto/change-token.dto";

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService
  ) {}

  @Get()
  async authorize(@Query('init_data') initData: string): Promise<AuthorizeDto> {
    const data = this.userService.parseInitData(initData);
    if(!data)
      throw new HttpException('Wrong telegram data', HttpStatus.UNAUTHORIZED)

    const user = await this.userService.getUserByChatId(data.user.id);

    return {
      init_data: data,
      token: this.userService.getJwtToken(user.chat_id),
      is_connected: !!user.access_token
    }
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