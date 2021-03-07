import React from 'react';
import { Chart } from 'react-google-charts';
import { Container, ContainerGrafics } from './styles';

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

const TabGeral: React.FC<FrotaResponse> = ({ frota }) => {
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
    <>
      <Container>
        <DashPanel
          color="#58ACFA"
          operando={frotaOperando}
          baixados={frotaBaixada}
          inserviveis={frotaInservivel}
          title="Frota Total"
        />
        <DashPanel
          color="#aaa"
          operando={frota.operacional?.total_operando || 0}
          baixados={frota.operacional?.total_baixada || 0}
          inserviveis={frota.operacional?.total_inservível || 0}
          title="Frota Operacional"
        />
        <DashPanel
          color="#67C58D"
          operando={frota.administrativa?.total_operando || 0}
          baixados={frota.administrativa?.total_baixada || 0}
          inserviveis={frota.administrativa?.total_inservível || 0}
          title="Frota Administrativa"
        />
      </Container>
      <ContainerGrafics>
        <Chart
          width="100%"
          height="300px"
          chartType="PieChart"
          loader={<div>Carregando o gráfico</div>}
          data={[
            ['Situação', 'Quantidade'],
            ['Operando', 300],
            ['Baixada', 56],
            ['Inservível', 15],
          ]}
          options={{
            title: 'Situação das Viaturas',
            pieSliceText: 'label',

            slices: {
              0: { color: '#14a64f' },
              1: { color: 'orange' },
              2: { color: 'red' },
            },
          }}
          rootProps={{ 'data-testid': '1' }}
        />
      </ContainerGrafics>
      <ContainerGrafics>
        <Chart
          width="100%"
          height="400px"
          chartType="Bar"
          loader={<div>Loading Chart</div>}
          data={[
            ['Situação', 'Orgânica', 'Locada'],
            ['Operando', frotaOperando, 100],
            ['Baixada', frotaBaixada, 10],
            ['Inservível', frotaInservivel, 0],
          ]}
          options={{
            // Material design options
            chart: {
              title: 'Situação das Viaturas',
              subtitle: 'Situação entre as viaturas locadas e orgânicas',
            },
          }}
          // For tests
          rootProps={{ 'data-testid': '2' }}
        />
      </ContainerGrafics>
    </>
  );
};

export default TabGeral;
