import React, { useEffect, useState, useCallback } from 'react';

import api from 'services/api';
import BoxContent from '../../components/BoxContent';
import TabGeral from './TabGeral';
import TabAutomoveis from './TabAutomoveis';
import TabMotocicletas from './TabMotocicletas';
import Tabs from '../../components/Tabs';
import TabOutros from './TabOutros';

type Total = {
  total_operando: number;
  total_baixada: number;
  total_inservível: number;
};

type FrotaResponse = {
  [key: string]: {
    [key2: string]: Total;
  };
};

const Home: React.FC = () => {
  const [frota, setFrota] = useState<FrotaResponse>({} as FrotaResponse);

  useEffect(() => {
    async function loadFrota(): Promise<void> {
      const frotaResponse = await api.get<FrotaResponse>('/veiculos', {
        params: {
          frotas: ['administrativa', 'operacional'],
        },
      });
      setFrota(frotaResponse.data);
    }

    loadFrota();
  }, []);

  const total = Object.entries(frota).reduce((nextEspecie, actualEspecie) => {
    const resultadoFrota = Object.values(actualEspecie[1]).reduce(
      (previousEspecie, actualFrota) => {
        const totalFrota = Object.entries(actualFrota);

        const respose = totalFrota.reduce((previousTotal: any, actualTotal) => {
          const [key, value] = actualTotal;
          if (Object.keys(previousTotal).length === 0) return { [key]: value };

          if (!previousTotal[key]) return { ...previousTotal, [key]: value };

          return {
            ...previousTotal,
            [key]: value + previousTotal[key],
          };
        }, {} as Total);

        return { ...previousEspecie, ...respose };
      },
      {},
    );

    return {
      ...nextEspecie,
      [actualEspecie[0]]: resultadoFrota,
    };
  }, {});

  const filterByEspecie = useCallback(
    (especie: string) => {
      const filteredEspecie = Object.entries(frota).reduce(
        (previousTipoEspecie, tipoEspecie) => {
          const tipoFrotaEspecie = Object.entries(tipoEspecie[1]).filter(
            (especieSearch) => especieSearch[0] === especie,
          );

          const objSelectedEspecie = tipoFrotaEspecie.reduce(
            (previous, next) => {
              return {
                ...previous,
                ...next[1],
              };
            },
            {},
          );

          return {
            ...previousTipoEspecie,
            [tipoEspecie[0]]: objSelectedEspecie,
          };
        },
        {},
      );

      return filteredEspecie;
    },
    [frota],
  );

  filterByEspecie('outros');

  const tabs = [
    { key: 'geral', title: 'Geral', componente: <TabGeral frota={total} /> },
    {
      key: 'automoveis',
      title: 'Automóveis',
      componente: <TabAutomoveis frota={filterByEspecie('automóvel')} />,
    },
    {
      key: 'motocicletas',
      title: 'Motocicletas',
      componente: <TabMotocicletas frota={filterByEspecie('motocicleta')} />,
    },
    {
      key: 'outros',
      title: 'Outros',
      componente: <TabOutros frota={filterByEspecie('outros')} />,
    },
  ];

  return (
    <>
      <BoxContent>
        <Tabs initialTab="geral" id="tabs-home" tabs={tabs} />
      </BoxContent>
    </>
  );
};

export default Home;
