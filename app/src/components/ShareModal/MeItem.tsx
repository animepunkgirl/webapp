import React from 'react';
import {CheckCircleIcon, DevicePhoneMobileIcon} from "@heroicons/react/24/outline";
import {useRecoilValue} from "recoil";
import {initDataState} from "../../store/user";

interface Props {
  isSelected: boolean,
  onClick: () => void,
}

const getImageClassBySelected = (isSelected: boolean): string => {
  const defaultClass = 'w-12 h-12 relative rounded-full transition bg-button flex items-center justify-center'
  return isSelected ? [defaultClass, 'outline outline-buttonText'].join(' ') : defaultClass
}
const getNameClassBySelected = (isSelected: boolean): string => {
  const defaultClass = 'text-xs transition'
  return isSelected ? [defaultClass, 'font-semibold text-buttonText'].join(' ') : defaultClass;
}
const MeItem = ({ isSelected, onClick }: Props) => {
  const initData = useRecoilValue(initDataState)
  return (
    <button className='flex flex-col gap-0.5 items-center' onClick={() => onClick()}>
      <div className={getImageClassBySelected(isSelected)} >
        <DevicePhoneMobileIcon className='w-7 h-7'/>
        {isSelected && <SelectedIcon />}
      </div>
      <p className={getNameClassBySelected(isSelected)}>
        Me
      </p>
    </button>
  );
};

const SelectedIcon = () => {
  return (
    <div className='absolute bg-buttonText -bottom-1 -right-1 rounded-full w-5 h-5 text-button'>
      <CheckCircleIcon />
    </div>
  )
}

export default MeItem;