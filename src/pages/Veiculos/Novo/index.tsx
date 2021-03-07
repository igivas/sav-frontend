import React from 'react';
import TituloPagina from '../../../components/TituloPagina';
import BoxContent from '../../../components/BoxContent';
import FormVeiculo from '../components/FormVeiculo';

import { Container } from './styles';

const VeiculoNovo: React.FC = () => {
  return (
    <Container>
      <TituloPagina title="Cadastro de Novo Veículo" />
      <BoxContent>
        <FormVeiculo action="cadastrar" />
      </BoxContent>
    </Container>
  );
};

export default VeiculoNovo;
