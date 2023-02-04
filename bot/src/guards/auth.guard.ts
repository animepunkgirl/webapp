import {CanActivate, createParamDecorator, ExecutionContext, Injectable, UseGuards} from "@nestjs/common";
import {UserService} from "../user/user.service";
import {User} from "../schemas/user.schema";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const authorization = request.headers.authorization
    if (!authorization || !authorization.startsWith('Bearer '))
      return false;

    const token = authorization.split(' ')[1]
    const user = await this.userService.getUserByToken(token);

    request.user = user;
    return !!user;
  }
}

export const Auth = () => UseGuards(AuthGuard)

export const Me = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => context.switchToHttp().getRequest().user
)