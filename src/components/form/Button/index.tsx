import React, { ButtonHTMLAttributes } from 'react';
import { IconBaseProps } from 'react-icons';

import { ButtonContainer } from './styles';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'red' | 'yellow' | 'green' | 'default';
  icon?: React.ComponentType<IconBaseProps>;
}

const Button: React.FC<IButtonProps> = ({
  children,
  color = 'default',
  icon: Icon,
  disabled,
  ...rest
}) => {
  return (
    <ButtonContainer
      className={`button ${color}`}
      {...rest}
      disabled={disabled}
    >
      {children}

      {Icon && <Icon />}
    </ButtonContainer>
  );
};

export default Button;
