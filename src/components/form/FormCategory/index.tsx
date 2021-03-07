import React from 'react';

import { Container } from './styles';

const FprmCategory: React.FC = ({ children }) => {
  return (
    <Container>
      <h3>{children}</h3>
      <hr />
    </Container>
  );
};

export default FprmCategory;
