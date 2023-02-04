import {Post} from "../../feed/types/post.types";


export interface VkFeed {
  posts: Post[]
  new_offset: string
}