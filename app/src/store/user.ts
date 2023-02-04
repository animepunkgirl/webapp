import {atom} from "recoil";
import {InitData} from "../types/user.types";

export const initDataState = atom<InitData>({
  key: 'initDataState',
  default: null as unknown as InitData // It's never empty because user always authorized
})

export const isConnectedState = atom({
  key: 'isConnectedState',
  default: false,
})
