import React from 'react';
import { useHistory } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import BoxContent from '../../components/BoxContent';
import DataTable, { IColumns } from '../../components/DataTable';
import TituloPagina from '../../components/TituloPagina';
import api from '../../services/api';

interface IFields {
  [key: string]: string | number;
}

const Veiculos: React.FC = () => {
  const history = useHistory();

  const colunas: IColumns = [
    {
      field: 'placa',
      text: 'Placa',
      type: { name: 'text' },
    },
    {
      field: 'chassi',
      text: 'Chassi',
      type: { name: 'text' },
    },
    {
      field: 'renavam',
      text: 'Renavam',
      type: { name: 'text' },
    },
    {
      field: 'tombo',
      text: 'Tombo',
      type: { name: 'text' },
    },
    {
      field: 'aquisicoes[0].origem_aquisicao',
      text: 'Origem Aquisição',
      type: {
        name: 'enum',
        enum: {
          '0': 'Orgânico',
          '1': 'Locado',
          '2': 'Cedido',
        },
      },
    },
  ];

  function handleClickEditar(row: IFields): void {
    history.push(`/veiculos/editar/${row.id_veiculo}`);
  }

  const options = {
    serverData: {
      url: `/veiculos`,
      headers: { Authorization: api.defaults.headers.authorization },
      serverPagination: true,
    },
    actions: {
      headerText: 'Ações',
      items: [
        {
          icon: <FaSearch size={13} />,
          tooltip: 'visualizar',

          getRow: handleClickEditar,
        },
      ],
    },
    // filters: [
    //   {
    //     field: 'situacao',
    //     label: 'Situação',
    //     options: [
    //       { value: 'Baixada', text: 'Baixada' },
    //       { value: 'Inservível', text: 'Inservível' },
    //       { value: 'Operando', text: 'Operando' },
    //     ],
    //   },
    // ],
    search: {
      searchable: true,
      label: 'Pesquisar',
      fields: ['placa', 'renavam', 'origem_aquisicao'],
    },
  };

  return (
    <>
      <TituloPagina title="Consulta Frota Veicular PMCE" />
      <BoxContent>
        <div>
          <DataTable columns={colunas} options={options} />
        </div>
      </BoxContent>
    </>
  );
};

export default Veiculos;
