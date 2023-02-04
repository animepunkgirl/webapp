import React, {useEffect, useRef, useState} from 'react';
import {VideoAttachment} from "../../../types/feed.types";
import { PlayIcon } from "@heroicons/react/24/outline";
import {useInView} from "react-intersection-observer";

interface Props {
  attachment: VideoAttachment
}

const VideoPlayer = ({ attachment }: Props) => {
  const [isActive, setIsActive] = useState(false)
  const [ref, inView] = useInView()
  const visibilityTimeout = useRef<number | undefined>(undefined)

  useEffect(() => {
    if(isActive) {
      if(inView) {
        clearTimeout(visibilityTimeout.current)
      } else {
        visibilityTimeout.current = setTimeout(() => {
          setIsActive(false)
        }, 2000)
      }
    } else {
      clearTimeout(visibilityTimeout.current)
    }

    return () => {
      clearTimeout(visibilityTimeout.current)
    }
  }, [isActive, inView])

  if(!isActive)
    return (
      <div className='relative max-h-screen'>
        <div className='absolute top-0 left-0 py-2 px-4 bg-gradient-to-b from-black to-transparent w-full h-32 opacity-60' />
        <div className='absolute top-0 left-0 py-2 px-4 font-semibold w-full h-10'>
          {attachment.title}
        </div>
        <img src={attachment.preview_url} className='max-h-screen mx-auto' alt={`preview of the ${attachment.title}`}/>
        <button
          className='
            absolute
            top-2/4 left-2/4
            text-buttonText
            w-20 h-20
            -translate-x-2/4 -translate-y-2/4
            transition-transform
            active:scale-75
          '
          onClick={() => setIsActive(true)}
        >
          <PlayIcon />
        </button>
      </div>
    )


  return (
    <div className='max-h-screen w-full' ref={ref}>
      <iframe src={attachment.player_url} className='mx-auto' />
    </div>
  );
};

export default VideoPlayer;