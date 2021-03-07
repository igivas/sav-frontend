import React, { InputHTMLAttributes } from 'react';

import { Input, Error } from './styles';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | undefined;
  fontSize?: number;
  register?: any;
}

const FormInput: React.FC<IProps> = ({
  disabled,
  error,
  register,
  fontSize = 14,
  ...rest
}) => {
  return (
    <>
      <Input
        {...rest}
        fontSize={fontSize}
        className={`${disabled && 'disabled'}`}
        disabled={disabled}
        ref={register}
        error={error}
      />

      {error && <Error>{error}</Error>}
    </>
  );
};

export default FormInput;
