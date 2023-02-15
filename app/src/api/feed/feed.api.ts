import axios from '../_axios'
import {FeedDto} from "./feed.dtos";
import {Post} from "../../types/feed.types";
import {Friend} from "../../types/user.types";

const getFeed = async (offset_key: string = '') => {
  const response = await axios.get<FeedDto>(`/feed/${offset_key}`)

  return response.data;
}

const sharePost = async (post: Post, friends: Friend["id"][], self_send: boolean, caption?: string) => {
  const response = await axios.post(`/feed/share`, { post, friends, self_send, caption })

  return response.data;
}

export default {
  getFeed,
  sharePost
}