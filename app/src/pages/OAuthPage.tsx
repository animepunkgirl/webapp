import React, {useEffect} from 'react';
import API from "../api";

const OAuthPage = () => {

  const getTelegramToken = () => {
    return window.location.search
      .substring(1)
      .split('&')
      .find(pair => pair.trim().startsWith('telegram'))
      ?.split('=')[1]
      ?.replace('/', '')
  }

  const getAccessToken = () => {
    return window.location.hash
      .substring(1)
      .split('&')
      .find(pair => pair.trim().startsWith('access_token='))
      ?.split('=')[1]
  }

  useEffect(() => {
    const telegram = getTelegramToken()
    const access = getAccessToken();

    if(telegram && access) {
      (async () => {
        await API.User.changeAccessToken(telegram, access)
      })()
    }
  }, [])

  return (
    <div>
      Return _o-o
    </div>
  );
};

export default OAuthPage;