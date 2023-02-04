import React from 'react';
import {MetaData} from "../../../types/feed.types";

interface Props {
  author: MetaData["author"]
}
const Author = ({ author }: Props) => {
  return (
    <div className='flex gap-2 items-center'>
      <div className='w-11 h-11 rounded-full overflow-hidden'>
        <img className='object-cover' src={author.avatar_url} />
      </div>

      <p className='text-ellipsis'>{author.name}</p>
    </div>
  );
};

export default Author;