import React from 'react';
import { Container } from './styles';

import DashPanel from '../../../components/DashPanel';

type Total = {
  total_operando: number;
  total_baixada: number;
  total_inservível: number;
};

type FrotaResponse = {
  frota: {
    [key: string]: Total;
  };
};

const TabOutros: React.FC<FrotaResponse> = ({ frota }) => {
  const frotaOperando = Object.values(frota).reduce(
    (actualValue, currentValue) => {
      return actualValue + currentValue.total_operando;
    },
    0,
  );

  const frotaBaixada = Object.values(frota).reduce(
    (actualValue, currentValue) => {
      return actualValue + currentValue.total_baixada;
    },
    0,
  );

  const frotaInservivel = Object.values(frota).reduce(
    (actualValue, currentValue) => {
      return actualValue + currentValue.total_inservível;
    },
    0,
  );
  return (
    <Container>
      <DashPanel
        color="#58ACFA"
        operando={frotaOperando}
        baixados={frotaBaixada}
        inserviveis={frotaInservivel}
        title="Total"
      />
      <DashPanel
        color="#aaa"
        operando={frota.operacional?.total_operando}
        baixados={frota.operacional?.total_baixada}
        inserviveis={frota.operacional?.total_inservível}
        title="Operacional"
      />
      <DashPanel
        color="#67C58D"
        operando={frota.administrativa?.total_operando}
        baixados={frota.administrativa?.total_baixada}
        inserviveis={frota.administrativa?.total_inservível}
        title="Administrativo"
      />
    </Container>
  );
};

export default TabOutros;
