import React, {useCallback, useContext} from 'react';
import toastContext from "../contexts/ToastContext";

const useCopyToClipboard = (text: string) => {
  const toast = useContext(toastContext)

  const copy = useCallback(async () => {
    toast('Command copied to clipboard')

    if(!navigator || !window.isSecureContext)
      return;

    await navigator.clipboard.writeText(text)
  }, [window, navigator])

  return copy;
};

export default useCopyToClipboard;