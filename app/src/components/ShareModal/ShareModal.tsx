import React, {Suspense, useContext, useRef} from 'react';
import {BottomModal} from "../../ui";
import {useRecoilState} from "recoil";
import {ShareModalState} from "../../store/app";
import FriendList from "./FriendList";
import FriendListSkeleton from "./FriendListSkeleton";
import CaptionField from "./CaptionField";
import useToast from "../../ui/Toast/Toast";
import {Friend} from "../../types/user.types";
import telegramContext from "../../contexts/TelegramContext";
import API from "../../api";

const ShareModal = () => {
  const [shareModal, setShareModal] = useRecoilState(ShareModalState)
  const toast = useToast()
  const tg = useContext(telegramContext)
  const captionRef = useRef<HTMLInputElement>(null)
  const handleClose = () => {
    setShareModal(prev => ({
      ...prev,
      isShown: false
    }))
    tg.MainButton.hide()
  }

  const handleSend = async (selected: Friend["id"][], self_send: boolean) => {
    if(!shareModal.item)
      return;

    tg.MainButton.showProgress()
    setShareModal(prev => ({
      ...prev,
      isShown: false
    }))
    try {
      const caption = captionRef?.current?.value
      await API.Feed.sharePost(shareModal.item, selected, self_send, caption)
      tg.MainButton.hideProgress()
      toast('Post shared!')
      tg.MainButton.hide()
    } catch (e) {
      tg.MainButton.hide()
      toast('Something went wrong', { type: 'error' })
    }
  }

  return (
    <BottomModal
      title='Share'
      isOpen={shareModal.isShown}
      onClose={handleClose}
    >
      <div className='flex flex-col gap-2'>
        <Suspense fallback={<FriendListSkeleton />}>
          <FriendList handleSend={handleSend} />
        </Suspense>
        <CaptionField ref={captionRef} />
      </div>
    </BottomModal>
  );
};

export default ShareModal;