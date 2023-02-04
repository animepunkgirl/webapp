import React from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import {Post} from "../../../types/feed.types";
import API from "../../../api";

interface Props {
  item: Post
}

const Share = ({ item }: Props) => {

  const handleClick = async () => {
    console.log(await API.Feed.sendPostToBot(item))
  }

  return (
    <button type="button" className='w-6 h-6 text-button active:text-buttonText transition-colors' onClick={handleClick}>
      <PaperAirplaneIcon />
    </button>
  );
};

export default Share;