import axios from "../_axios";
import {AuthorizeDto} from "./user.dtos";
import {ConnectedSources, Source} from "../../types/user.types";

const authorize = async (init_data: string): Promise<AuthorizeDto> => {
    const response = await axios.get<AuthorizeDto>(`/user/`, {
      params: {init_data}
    });

    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`

    return response.data
}

const getConnectedSources = async (): Promise<ConnectedSources> => {
  const response = await axios.get<ConnectedSources>('/user/connections')

  return response.data;
}

const changeAccessToken = async (telegram_token: string, access_token: string) => {
  const response = await axios.post('/user/access-token', { telegram_token, access_token })
  return response.data;
}

const getFriends = async () => {
  const response = await axios.get('/user/friends')
  return response.data.friends
}

export default {
  authorize,
  getConnectedSources,
  changeAccessToken,
  getFriends
}