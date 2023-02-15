import {atom, selector} from "recoil";
import {Friend, InitData} from "../types/user.types";
import API from "../api";

export const initDataState = atom<InitData>({
  key: 'initDataState',
  default: null! // It's never empty because user always authorized
})

export const isConnectedState = atom({
  key: 'isConnectedState',
  default: false,
})

export const friendListState = selector<Friend[]>({
  key: 'friendListState',
  get: async ({ get }) => {
    return API.User.getFriends()
  }
})

