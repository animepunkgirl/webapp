import React, {ForwardedRef, forwardRef} from 'react';

const CaptionField = forwardRef((props, ref: ForwardedRef<HTMLInputElement>) => {
  return (
    <input
      ref={ref}
      type='text'
      className='w-full py-1 bg-background rounded mx-auto pl-2 text-sm text-primary'
      placeholder='Enter caption...'
    />
  );
});

export default CaptionField;