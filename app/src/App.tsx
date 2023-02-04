import "./App.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {TelegramProvider} from "./contexts/TelegramContext";
import {AuthProvider} from "./contexts/AuthContext";
import {BrowserRouter, Navigate, Route, Routes, useNavigate} from "react-router-dom";
import FeedPage from "./pages/FeedPage";
import {RecoilRoot} from "recoil";
import TelegramLayout from "./layouts/TelegramLayout";
import OAuthPage from "./pages/OAuthPage";
import MessagePage from "./pages/MessagePage";
import {useEffect, useLayoutEffect} from "react";

const App = () => {
  const isOAuthPage = window.location.pathname === '/oauth'

  if(isOAuthPage)
    return <OAuthPage />

  return (
    <TelegramProvider>
      <RecoilRoot>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </RecoilRoot>
    </TelegramProvider>
  )
}

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<TelegramLayout />}>
          <Route path='/feed' element={<FeedPage />} />
          <Route path='/messages' element={<MessagePage />} />
          <Route index element={<NavigateToFeed />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

const NavigateToFeed = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/feed')
  }, [])

  return <>nothing</>
}
export default App
