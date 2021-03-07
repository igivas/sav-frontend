import React from 'react';

import { Container } from './styles';

interface ITituloProps {
  title: string;
}

const TituloPagina: React.FC<ITituloProps> = ({ title }) => {
  return (
    <Container>
      <h3>{title}</h3>
    </Container>
  );
};

export default TituloPagina;
