import React, {useContext, useEffect, useState} from 'react';
import {useRecoilValue} from "recoil";
import {friendListState} from "../../store/user";
import FriendItem from "./FriendItem";
import {Friend} from "../../types/user.types";
import TelegramContext from "../../contexts/TelegramContext";
import {isProd} from "../../helpers/vite";

interface Props {
  handleSend: (selected: Friend["id"][]) => void;
}

const FriendList = ({ handleSend }: Props) => {
  const friends = useRecoilValue(friendListState)
  const tg = useContext(TelegramContext)
  const [selected, setSelected] = useState<Friend["id"][]>([])
  const [mainButtonText, setMainButtonText] = useState('')

  const handleClick = (id: Friend["id"]) => {
    if(selected.includes(id))
      return setSelected(prev => prev.filter(item => item !== id))

    setSelected(prev => ([...prev, id]))
  }

  useEffect(() => {
    const send = () => handleSend(selected)
    if(!mainButtonText) {
      tg.MainButton.hide()
      return () => {
        tg.MainButton.offClick(send)
      }
    }
    tg.MainButton.show()
    tg.MainButton.setText(mainButtonText)
    tg.MainButton.onClick(send)

    return () => {
      tg.MainButton.offClick(send)
    }
  }, [mainButtonText])

  useEffect(() => {
    if(!selected.length) {
      setMainButtonText('')
      return
    }

    if(selected.length === 1) {
      const friend = friends.find(item => item.id === selected[0])
      if(!friend)
        return;

      return setMainButtonText(`Send to ${friend.name}`)
    }

    return setMainButtonText('Send to friends')
  }, [selected])

  return (
    <div className='flex gap-0.5'>
      {friends.map(friend => <FriendItem
        key={friend.id}
        friend={friend}
        isSelected={selected.includes(friend.id)}
        onClick={handleClick}
      />)}
    </div>
  );
};

export default FriendList;