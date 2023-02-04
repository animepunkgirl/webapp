import React from 'react';
import Feed from "../components/Feed/Feed";
import {useRecoilValue} from "recoil";
import {isConnectedState} from "../store/user";
import NoConnectedPage from "./NoConnectedPage";

const FeedPage = () => {
  const isConnected = useRecoilValue(isConnectedState)

  if(!isConnected)
    return <NoConnectedPage />

  return <Feed />
};

export default FeedPage;