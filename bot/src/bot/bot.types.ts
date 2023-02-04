import TelegramBot from "node-telegram-bot-api";

export type MetaMessage = TelegramBot.Message & TelegramBot.Metadata

export type MessageListener = (message: TelegramBot.Message, metadata: TelegramBot.Metadata) => void