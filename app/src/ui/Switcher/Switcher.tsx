import React from 'react';
import { Switch } from "@headlessui/react";

interface Props {
  id?: string,
  active: boolean,
  onChange: (active: boolean) => void
}

const Switcher = ({id, active, onChange}: Props) => {

  const backgroundClassNames = () => {
    const classes = 'relative flex h-5 w-9 items-center rounded-full'

    if(active)
      return ['bg-button', classes].join(' ')

    return ['bg-secondary', classes].join(' ')
  }

  const toggleClassNames = () => {
    const classes = 'inline-block h-4 w-4 transform rounded-full transition bg-buttonText'

    if(active)
      return ['translate-x-4', classes].join(' ')

    return ['translate-x-1 opacity-50', classes].join(' ')
  }

  return (
    <Switch
      id={id}
      checked={active}
      onChange={onChange}
      className={backgroundClassNames()}
    >
      <span className="sr-only">Enable notifications</span>
      <span
        className={toggleClassNames()}
      />
    </Switch>
  );
};

export default Switcher;