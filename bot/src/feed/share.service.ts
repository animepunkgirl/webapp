import {Injectable} from "@nestjs/common";
import {AttachmentType, Post, PostType, UnionAttachment} from "./types/post.types";
import {User} from "../schemas/user.schema";
import {BotService} from "../bot/bot.service";
import TelegramBot from "node-telegram-bot-api";

@Injectable()
export class ShareService {
    constructor(
        private botService: BotService
    ) {}

    async shareMessage(chatId: User["chat_id"], post: Post) {
        if (post.type === PostType.Single) {
            await this.shareSingleMessage(chatId, post.attachment);
        }

        if (post.type === PostType.Complex) {
            await this.shareComplexMessage(chatId, post.attachments);
        }
    }

    private async shareSingleMessage(chatId: User["chat_id"], attachment: UnionAttachment): Promise<void>  {
        if (attachment.type === AttachmentType.Text) {
            await this.botService.sendMessage(chatId, attachment.text);
            return
        }

        if (attachment.type === AttachmentType.Image) {
            await this.botService.sendPhoto(chatId, attachment.image_url);
            return
        }

        if (attachment.type === AttachmentType.Video) {
            let caption;
            if (attachment.title)
                caption = this.getVideoLink(attachment.title, attachment.player_url);
            await this.botService.sendPhoto(chatId, attachment.preview_url, {caption, parse_mode: "HTML"});
            return
        }

        if (attachment.type === AttachmentType.File) {
            await this.botService.sendDocument(chatId, attachment.file_url);
            return
        }
    }

    private async shareComplexMessage(chatId: User["chat_id"], attachments: UnionAttachment[]) {
        const media: TelegramBot.InputMedia[] = []
        const videoList: string[] = []
        let description;

        for (const attachment of attachments) {
            if (attachment.type === AttachmentType.Text)
                description = attachment.text;

            if (attachment.type === AttachmentType.Video) {
                const title = attachment.title ? attachment.title : 'Play video';
                const videoLink = this.getVideoLink(title, attachment.player_url);
                videoList.push(videoLink);
            }

            const formatAttachment = this.formatAttachment(attachment);

            if (formatAttachment)
                media.push(formatAttachment);
        }

        media[0].caption = this.getComplexCaption(videoList, description);

        await this.botService.sendMediaGroup(chatId, media);
    }

    private getVideoLink(name: string, url: string) {
        return `<a href="${url}">🎬 ${name}</a>`
    }

    private formatAttachment(attachment: UnionAttachment): TelegramBot.InputMedia | null {
        if (attachment.type === AttachmentType.Image)
            return {
                media: attachment.image_url,
                type: 'photo'
            }

        if (attachment.type === AttachmentType.Video)
            return {
                media: attachment.preview_url,
                type: 'photo',
                caption: attachment.player_url,
                parse_mode: 'HTML'
            }

        return null
    }

    private getComplexCaption(videoList: string[], description?: string): string {
        let complexCaption = videoList.join('\n');

        if (description)
            complexCaption += `\n\n${description}`;

        return complexCaption;
    }
}