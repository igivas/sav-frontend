import React from 'react';
import Box from '../Box';

import { Container } from './styles';

interface IBoxProps {
  label: string;
  value: string;
  color: string;
}

interface IFrotaTipoProps {
  title: string;
  boxes: IBoxProps[];
  icon: string;
}

const FrotaTipo: React.FC<IFrotaTipoProps> = ({ title, boxes, icon }) => {
  return (
    <Container>
      <h3>{title}</h3>

      {boxes.map((box) => (
        <Box
          key={box.label}
          color={box.color}
          icon={icon}
          label={box.label}
          value={box.value}
        />
      ))}
    </Container>
  );
};

export default FrotaTipo;
