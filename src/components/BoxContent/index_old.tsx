import React from 'react';
import { Container } from './styles';

const BoxContent: React.FC = ({ children }) => {
  return <Container>{children}</Container>;
};

export default BoxContent;
