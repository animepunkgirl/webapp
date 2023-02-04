import {createContext, FC, ReactNode, useEffect, useState} from "react";
import NoTelegramPage from "../pages/NoTelegramPage";

const TelegramContext = createContext<WebApp>({} as WebApp)
export default TelegramContext;

interface Props {
  children: ReactNode
}

export const TelegramProvider: FC<Props> = ({ children }) => {
  const [telegram, setTelegram] = useState<WebApp | null>(null)

  useEffect(() => {
    if(typeof window !== 'undefined') {
      if(import.meta.env.PROD) {
        setTelegram(window.Telegram.WebApp)
      } else {
        // @ts-ignore
        setTelegram({
          initData: import.meta.env.VITE_DEV_TELEGRAM_USER_INIT_DATA
        })
      }
    }
  }, [])

  if(!telegram || !telegram?.initData)
    return <NoTelegramPage />

  return (
    <TelegramContext.Provider value={telegram}>
      {children}
    </TelegramContext.Provider>
  )
}