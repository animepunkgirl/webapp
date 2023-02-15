import React, {useEffect, useState} from 'react';

const itemWidth = 48;
const FriendListSkeleton = () => {
  const [itemsCount, setItemsCount] = useState(1)
  useEffect(() => {
    setItemsCount(Math.floor(window.screen.width / itemWidth) + 1)
  }, [])

  return (
    <div className='flex gap-2 animate-pulse'>
      {[...Array(itemsCount)].map((e, i) => <SkeletonItem key={i} />)}
    </div>
  );
};

const SkeletonItem = () => {
  return (
    <button className='flex flex-col gap-0.5 items-center'>
      <div className='w-12 h-12 relative bg-background rounded-full overflow-hidden' />
      <div className='text-xs h-4 w-8 bg-background rounded overflow-hidden' />
    </button>
  )
}
export default FriendListSkeleton;