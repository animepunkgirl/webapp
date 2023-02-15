import React, {useContext, useEffect, useState} from 'react';
import {useRecoilValue} from "recoil";
import {friendListState} from "../../store/user";
import FriendItem from "./FriendItem";
import {Friend} from "../../types/user.types";
import TelegramContext from "../../contexts/TelegramContext";
import {isProd} from "../../helpers/vite";
import MeItem from "./MeItem";

interface Props {
  handleSend: (selected: Friend["id"][], self_send: boolean) => void;
}

const FriendList = ({ handleSend }: Props) => {
  const friends = useRecoilValue(friendListState)
  const tg = useContext(TelegramContext)
  const [selected, setSelected] = useState<Friend["id"][]>([])
  const [selfSend, setSelfSend] = useState<boolean>(false)
  const [mainButtonText, setMainButtonText] = useState('')

  const handleClick = (id: Friend["id"]) => {
    if(selected.includes(id))
      return setSelected(prev => prev.filter(item => item !== id))

    setSelected(prev => ([...prev, id]))
  }

  useEffect(() => {
    const send = () => handleSend(selected, selfSend)
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
      if(!selfSend) {
        setMainButtonText('')
        return
      } else {
        setMainButtonText('Send to your chat')
        return
      }
    }

    if(selected.length === 1) {
      const friend = friends.find(item => item.id === selected[0])
      if(!friend)
        return;

      return setMainButtonText(`Send to ${friend.name}`)
    }

    return setMainButtonText('Send to friends')
  }, [selected, selfSend])

  return (
    <div className='flex gap-2'>
      <MeItem
        isSelected={selfSend}
        onClick={() => setSelfSend(prev => !prev)}
      />
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