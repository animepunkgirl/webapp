import {Post} from "../types/post.types";


export interface FeedDto {
  items: Post[],
  offset_key: string
}