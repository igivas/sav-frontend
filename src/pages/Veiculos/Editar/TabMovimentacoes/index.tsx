import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { MovimentacaoOpm, useVeiculo } from 'contexts/VeiculoContext';
import FormCategory from 'components/form/FormCategory';
import Row from 'components/form/Row';
import FormGroup from 'components/form/FormGroup';
import Input from 'components/form/FormInput';
import api from 'services/api';
import { ValueType } from 'react-select';
import ReactSelect from 'components/form/ReactSelect';
// import { useMovimentacao } from 'contexts/MovimentacaoContext';
import { FaSearch } from 'react-icons/fa';
import { BiTransfer } from 'react-icons/bi';
import PanelBottomActions from 'components/PanelBottomActions';
// import { useToast } from '@chakra-ui/react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { format } from 'date-fns';
import DataTable, { IColumns } from '../../../../components/DataTable';
import Button from '../../../../components/form/Button';
import Modal from '../../../../components/Modal';
import { Container, Form } from './styles';

type OpmFormat = {
  _id_opm: number;
  _nome: string;
  _comandante?: string;
  _sigla: string;
  _lob: number;
};

type GraduacaoFormat = {
  id: number;
  nome: string;
  sigla: string;
};

type UsuarioFormat = {
  id_pf_pm: string;
  cpf: string;
  matricula: string;
  nome: string;
  graduacao: GraduacaoFormat;
};

type MovimentacaoFaseFormat = {
  id_movimentacao_fase: number;
  id_tipo_fase: number;
  nome_fase: string;
  obs?: string;
  criado_em: Date;
};

type RequestMovimentacaoFormat = {
  id_movimentacao: number;
  criado_em: Date;
  autoridade_origem?: string;
  autoridade_destino?: string;
  movimentacoesFase: MovimentacaoFaseFormat[];
  opm_destino: OpmFormat;
  opm_origem: OpmFormat;
  usuario_origem: UsuarioFormat;
  usuario_destino: UsuarioFormat;
};

interface IVeiculo {
  id_veiculo: string;
  marca: string;
  modelo: string;
  placa: OptionType;
  renavam: OptionType;
}

const schemaTransferencia = Yup.object().shape({
  id_veiculo: Yup.string().required('Esse campo é requerido'),
  id_tipo_movimentacao: Yup.string().required('Esse campo é requerido'),
  id_tipo_movimentacao_fase: Yup.string().required('Esse campo é requerido'),
  id_opm_origem: Yup.string().required('Esse campo é requerido'),
  id_opm_destino: Yup.string().required('Esse campo é requerido'),
});

type IFormInputsTransferencia = Yup.InferType<typeof schemaTransferencia>;

type OptionType = {
  label: string;
  value: string;
};

type ModalFormat = 'pesquisar' | 'editar';

const TabMovimentacoes: React.FC = () => {
  const methods = useForm<IFormInputsTransferencia>({
    resolver: yupResolver(schemaTransferencia),
  });

  const toast = useToast();
  const { control, setValue } = methods;

  const match: any = useRouteMatch('/veiculos/editar/:id');
  const { id } = match?.params;

  const history = useHistory();

  const { veiculo } = useVeiculo();

  // const { createMovimentacao } = useMovimentacao();
  // const toast = useToast();

  const [
    selectedMovimentacao,
    setSelectedMovimentacao,
  ] = useState<MovimentacaoOpm>({} as MovimentacaoOpm);

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (): void => {
    setShowModal(true);
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
  };

  const [tipoModal, setTipoModal] = useState<ModalFormat>();

  const [
    defaultTipoMovimentacao,
    setDefaultTipoMovimentacao,
  ] = useState<string>('');

  const [
    selectMovimentacao,
    setSelectMovimentacao,
  ] = useState<RequestMovimentacaoFormat>({} as RequestMovimentacaoFormat);

  useEffect(() => {
    setValue(
      'id_tipo_movimentacao',
      selectedMovimentacao.id_movimentacao?.toString(),
    );
    setDefaultTipoMovimentacao(selectedMovimentacao.tipoMovimentacao?.nome);
  }, [setValue, selectedMovimentacao]);

  const [defaultOpms, setDefaultOpms] = useState<{
    opm_origem: string;
    opm_destino: string;
  }>({} as { opm_origem: string; opm_destino: string });

  useEffect(() => {
    setDefaultOpms({
      opm_origem: selectedMovimentacao.opm_origem?.nome,
      opm_destino: selectedMovimentacao.opm_destino?.nome,
    });
  }, [selectedMovimentacao.opm_origem, selectedMovimentacao.opm_destino]);

  /* const [canMovimentate, setCanMovimentate] = useState(
    !!selectedMovimentacao.movimentacao?.nome
      .toLowerCase()
      .trim()
      .includes('oferta'),
  ); */

  // const canMovimentate = (): void => {
  //   history.push(`veiculos/movimentar/${id}`);
  // };

  const [tiposFasesMovimentacao, setTiposFasesMovimentacao] = useState<
    OptionType[]
  >([]);

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const fasesTiposMovimentacoes = await api.get('movimentacoes/tipos', {
          params: {
            tipoMovimentacaoNome: selectedMovimentacao.tipoMovimentacao?.nome,
          },
        });

        if (!Array.isArray(fasesTiposMovimentacoes)) {
          const responseFormated = fasesTiposMovimentacoes.data.fases.map(
            (fase: any) => ({
              label: fase.nome_fase,
              value: fase.id_tipo_movimentacao_fase.toString(),
            }),
          );
          setTiposFasesMovimentacao(responseFormated);
        }

        // setTiposFasesMovimentacao(responseFormated);
      } catch (error) {
        console.log(error);
      }
    }
    load();
  }, [selectedMovimentacao.tipoMovimentacao]);

  const colunas: IColumns = [
    {
      field: 'fases[0].criado_em',
      text: 'Data',
      type: { name: 'date', format: 'dd/MM/yyyy' },
    },
    {
      field: 'opm_origem._nome',
      text: 'OPM Origem',
      type: { name: 'text' },
    },

    {
      field: 'opm_destino._nome',
      text: 'OPM Destino',
      type: { name: 'text' },
    },
    {
      field: 'tipo_movimentacao',
      text: 'Tipo de Movimentacao',
      type: {
        name: 'enum',
        enum: {
          '1': 'Transferência',
          '2': 'Empréstimo',
          '3': 'Cessão',
          '4': 'Manutenção',
          '5': 'Descarga',
          '6': 'Devolucao de Locação',
        },
      },
    },
    {
      type: { name: 'text' },
      field: 'fases[0].nome',
      text: 'Fase atual da Movimentacao',
    },
    {
      field: 'prev_devolucao',
      text: 'Prev Devolução',
      type: { name: 'text' },
    },
    {
      field: 'status',
      text: 'Status',
      type: { name: 'text' },
    },
  ];

  function handleClickEditar(row: any): void {
    const movimentacaoOpm = veiculo.movimentacoes.find(
      (movimentacao) => movimentacao.id_movimentacao === row.id_movimentacao,
    );

    movimentacaoOpm && setTipoModal('editar');

    movimentacaoOpm && setSelectedMovimentacao(movimentacaoOpm);
    handleOpenModal();
  }

  async function handleClickSearchMovimentacao(row: any): Promise<void> {
    const request = await api.get<RequestMovimentacaoFormat>(
      `/movimentacoes/${row.id_movimentacao}`,
    );

    setSelectMovimentacao(request.data);

    setTipoModal('pesquisar');
    handleOpenModal();
  }

  async function handleClickMovimentacar(): Promise<void> {
    try {
      await api.get('/check', {
        params: {
          query: {
            movimentacao: {
              id_veiculo: veiculo.id_veiculo,
            },
          },
        },
      });
      history.push(`/veiculos/movimentar/${id}`, {
        veiculo: {
          id_veiculo: veiculo.id_veiculo,
          marca: veiculo.veiculoMarca.nome,
          modelo: veiculo.veiculoModelo.nome,
          placa: {
            value: veiculo.id_veiculo,
            label: veiculo.placa,
          },
          renavam: {
            value: veiculo.id_veiculo,
            label: veiculo.renavam,
          },
          chassi: veiculo.chassi,
          prefixo: veiculo.prefixos,
        },
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description:
          error.response.data.message ||
          'Ocorreu um erro ao tentar checar a movimentação.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }

  const options = {
    actions: {
      headerText: 'Ações',
      items: [
        {
          icon: <FaSearch size={13} />,
          tooltip: 'visualizar',

          getRow: handleClickSearchMovimentacao,
        },

        {
          icon: <BiTransfer size={13} />,
          tooltip: 'transferir',

          getRow: handleClickEditar,
        },
      ],
    },

    search: {
      searchable: true,
      label: 'Pesquisar',
      fields: ['placa', 'renavam'],
    },
  };

  return (
    <Container>
      <DataTable
        columns={colunas}
        options={options}
        data={veiculo.movimentacoes}
      />

      {tipoModal && (
        <Modal
          title={
            tipoModal === 'pesquisar' ? 'Ficha da Movimentacao' : 'Movimentacao'
          }
          isOpen={showModal}
          handleCloseModal={handleCloseModal}
          width={tipoModal === 'pesquisar' ? 900 : 700}
          height={400}
        >
          {tipoModal === 'editar' ? (
            <FormProvider {...methods}>
              <Form>
                <div>
                  <FormCategory>Dados da Movimentacao</FormCategory>
                  <Row>
                    <FormGroup
                      required
                      name="Tipo de Movimentacao"
                      cols={[4, 4, 12]}
                    >
                      <Input value={defaultTipoMovimentacao} disabled />
                    </FormGroup>

                    <FormGroup
                      required
                      name="Data da Movimentacao"
                      cols={[4, 4, 12]}
                    >
                      <Input value={defaultOpms.opm_origem} disabled />
                    </FormGroup>
                  </Row>
                  <Row>
                    <FormGroup required name="Opm de Origem" cols={[6, 6, 12]}>
                      <Input value={defaultOpms.opm_origem} disabled />
                    </FormGroup>

                    <FormGroup required name="Opm de Destino" cols={[6, 6, 12]}>
                      <Input value={defaultOpms.opm_destino} disabled />
                    </FormGroup>
                  </Row>

                  <>
                    <FormCategory>Movimentar veiculo</FormCategory>
                    <Row>
                      <FormGroup
                        required
                        name="Aceita a Oferta"
                        cols={[6, 6, 12]}
                      >
                        <Controller
                          name="id_tipo_movimentacao_fase"
                          control={control}
                          render={({ onChange, value }) => (
                            <ReactSelect
                              optionsSelect={tiposFasesMovimentacao}
                              value={tiposFasesMovimentacao.find(
                                (option) => option.value === value,
                              )}
                              onChange={(option: ValueType<OptionType>) => {
                                const optionSelect = option as OptionType;
                                onChange(optionSelect.value);
                              }}
                            />
                          )}
                        />
                      </FormGroup>
                    </Row>
                  </>
                </div>
              </Form>
            </FormProvider>
          ) : (
            <FormProvider {...methods}>
              <div>
                <FormCategory>Dados da Movimentacao</FormCategory>
                <Row>
                  <FormGroup required name="Opm de Origem" cols={[6, 6, 12]}>
                    <Input
                      value={selectMovimentacao.opm_origem._nome}
                      disabled
                    />
                  </FormGroup>

                  <FormGroup required name="Opm de Destino" cols={[6, 6, 12]}>
                    <Input
                      value={selectMovimentacao.opm_destino._nome}
                      disabled
                    />
                  </FormGroup>
                </Row>

                {selectMovimentacao.movimentacoesFase.map(
                  (movimentacaoFase) => (
                    <>
                      <FormCategory key={movimentacaoFase.id_movimentacao_fase}>
                        {format(
                          new Date(movimentacaoFase.criado_em),
                          'dd/MM/yyyy',
                        )}
                      </FormCategory>
                      <Row key={movimentacaoFase.id_movimentacao_fase}>
                        <FormGroup required name="Fase" cols={[4, 4, 12]}>
                          <Input
                            value={`${movimentacaoFase.nome_fase}`}
                            disabled
                          />
                        </FormGroup>

                        <FormGroup
                          required
                          name={
                            movimentacaoFase.nome_fase
                              .toLowerCase()
                              .includes('oferta')
                              ? 'Criado Por'
                              : `${movimentacaoFase.nome_fase} por`
                          }
                          cols={[4, 4, 12]}
                        >
                          <Input
                            value={
                              movimentacaoFase.nome_fase
                                .toLowerCase()
                                .includes('oferta')
                                ? `${selectMovimentacao.usuario_origem.graduacao.sigla} ${selectMovimentacao.usuario_origem.nome}`
                                : `${selectMovimentacao.usuario_destino.graduacao.sigla} ${selectMovimentacao.usuario_destino.nome}`
                            }
                            disabled
                          />
                        </FormGroup>
                      </Row>
                    </>
                  ),
                )}
              </div>
            </FormProvider>
          )}
        </Modal>
      )}

      <PanelBottomActions>
        <Button color="green" onClick={handleClickMovimentacar} type="button">
          Movimentar
        </Button>
      </PanelBottomActions>
    </Container>
  );
};

export default TabMovimentacoes;
