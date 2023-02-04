import React, {useCallback} from 'react';
import useToast from "../ui/Toast/Toast";

const useCopyToClipboard = (text: string) => {
  const toast = useToast()

  return useCallback(async () => {
    if (!navigator || !window.isSecureContext)
      return;

    await navigator.clipboard.writeText(text)
    toast('Command copied to clipboard')
  }, [window, navigator]);
};

export default useCopyToClipboard;