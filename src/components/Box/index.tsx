import React from 'react';
import { Container, Icon } from './styles';

interface IBoxProps {
  label: string;
  value: string;
  color: string;
  icon: string;
}

const Box: React.FC<IBoxProps> = ({ label, value, color, icon }) => {
  return (
    <Container>
      <Icon color={color}>
        <img src={icon} alt="Viaturas" />
      </Icon>
      <div>
        <strong>{label}:</strong>
        <span>{value}</span>
      </div>
    </Container>
  );
};

export default Box;
