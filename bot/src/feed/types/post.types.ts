export const enum AttachmentType {
  Text = 'text',
  Image = 'image',
  Video = 'video',
  File = 'file'
}

export const enum PostType {
  Single = 'single',
  Complex = 'complex'
}

interface Attachment {
  type: AttachmentType,
  [key: string]: any
}

export interface TextAttachment extends Attachment {
  type: AttachmentType.Text
  text: string,
}

export interface ImageAttachment extends Attachment {
  type: AttachmentType.Image
  image_url: string,
}

export interface VideoAttachment extends Attachment {
  type: AttachmentType.Video
  title?: string
  player_url: string,
  preview_url: string,
}

export interface FileAttachment extends Attachment {
  type: AttachmentType.File
  title?: string,
  file_url: string
}

export type UnionAttachment = TextAttachment | ImageAttachment | VideoAttachment | FileAttachment

export interface SingleContent<T extends Attachment> {
  type: PostType.Single
  attachment: T
}

export interface ComplexContent {
  type: PostType.Complex
  attachments: UnionAttachment[]
}

export interface Author {
  avatar_url: string,
  name: string,
  external_url: string,
}

export interface MetaData {
  author: Author
}

export interface CommonData {
  id: string,
  meta: MetaData
}

export type UnionContent = SingleContent<UnionAttachment> | ComplexContent
export type Post = CommonData & UnionContent