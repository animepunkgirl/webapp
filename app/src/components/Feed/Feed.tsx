import React from 'react';
import useFeed from "../../hooks/useFeed";
import useWaitForLoad from "../../hooks/useWaitForLoad";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import ItemWrapper from "./ItemWrapper";
import Distributor from "./FeedItems/Distributor";

const Feed = () => {
  const [items, loadNextRef] = useFeed()
  const [firstItemRef, isLoaded] = useWaitForLoad()

  const getItemRef = (i: number) => {
    if(i === 0)
      return firstItemRef

    if(i === items.length - 3)
      return loadNextRef

    return null
  }
  return (
    <div className='bg-secondary'>
      <div className='bg-background container max-w-2xl mx-auto min-h-screen text-primary px-2 relative outline outline-1 outline-hint'>
        <LoadingScreen show={!isLoaded} />
        <div className='flex flex-col divide-y-2 divide-hint'>
          {items.map((item, i) =>
            <ItemWrapper key={item.id} item={item} ref={getItemRef(i)}>
              <Distributor post={item} />
            </ItemWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;