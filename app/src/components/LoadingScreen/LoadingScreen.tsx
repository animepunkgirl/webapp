import React from 'react';

interface Props {
  show: boolean
}

const LoadingScreen = ({ show }: Props) => {
  if(!show)
    return null;

  return (
    <div className='fixed bg-secondary z-10 top-0 left-0 flex justify-center items-center h-screen w-screen'>
      <div className='animate-pulse flex gap-2'>
        <div className='rounded-full motion-reduce:animate-pulse h-6 w-6 bg-hint'></div>
        <div className='rounded-full animate-pulse h-6 w-6 bg-hint'></div>
      </div>
    </div>
  );
};

export default LoadingScreen;