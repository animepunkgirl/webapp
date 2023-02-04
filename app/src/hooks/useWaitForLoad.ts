import React, {useEffect, useRef, useState} from 'react';

const useWaitForLoad = () => {
  const [isItemLoaded, setIsItemLoaded] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if(isItemLoaded)
      return;

    const item = itemRef.current
    if(!item)
      return;

    const finishLoading = () => setIsItemLoaded(true)
    const image = item.querySelector('img')
    if(!image)
      return setIsItemLoaded(true)

    if(image.complete)
      return setIsItemLoaded(true)

    image.addEventListener('load', finishLoading)

    return () => {
      image.removeEventListener('load', finishLoading)
    }
  }, [isItemLoaded, itemRef.current])

  return [itemRef, isItemLoaded] as const;
};

export default useWaitForLoad;