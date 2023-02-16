import {CACHE_MANAGER, Inject, Injectable} from "@nestjs/common";
import TelegramBot from "node-telegram-bot-api";
import {randomUUID} from "crypto";
import { Cache } from 'cache-manager';

type QueryKey = string;
export type Handler = string;
export type QueryData = {
    action: string,
}

export interface FriendRequestData extends QueryData {
    friend_request: string
}

@Injectable()
export class QueryService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheService: Cache,
    ) {}

    async getHandler(key?: QueryKey): Promise<Handler | null> {
        if(!key)
            return null;

        return key.split('_')[2] || null;
    }

    async setQuery<T>(chat_id: TelegramBot.ChatId, handler: Handler, data: T): Promise<QueryKey> {
        const key = this.generateKey(chat_id, handler)
        await this.cacheService.set(key, data)
        return key;
    }


    async parseData<T>(key: QueryKey): Promise<T | null> {
        const data = await this.cacheService.get<T>(key);

        if(!data)
            return null;

        return data;
    }

    private generateKey(chat_id: TelegramBot.ChatId, handler: Handler) {
        const uniq = randomUUID().substring(0, 6)
        return `${chat_id}_${handler}_${uniq}`
    }
}