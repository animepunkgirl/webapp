import {Post} from "../../types/feed.types";

export interface FeedDto {
  items: Post[],
  offset_key: string
}