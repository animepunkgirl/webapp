import React, {useState} from 'react';
import Linkify from 'linkify-react';
import {Opts} from "linkifyjs";
import { ArrowDownIcon } from '@heroicons/react/24/outline'
import ExpandTextButton from "../ExpandTextButton";

interface Props {
  className: string,
  text: string
}

const linkifyOptions: Opts = {
  className: 'text-link',
  defaultProtocol: 'https'
}

const getClassName = (className: string, isEnlarged: boolean, isCompact: boolean) => {
  if(isEnlarged)
    return [className, 'text-lg'].join(' ')

  if(isCompact)
    return [className, 'h-32 relative overflow-hidden'].join(' ')

  return className;
}

const FormattedText = ({ className, text }: Props) => {
  const [isCompact, setIsCompact] = useState(text?.length >= 240)
  const isEnlarged = text?.length <= 140;

  if(!text)
    return null;

  return (
    <>
      <Linkify as='p' options={linkifyOptions} className={getClassName(className, isEnlarged, isCompact)}>
        {text}
        <ExpandTextButton isShown={isCompact} onChange={() => setIsCompact(false)} />
      </Linkify>
    </>
  );
};

export default FormattedText;