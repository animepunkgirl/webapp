import React from 'react';
import useCopyToClipboard from "../hooks/useCopyToClipboard";

const NoConnectedPage = () => {
  return (
    <div className='container mx-auto p-2 h-screen flex flex-col items-center justify-center text-center bg-secondary'>
      <h1 className='text-xl text-primary'>
        You have not connected VK API to our application.
      </h1>
      <h2 className='text-lg text-primary'>
        Use the <Button />  command in bot chat
      </h2>
    </div>
  );
};

const Button = () => {
  const copyCommand = useCopyToClipboard('/start')

  return <button type="button" className="bg-button px-1 text-buttonText" onClick={copyCommand}>/start</button>
}
export default NoConnectedPage;