import React, {FC, Fragment, ReactNode} from 'react';
import { Transition, Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  isOpen: boolean,
  onClose: () => void,
  title: string,
  children: ReactNode,
  className: string
}

const BottomModal: FC<Props> = ({ isOpen, onClose, title, children, className }) => {
  const dialogPanelClassName = () => {
    const defaultClasses = 'w-full rounded-t-2xl bg-background'
    if(!className)
      return [defaultClasses, 'h-3/4'].join(' ')

    return [defaultClasses, className].join(' ')
  }

  return (
    <Transition
      show={isOpen}
      as={Fragment}
    >
      <Dialog
        onClose={onClose}
        className="relative z-50"
      >
        <Transition.Child
          as={Fragment}
          enter="transition-transform duration-500 ease-in-out"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="transition-transform duration-500 ease-in-out"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
        >
          <div className="fixed inset-0 flex items-center justify-center pt-2">
            <Dialog.Panel className={dialogPanelClassName()}>
              <Dialog.Title className='w-full flex justify-between items-center p-3 text-primary'>
                <p>{title}</p>
                <button onClick={onClose}>
                  <XMarkIcon className='h-6 w-6' />
                </button>
              </Dialog.Title>
              <div className='h-full bg-secondary p-3 text-primary'>
                {children}
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default BottomModal;