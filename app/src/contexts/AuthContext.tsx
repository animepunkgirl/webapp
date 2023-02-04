import {createContext, FC, ReactNode, useContext, useEffect, useState} from "react";
import TelegramContext from "./TelegramContext";
import API from "../api";
import NotAuthorizedPage from "../pages/NotAuthorizedPage";
import {useRecoilState} from "recoil";
import {initDataState, isConnectedState} from "../store/user";

const AuthContext = createContext(null)
export default AuthContext;

interface Props {
  children: ReactNode
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const telegram = useContext(TelegramContext)
  const [initData, setInitData] = useRecoilState(initDataState)
  const [token, setToken] = useState('')
  const [isConnected, setIsConnected] = useRecoilState(isConnectedState)

  useEffect(() => {
    (async () => {
      try {
        const data = await API.User.authorize(telegram.initData)
        setToken(data.token)
        setInitData(data.init_data)
        setIsConnected(data.is_connected)
      } catch (e) {
        setToken('unauthorized')
      }
    })()
  }, [telegram])

  if(!token)
    return null;

  if(token === 'unauthorized')
    return <NotAuthorizedPage />

  return (
    <AuthContext.Provider value={null}>
      {children}
    </AuthContext.Provider>
  )
}