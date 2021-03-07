import React from 'react';
import { Container } from './styles';

interface IFormGroupProps {
  name?: string;
  cols?: [number, number, number];
}

const FormGroup: React.FC<IFormGroupProps> = ({ name, cols, children }) => {
  return (
    <Container cols={cols}>
      <label htmlFor={name}>{name}</label>
      {children}
    </Container>
  );
};

export default FormGroup;
