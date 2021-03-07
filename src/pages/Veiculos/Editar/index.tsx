import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import BoxContent from '../../../components/BoxContent';
import TituloPagina from '../../../components/TituloPagina';
import Tabs from '../../../components/Tabs';
import TabCaracteristicas from './TabCaracteristicas';
import TabPrefixos from './TabPrefixos';
import TabSituacoes from './TabSituacoes';
import TabMovimentacoes from './TabMovimentacoes';
// import TabKms from './TabKms';
import { useVeiculo } from '../../../contexts/VeiculoContext';
import TabIdentificadores from './TabIdentificadores';

const VeiculoEditar: React.FC = () => {
  const match: any = useRouteMatch('/veiculos/editar/:id');
  const { id } = match?.params;

  const { veiculo, loadVeiculo } = useVeiculo();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load(): Promise<void> {
      await loadVeiculo(id);

      setLoading(false);
    }
    load();
    // setChassi(veiculo?.chassi);
  }, [id, loadVeiculo]);

  const tabs = [
    {
      key: 'caracteristicas',
      title: 'Características',
      componente: <TabCaracteristicas />,
    },
    {
      key: 'prefixos',
      title: 'Prefixos',
      componente: <TabPrefixos />,
    },
    {
      key: 'identificadores',
      title: 'Identificadores',
      componente: <TabIdentificadores />,
    },
    { key: 'situacao', title: 'Situações', componente: <TabSituacoes /> },

    {
      key: 'movimentacoes',
      title: 'Movimentações',
      componente: <TabMovimentacoes />,
    },

    // {
    //   key: 'manutencoes',
    //   title: 'Manutenções',
    //   componente: <h3> TabManutencoes</h3>,
    // },

    // { key: 'pneus', title: 'Pneus', componente: <h3> TabPneus</h3> },

    // { key: 'km', title: 'Km', componente: <TabKms /> },

    // { key: 'cautela', title: 'Cautela', componente: <h3> TabCautela</h3> },
  ];

  return (
    <>
      {!loading && (
        <>
          <TituloPagina
            title={`Ficha do Veículo: ${veiculo?.veiculoMarca.nome} ${
              veiculo?.veiculoModelo.nome
            } ${veiculo.placa ? `- ${veiculo.placa}` : ''}`}
          />
          <BoxContent>
            <Tabs
              initialTab="caracteristicas"
              id="tabs-veiculos-editar"
              tabs={tabs}
            />
          </BoxContent>
        </>
      )}
    </>
  );
};

export default VeiculoEditar;
