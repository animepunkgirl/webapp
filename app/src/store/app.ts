import {atom} from "recoil";

interface ToastState {
  isShown: boolean,
  message: string
}

export const ToastState = atom<ToastState>({
  key: 'isToastShownState',
  default: {
    isShown: false,
    message: ''
  }
})