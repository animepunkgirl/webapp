import React, {ReactNode, useContext, useEffect} from 'react';
import telegramContext from "../contexts/TelegramContext";
import {useRecoilValue} from "recoil";
import {isConnectedState} from "../store/user";
import {Toast} from "../ui/Toast/Toast";
import ShareModal from "../components/ShareModal/ShareModal";
import {isProd} from "../helpers/vite";

interface Props {
  children: ReactNode
}

const AppLayout = ({ children }: Props) => {
  const telegram = useContext(telegramContext)
  const isConnected = useRecoilValue(isConnectedState)

  useEffect(() => {
    if(isProd) {
      telegram.ready()
    }
  }, [telegram])

  useEffect(() => {

  }, [isConnected])

  return (
    <>
      {children}
      <ShareModal />
      <Toast />
    </>
  );
};

export default AppLayout;