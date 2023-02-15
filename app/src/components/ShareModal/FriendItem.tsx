import React from 'react';
import {Friend} from "../../types/user.types";
import {CheckCircleIcon} from "@heroicons/react/24/outline";

interface Props {
  friend: Friend,
  isSelected: boolean,
  onClick: (id: Friend["id"]) => void,
}

const getImageClassBySelected = (isSelected: boolean): string => {
  const defaultClass = 'rounded-full transition'
  return isSelected ? [defaultClass, 'outline outline-buttonText'].join(' ') : defaultClass
}
const getNameClassBySelected = (isSelected: boolean): string => {
  const defaultClass = 'text-xs transition'
  return isSelected ? [defaultClass, 'font-semibold text-buttonText'].join(' ') : defaultClass;
}
const FriendItem = ({ friend, isSelected, onClick }: Props) => {
  return (
    <button className='flex flex-col gap-0.5 items-center' onClick={() => onClick(friend.id)}>
      <div className='w-12 h-12 relative'>
        <img className={getImageClassBySelected(isSelected)} src={friend.avatar_url!} alt={`${friend.name}'s avatar in Telegram`} />
        {isSelected && <SelectedIcon />}
      </div>
      <p className={getNameClassBySelected(isSelected)}>
        { friend.name }
      </p>
    </button>
  );
};

const SelectedIcon = () => {
  return (
    <div className='absolute bg-buttonText -bottom-1 -right-1 rounded-full w-5 h-5 text-button'>
      <CheckCircleIcon />
    </div>
  )
}

export default FriendItem;