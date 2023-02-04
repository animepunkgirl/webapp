import {JwtToken} from "../user.types";

export interface ChangeTokenDto {
  telegram_token: JwtToken,
  access_token: string
}