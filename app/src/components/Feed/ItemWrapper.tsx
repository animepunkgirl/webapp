import React, {ForwardedRef, forwardRef, ReactNode} from 'react';
import {Post} from "../../types/feed.types";
import Author from "./FeedItems/Author";
import Share from "./FeedItems/Share";

interface Props {
  item: Post,
  children: ReactNode,
}

const ItemWrapper = forwardRef(({ children, item }: Props, ref: ForwardedRef<HTMLDivElement>) => {

  return (
    <div className='-mx-2' ref={ref}>
      <div className='p-2 md:px-4 flex items-center justify-between gap-2'>
        <Author author={item.meta.author} />
        <Share item={item} />
      </div>
      <div className='md:p-4 md:pt-2'>
        {children}
      </div>
    </div>
  );
});

export default ItemWrapper;