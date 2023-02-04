import {InitData} from "../user.types";

export interface AuthorizeDto {
  init_data: InitData,
  token: string,
  is_connected: boolean
}