import React from 'react';
// import Box from '../Box';

import { Container, Header, Content, Item } from './styles';

interface IBoxProps {
  label: string;
  value: string;
  color: string;
}

interface IDashPanelProps {
  title: string;
  // boxes: BoxProps[];
  color: string;
  operando: number;
  baixados: number;
  inserviveis: number;
}

const DashPanel: React.FC<IDashPanelProps> = ({
  color,
  title,
  operando,
  baixados,
  inserviveis,
}) => {
  return (
    <Container>
      <Header color={color}>
        <div>
          <div>{title}</div>
          <div>{operando + baixados + inserviveis}</div>
        </div>
        <div id="detalhes">Detalhes</div>
      </Header>
      <Content color={color}>
        <Item color={color}>
          <div>Operando</div>
          <div>{operando}</div>
        </Item>
        <Item color={color}>
          <div>Baixados</div>
          <div>{baixados}</div>
        </Item>
        <Item color={color}>
          <div>Inservíveis</div>
          <div>{inserviveis}</div>
        </Item>
      </Content>
    </Container>
  );
};

export default DashPanel;
