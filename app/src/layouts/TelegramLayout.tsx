import React, {useContext, useEffect} from 'react';
import telegramContext from "../contexts/TelegramContext";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {isConnectedState} from "../store/user";
import {Toast} from "../ui/Toast/Toast";

const TelegramLayout = () => {
  const telegram = useContext(telegramContext)
  const isConnected = useRecoilValue(isConnectedState)
  const navigate = useNavigate()

  useEffect(() => {
    if(import.meta.env.PROD) {
      telegram.ready()
      telegram.BackButton.show()
      telegram.BackButton.onClick(() => navigate(-1))
    }
  }, [telegram])

  useEffect(() => {

  }, [isConnected])

  return (
    <>
      <Outlet />
      <Toast />
    </>
  );
};

export default TelegramLayout;