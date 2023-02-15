import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Transition} from "@headlessui/react";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {ToastState} from "../../store/app";
import { XCircleIcon } from "@heroicons/react/24/outline";

interface Options {
  type: 'info' | 'error'
}
const useToast = () => {
  const [toast, setToast] = useRecoilState(ToastState)

  return (message: string, options?: Options) => {
    setToast({
      isShown: true,
      message,
      type: options?.type || 'info'
    })
  }
}
export default useToast;

const TOAST_DURATION = 1400;
const toastContainerClassName = 'fixed inset-x-0 bottom-4 z-50 mx-auto h-12 flex items-center w-full max-w-xs p-4 space-x-4 text-buttonText bg-secondary divide-x divide-hint rounded-lg shadow select-none cursor-pointer transition-transform'

export const Toast = () => {
  const [toast, setToast] = useRecoilState(ToastState)
  const timeout = useRef<number>()
  const [pulseClassName, setPulseClassName] = useState('')

  // Handle multiply clicks on toast
  const pulse = () => {
    setPulseClassName('duration-75 scale-95')
    setTimeout(() => {
      setPulseClassName('')
    }, 100)
  }

  const hideToast = useCallback(() => {
    setToast(prev => ({
      isShown: false,
      message: prev.message,
      type: 'info'
    }))
  }, [toast])

  useEffect(() => {
    if(toast.isShown) {
      timeout.current = setTimeout(() => {
        hideToast()
      }, TOAST_DURATION)

      return () => {
        clearTimeout(timeout.current)
        pulse()
      }
    }
  }, [toast.isShown, hideToast])

  return (
    <>
      <Transition
        show={toast.isShown}
        role='alert'
        className={[toastContainerClassName, pulseClassName].join(' ')}
        enter="duration-150"
        onClick={() => hideToast()}
        enterFrom="translate-y-10"
        enterTo="translate-y-0"
        leave="duration-300"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-32"
      >
        {toast.type === 'info' ? <TelegramIcon /> : <ErrorIcon /> }
        <div className="pl-4 text-sm font-normal">
          {toast.message}
        </div>
      </Transition>
    </>
  )
}

const TelegramIcon = () => {
  return (
    <svg aria-hidden="true" className="w-5 h-5 text-blue-600 dark:text-blue-500" focusable="false" data-prefix="fas"
         data-icon="paper-plane" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"
      ></path>
    </svg>
  )
}

const ErrorIcon = () => {
  return (
    <XCircleIcon className="w-7 h-7 text-red-600" />
  )
}