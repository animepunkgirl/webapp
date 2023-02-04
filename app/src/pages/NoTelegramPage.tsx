import React from 'react';

const NoTelegramPage = () => {
  return (
    <div className='container mx-auto p-2 h-screen flex flex-col items-center justify-center text-center bg-secondary'>
      <h1 className='text-xl text-primary'>
        This app only works on <strong className='text-button font-semibold'>Telegram</strong>.
      </h1>
      <h2 className='text-lg text-primary'>
        You can access it through our <a href='/nowhere' className='text-link underline'>bot</a>
      </h2>
    </div>
  );
};

export default NoTelegramPage;