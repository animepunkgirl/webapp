import React, {useContext, useEffect} from 'react';
import telegramContext from "../contexts/TelegramContext";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {isConnectedState} from "../store/user";
import {ToastProvider} from "../contexts/ToastContext";

const TelegramLayout = () => {
  const telegram = useContext(telegramContext)
  const isConnected = useRecoilValue(isConnectedState)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // telegram.ready()
    // telegram.BackButton.show()
    // telegram.BackButton.onClick(() => navigate(-1))
  }, [telegram])

  useEffect(() => {

  }, [isConnected])

  return (
    <ToastProvider>
      <div className='container bg-secondary min-h-screen text-primary p-2 relative'>
        <Outlet />
      </div>
    </ToastProvider>
  );
};

export default TelegramLayout;