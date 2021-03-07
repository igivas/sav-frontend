import React from 'react';

import { Input, Error } from './styles';

interface IProps {
  error?: string | undefined;
  disabled?: boolean;
  value: number;
  onChange(event: any, value: any, maskedValue: any): void;
  onBlur?(event: any, value: any, maskedValue: any): void;
}

const currencyConfig = {
  locale: 'pt-BR',
  formats: {
    number: {
      BRL: {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};

const FormInput: React.FC<IProps> = ({ error, disabled, ...rest }) => {
  return (
    <>
      <Input
        currency="BRL"
        className={`${disabled && 'disabled'}`}
        config={currencyConfig}
        error={error}
        disabled={disabled}
        {...rest}
      />
      {error ? <Error>{error}</Error> : null}
    </>
  );
};

export default FormInput;
