import {createContext, FC, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import { Transition } from "@headlessui/react";

type ToastFunction = (message: string) => void;

const ToastContext = createContext<ToastFunction>(() => {})
export default ToastContext;

interface Props {
  children: ReactNode
}

// TODO: Transfer to recoil effects functions (don't use provider for this) [ useToast => useRecoilValue(toast) ]
const DURATION = 1000
export const ToastProvider = ({ children }: Props) => {
  const [message, setMessage] = useState('')
  const [isShown, setIsShown] = useState(false)

  const toast = useCallback((message: string) => {
    if(!isShown) {
      setMessage(message)
      setIsShown(true)

      setTimeout(() => {
        setIsShown(false)
      }, DURATION)
    }
  }, [isShown])

  return (
    <ToastContext.Provider value={toast}>
      <>
        {children}
        <Toast message={message} isShown={isShown} />
      </>
    </ToastContext.Provider>
  )
}

interface ToastProps {
  isShown: boolean,
  message: string
}

const Toast = ({ isShown, message }: ToastProps) => {
  return (
    <Transition
      show={isShown}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-x-0 bottom-4 z-100 mx-auto  flex items-center w-full max-w-xs p-4 space-x-4 text-buttonText bg-background divide-x divide-gray-200 rounded-lg shadow"
           role="alert">
        <svg aria-hidden="true" className="w-5 h-5 text-blue-600 dark:text-blue-500" focusable="false" data-prefix="fas"
             data-icon="paper-plane" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="currentColor"
                d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"></path>
        </svg>
        <div className="pl-4 text-sm font-normal">{message}</div>
      </div>
    </Transition>
  )
}