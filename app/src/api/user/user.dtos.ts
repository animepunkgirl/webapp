import {InitData} from "../../types/user.types";


export interface AuthorizeDto {
  token: string,
  init_data: InitData,
  is_connected: boolean
}