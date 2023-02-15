import React from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import {Post} from "../../../types/feed.types";
import API from "../../../api";
import {useSetRecoilState} from "recoil";
import {ShareModalState} from "../../../store/app";

interface Props {
  item: Post
}

const Share = ({ item }: Props) => {
  const openShareModal = useSetRecoilState(ShareModalState)

  const handleClick = async () => {
    // await API.Feed.sendPostToBot(item)
    openShareModal({
      isShown: true,
      item: item
    })
  }

  return (
    <button type="button" className='w-6 h-6 text-button active:text-buttonText transition-colors' onClick={handleClick}>
      <PaperAirplaneIcon />
    </button>
  );
};

export default Share;