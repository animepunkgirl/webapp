import axios from '../_axios'
import {FeedDto} from "./feed.dtos";
import {Post} from "../../types/feed.types";

const getFeed = async (offset_key: string = '') => {
  const response = await axios.get<FeedDto>(`/feed/${offset_key}`)

  return response.data;
}

const sendPostToBot = async (post: Post) => {
  const response = await axios.post(`/feed/share`, { post })

  return response.data;
}
export default {
  getFeed,
  sendPostToBot
}