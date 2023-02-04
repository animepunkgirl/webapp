import {Injectable, Scope} from "@nestjs/common";
import {API} from "vk-io";
import {VkFeed} from "./vk.types";
import {
  AttachmentType,
  Author,
  ComplexContent,
  FileAttachment,
  ImageAttachment,
  Post,
  PostType,
  SingleContent,
  TextAttachment,
  UnionAttachment,
  UnionContent,
  VideoAttachment
} from "../../feed/types/post.types";
import {NewsfeedNewsfeedItem, PhotosPhotoSizes} from "vk-io/lib/api/schemas/objects";
import {NewsfeedGenericResponse} from "vk-io/lib/api/schemas/responses";
import {ConfigService} from "@nestjs/config";
import {User} from "../../schemas/user.schema";

// TODO: Refactor / add all post types converters
@Injectable({ scope: Scope.REQUEST })
export class VkService {
  private api: API;

  constructor(private configService: ConfigService) {}

  // TODO: Move making to constructor
  connect(token: User["access_token"]) {
    this.api = new API({ token })
  }

  // @ts-ignore
  async getFeed(start_from?: string, count: number = 20): Promise<VkFeed> {
    try {
      const feed = await this.api.newsfeed.get({
        filters: ["post"],
        start_from,
        count
      })

      return {
        new_offset: feed.next_from,
        posts: await this.formatNewsfeed(feed)
      }
    } catch (e) {
      console.log(e)
    }
  }

  private async formatNewsfeed({ items, groups, profiles}: NewsfeedGenericResponse): Promise<Post[]> {
    const formatted: Post[] = []
    for (const post of items) {
      formatted.push({
        id: post.id,
        meta: {
          author: this.getAuthor(post.source_id, groups, profiles),
        },
        ...await this.getContent(post)
      })
    }

    return formatted
  }

  private getAuthor(source_id: number, groups: NewsfeedGenericResponse["groups"], profiles: NewsfeedGenericResponse["profiles"]): Author {
    try {
      const author = source_id > 0 ? profiles.find(profile => profile.id === source_id) : groups.find(group => group.id === source_id * -1)
      return {
        name: author.name,
        avatar_url: author.photo_100,
        external_url: `https://vk.com/${author.screen_name}`
      }
    } catch (e) {
      console.log(e)
      return {
        name: 'UNKNOWN',
        avatar_url: '',
        external_url: 'UNKNOWN'
      }
    }
  }

  private async getContent(post: NewsfeedNewsfeedItem): Promise<UnionContent> {
    if (!post.attachments?.length)
      return this.getTextContent(post.text)

    if (post.attachments.length === 1 && !post.text)
      return await this.getSingleContent(post.attachments[0])

    return this.getComplexContent(post)
  }

  private getTextContent(text: string): SingleContent<TextAttachment> {
    return {
      type: PostType.Single,
      attachment: this.getTextAttachment(text)
    }
  }

  private async getSingleContent(attachment: any): Promise<SingleContent<ImageAttachment | VideoAttachment | FileAttachment>> {
    if (attachment.type === 'photo')
      return {
        type: PostType.Single,
        attachment: this.getImageAttachment(attachment.photo.sizes)
      }

    if (attachment.type === 'video')
      return {
        type: PostType.Single,
        attachment: await this.getVideoAttachment(attachment.video)
      }
    if(attachment.type === 'doc')
      return {
        type: PostType.Single,
        attachment: this.getFileAttachment(attachment.doc)
      }
    // TODO: Links support

    // Never happen anyway
    return {type: PostType.Single, attachment}
  }

  private async getComplexContent(post: NewsfeedNewsfeedItem): Promise<ComplexContent> {
    const attachments: UnionAttachment[] = []

    if (post.text)
      attachments.push(this.getTextAttachment(post.text))

    for (const attachment of post.attachments) {
      if (attachment.type === 'photo')
        attachments.push(this.getImageAttachment(attachment.photo.sizes))
      if (attachment.type === 'video')
        attachments.push(await this.getVideoAttachment(attachment.video))

      if(attachment.type === 'doc')
        attachments.push(this.getFileAttachment(attachment.doc))

      // TODO: Links support
    }
    return {
      type: PostType.Complex,
      attachments
    }
  }

  private getFileAttachment({ url, title }: any): FileAttachment {
    return {
      type: AttachmentType.File,
      title: title,
      file_url: url
    }
  }

  private getTextAttachment(text: string): TextAttachment {
    return {
      type: AttachmentType.Text,
      text
    }
  }

  private getImageAttachment(sizes: PhotosPhotoSizes[]): ImageAttachment {
    return {
      type: AttachmentType.Image,
      image_url: this.getImageUrlFromSizes(sizes)
    }
  }

  private async getVideoAttachment({ owner_id, id, access_key }: any): Promise<VideoAttachment> {
    console.log(" AUDIO")
    const video = await this.api.video.get({
      videos: `${owner_id}_${id}_${access_key}`
    })

    if(!video) {
      return {
        type: AttachmentType.Video,
        title: 'NOT FOUND',
        player_url: 'NOT FOUND',
        preview_url: 'NOT_FOUND'
      }
    }
    return {
      type: AttachmentType.Video,
      player_url: video.items[0].player,
      preview_url: this.getVideoPreviewUrl(video.items[0].image),
      title: video.items[0].title
    }
  }

  private getVideoPreviewUrl(images: { url: string }[]): string {
    return images[images.length-1].url
  }

  private getImageUrlFromSizes(sizes: PhotosPhotoSizes[]): string {
    return sizes.sort((a, b) => (a.width! <= b.width!) ? 1 : -1)[0].url!;
  }
}