import React from 'react';

import { NumberFormatProps } from 'react-number-format';

import { Input, Error } from './styles';

interface IProps extends NumberFormatProps {
  error: string | undefined;
}

const FormInput: React.FC<IProps> = ({ disabled, error, ...rest }) => {
  return (
    <>
      <Input
        className={`${disabled && 'disabled'}`}
        disabled={disabled}
        error={error}
        {...rest}
      />
      {error ? <Error>{error}</Error> : null}
    </>
  );
};

export default FormInput;
