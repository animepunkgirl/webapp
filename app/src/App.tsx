import "./App.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {TelegramProvider} from "./contexts/TelegramContext";
import {AuthProvider} from "./contexts/AuthContext";
import FeedPage from "./pages/FeedPage";
import {RecoilRoot} from "recoil";
import AppLayout from "./layouts/AppLayout";
import OAuthPage from "./pages/OAuthPage";

const App = () => {
  const isOAuthPage = window.location.pathname === '/oauth'

  if(isOAuthPage)
    return <OAuthPage />

  return (
    <TelegramProvider>
      <RecoilRoot>
        <AuthProvider>
          <AppLayout>
            <FeedPage />
          </AppLayout>
        </AuthProvider>
      </RecoilRoot>
    </TelegramProvider>
  )
}

export default App
