import React, { TextareaHTMLAttributes } from 'react';

import { FormTextArea, Error } from './styles';

interface IProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string | undefined;
  register?: any;
}

const TextArea: React.FC<IProps> = ({ error, register, disabled, ...rest }) => {
  return (
    <>
      <FormTextArea
        {...rest}
        className={`${disabled && 'disabled'}`}
        error={error}
        ref={register}
        disabled={disabled}
      />
      {error ? <Error>{error}</Error> : null}
    </>
  );
};

export default TextArea;
