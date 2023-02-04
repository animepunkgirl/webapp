import React from 'react';

const NotAuthorizedPage = () => {
  return (
    <div className='container mx-auto p-2 h-screen flex flex-col items-center justify-center text-center bg-secondary'>
      <h1 className='text-xl break-normal text-primary'>
        We were unable to authorize your <strong className='text-button font-semibold'>Telegram</strong> account
      </h1>
      <h2 className='text-lg text-primary'>
        Please, <strong className='text-button'>try again later</strong>.
      </h2>
      <p className='text-sm text-primary'>
        If you haven't tried to <span className='bg-hint font-semibold rounded px-0.5'>hack</span> us, then the error could be on our side, as well as on the side of Telegram.
      </p>
    </div>
  );
};

export default NotAuthorizedPage;