import React, {FC, Fragment, ReactNode} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import {XMarkIcon} from "@heroicons/react/24/outline";

interface Props {
  isOpen: boolean,
  onClose: () => void,
  title: string,
  children: ReactNode,
  headerChildren?: ReactNode
}

const BottomModal: FC<Props> = ({ isOpen, onClose, title, children, headerChildren }) => {
  const dialogPanelClassName = () => {
    return 'w-full rounded-t-2xl bg-background fixed bottom-0 outline-secondary outline outline-1';
  }

  return (
    <Transition
      show={isOpen}
      as={Fragment}
    >
      <Dialog
        onClose={onClose}
        className="fixed z-50"
      >
        <Transition.Child
          className="fixed inset-0 flex items-center justify-center"
          enter="transition-transform duration-500 ease-in-out"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="transition-transform duration-500 ease-in-out"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
        >
            <Dialog.Panel className={dialogPanelClassName()}>
              <Dialog.Title className='w-full flex justify-between items-center p-3 text-primary'>
                <p>{title}</p>
                {headerChildren
                  ?
                  headerChildren
                  :
                  <button onClick={onClose}>
                    <XMarkIcon className='h-6 w-6' />
                  </button>
                }
              </Dialog.Title>
              <div className='h-full bg-secondary p-3 text-primary'>
                {children}
              </div>
            </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default BottomModal;