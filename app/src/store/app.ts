import {atom} from "recoil";
import {Post} from "../types/feed.types";

type ToastType = 'info' | 'error'

interface ToastState {
  isShown: boolean,
  message: string
  type: ToastType
}

export const ToastState = atom<ToastState>({
  key: 'isToastShownState',
  default: {
    isShown: false,
    message: '',
    type: 'info'
  }
})

interface ShareModalState {
  isShown: boolean,
  item: Post | null
}

export const ShareModalState = atom<ShareModalState>({
  key: 'ShareModalState',
  default: {
    isShown: false,
    item: null
  }
})