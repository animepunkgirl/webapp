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
    <>
      <LoadingScreen show={!isLoaded} />
      <div className='flex flex-col gap-2'>
        {items.map((item, i) =>
          <ItemWrapper key={item.id} item={item} ref={getItemRef(i)}>
            <Distributor post={item} />
          </ItemWrapper>
        )}
      </div>
    </>
  );
};

export default Feed;