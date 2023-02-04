import React from 'react';
import {ArrowDownIcon} from "@heroicons/react/24/outline";

interface Props {
  isShown: boolean,
  onChange: () => void
}

const ExpandTextButton = ({ isShown, onChange }: Props) => {

  if(!isShown)
    return null;

  return (
    <button className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent h-32' onClick={onChange}>
      <span className='absolute inset-x-0 mx-auto bottom-1 text-primary h-6 w-6'>
        <ArrowDownIcon />
      </span>
    </button>
  );
};

export default ExpandTextButton;