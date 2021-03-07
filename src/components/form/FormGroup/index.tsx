import React from 'react';
import { Container } from './styles';

interface IFormGroupProps {
  name?: string;
  cols?: [number, number, number];
  required?: boolean;
}

const FormGroup: React.FC<IFormGroupProps> = ({
  name,
  cols,
  required,
  children,
}) => {
  return (
    <Container cols={cols}>
      <div>
        <label htmlFor={name}>{name}</label>
        {required && <span id="required">*</span>}
      </div>
      {children}
    </Container>
  );
};

export default FormGroup;
