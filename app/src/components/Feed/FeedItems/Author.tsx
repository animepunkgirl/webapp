import React from 'react';
import {MetaData} from "../../../types/feed.types";

interface Props {
  author: MetaData["author"]
}
const Author = ({ author }: Props) => {
  return (
    <div className='flex gap-2 items-center overflow-hidden'>
      <div className='flex-none w-11 h-11 rounded-full overflow-hidden'>
        <img className='object-cover' src={author.avatar_url} />
      </div>

      <p className='truncate'>{author.name}</p>
    </div>
  );
};

export default Author;