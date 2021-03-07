import React, { InputHTMLAttributes } from 'react';

import { IconBaseProps } from 'react-icons';
import { Container, Error } from './styles';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | undefined;
  fontSize?: number;
  register?: any;
  icon: React.ComponentType<IconBaseProps>;
}

const FormInput: React.FC<IProps> = ({
  disabled,
  error,
  register,
  fontSize = 14,
  icon: Icon,
  ...rest
}) => {
  return (
    <Container fontSize={fontSize} error={error}>
      <div className="input">
        <input
          {...rest}
          className={`${disabled && 'disabled'}`}
          disabled={disabled}
          ref={register}
        />
        <button type="button">
          <Icon />
        </button>
      </div>
      {error && <Error>{error}</Error>}
    </Container>
  );
};

export default FormInput;
