import React from 'react';
import { Switch } from "@headlessui/react";

interface Props {
  active: boolean,
  onChange: (active: boolean) => void
}

const Switcher = ({active, onChange}: Props) => {

  const backgroundClassNames = () => {
    const classes = 'relative flex h-5 w-9 items-center rounded-full'

    if(active)
      return ['bg-secondary', classes].join(' ')

    return ['bg-secondary', classes].join(' ')
  }

  const toggleClassNames = () => {
    const classes = 'inline-block h-4 w-4 transform rounded-full transition'

    if(active)
      return ['bg-button translate-x-4', classes].join(' ')

    return ['translate-x-1 bg-hint', classes].join(' ')
  }

  return (
    <Switch
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