import TelegramBot from "node-telegram-bot-api";

export interface InitData {
  query_id: string,
  user: {
    id: number,
    first_name: string,
    last_name: string,
    username: string,
    language_code: string
  },
  auth_date: string,
}

export type JwtToken = string;

export interface Friend {
  id: TelegramBot.ChatId,
  name: string,
  avatar_url?: string
}