import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FeedDto} from "../api/feed/feed.dtos";
import {Post} from "../types/feed.types";
import API from "../api";
import {useInView} from "react-intersection-observer";

const useFeed = () => {
  const [items, setItems] = useState<Post[]>([])
  const [loadNextRef, isLoadNextTriggered] = useInView()
  const [nextOffset, setNextOffset] = useState<FeedDto['offset_key']>('')

  useEffect(() => {
    const initialLoading = async () => {
      const result = await API.Feed.getFeed()
      setItems(result.items)
      setNextOffset(result.offset_key)
    }
    (async () => {
      await initialLoading()
    })();
  }, [])

  const loadNext = useCallback(() => {
    const initialLoading = async () => {
      console.log('loadNext')
      const result = await API.Feed.getFeed(nextOffset)
      setItems(prev => [...prev, ...result.items])
      setNextOffset(result.offset_key)
    }
    (async () => {
      await initialLoading()
    })();
  }, [nextOffset])

  useEffect(() => {
    if(isLoadNextTriggered)
      loadNext()

  }, [isLoadNextTriggered, loadNext])

  return [items, loadNextRef] as const;
};

export default useFeed;