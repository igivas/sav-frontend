import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DataTable, { IColumns } from '../../../../components/DataTable';
import { useVeiculo } from '../../../../contexts/VeiculoContext';

import { Container } from './styles';

const TabKms: React.FC = () => {
  const { veiculo } = useVeiculo();

  const kmsFormated = veiculo.kms.map((km) => {
    return {
      ...km,
      criado_em: format(new Date(String(km.criado_em)), "dd'/'MM'/'yyyy", {
        locale: ptBR,
      }),
    };
  });

  const colunas: IColumns = [
    {
      field: 'criado_em',
      text: 'Data',
      type: { name: 'date', format: 'dd/MM/yyyy' },
    },

    {
      field: 'km_atual',
      text: 'KM',
      type: { name: 'text'},
    },
  ];

  function handleClickEditar(row: object): void {
    // console.log('minha row', row);
    // history.push('/veiculos/editar');
  }

  const options = {
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
    filters: [
      // {
      //   field: 'situacao',
      //   label: 'Situação',
      //   options: [
      //     { value: 'Baixada', text: 'Baixada' },
      //     { value: 'Inservível', text: 'Inservível' },
      //     { value: 'Operando', text: 'Operando' },
      //   ],
      // },
    ],
    search: {
      searchable: true,
      label: 'Pesquisar',
      fields: ['criado_em', 'km_atual'],
    },
  };
  return (
    <Container>
      <DataTable columns={colunas} data={kmsFormated} options={options} />
    </Container>
  );
};

export default TabKms;
