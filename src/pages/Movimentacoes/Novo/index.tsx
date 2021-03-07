import React, { useCallback, useEffect, useState } from 'react';
import { ValueType } from 'react-select';
import { useHistory, useLocation } from 'react-router-dom';
import { Form } from 'pages/Veiculos/components/FormVeiculo/styles';
import Row from 'components/form/Row';
import FormGroup from 'components/form/FormGroup';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as Yup from 'yup';
import { FaSave, FaTimes, FaEraser } from 'react-icons/fa';
import { useToast } from '@chakra-ui/react';
import ModalTermo from 'components/ModalTermo';
import { useAuth } from 'contexts/auth';
import TituloPagina from '../../../components/TituloPagina';
import BoxContent from '../../../components/BoxContent';
import AsyncSelect from '../../../components/form/AsyncSelect';
import ReactSelect from '../../../components/form/ReactSelect';
import Input from '../../../components/form/FormInput';
import FormCategory from '../../../components/form/FormCategory';
import Button from '../../../components/form/Button';
import PanelBottomActions from '../../../components/PanelBottomActions';
import api from '../../../services/api';

type OptionType = { label: string; value: string };

const schema = Yup.object().shape({
  id_veiculo: Yup.number().required('Esse campo é requerido'),
  id_tipo_movimentacao: Yup.number()
    .required('Esse campo é requerido')
    .typeError('Valor invalido'),
  id_opm_origem: Yup.number()
    .required('Esse campo é requerido')
    .typeError('Valor invalido'),
  id_opm_destino: Yup.number()
    .required('Esse campo é requerido')
    .typeError('Valor invalido'),
});

type Fase = {
  id_tipo_movimentacao_fase: number;
  nome_fase: string;
};

type IFormInputs = Yup.InferType<typeof schema>;

type TiposMovimentacoes = {
  id_tipo_movimentacao: number;
  tipo_movimentacao: string;
  fases: Fase[];
};
// const tiposMovimentacaoFase: OptionType[] = [{ value }];

interface IVeiculo {
  id_veiculo: string;
  marca: string;
  modelo: string;
  placa: OptionType;
  renavam: OptionType;
  prefixo?: [{ prefixo_sequencia: string }];
}

interface IOPMs {
  uni_codigo: number;
  nome: string;
  sigla: string;
  id_opm: number;
}

const NovaMovimentacao: React.FC = () => {
  const { state } = useLocation<{ veiculo: IVeiculo }>();
  const { signOut } = useAuth();

  const methods = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: state.veiculo
      ? {
          id_veiculo: Number.parseInt(state.veiculo.id_veiculo, 10),
        }
      : ({} as IFormInputs),
  });

  const { handleSubmit, errors, control, reset, setValue } = methods;

  const [veiculos, setVeiculos] = useState([]);
  const [veiculo, setVeiculo] = useState<IVeiculo>(state.veiculo);
  const toast = useToast();

  const [veiculoOpmDestino, setVeiculoOpmDestino] = useState<OptionType[]>([]);
  const [tiposMovimentacoes, setTiposMovimentacoes] = useState<OptionType[]>(
    [],
  );
  const [tipoMovimentacao, setTipoMovimentacao] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [opmOrigemNome, setOpmOrigemNome] = useState('');
  const [opmDestinoNome, setOpmDestinoNome] = useState('');

  const [fase, setFase] = useState<Fase>({} as Fase);

  const [data, setData] = useState<{
    body: {
      movimentacao: IFormInputs & { id_tipo_movimentacao_fase: number };
    };
  }>();

  const history = useHistory();

  const promiseOptionsRenavam = async (
    inputValue: string,
  ): Promise<OptionType[] | undefined> => {
    try {
      const response = await api.get(`veiculos?renavam=${inputValue}`);
      const responseFormated = response.data.map((item: any) => {
        return {
          value: item.id_veiculo,
          label: item.renavam,
        };
      });
      setVeiculos(response.data);

      return responseFormated;
    } catch (error) {
      console.log(error);
    }

    return undefined;
  };

  const promiseOptionsPlaca = async (
    inputValue: string,
  ): Promise<OptionType[] | undefined> => {
    let responseFormated;
    try {
      const response = await api.get(`veiculos?placa=${inputValue}`);
      responseFormated = response.data.map((item: any) => {
        return {
          value: item.id_veiculo,
          label: item.placa,
        };
      });

      setVeiculos(response.data);
    } catch (error) {
      console.log(error);
    }
    return responseFormated;
  };

  const veiculoSelected = useCallback(
    async (id_veiculo: string) => {
      const veiculoEncontrado: any = veiculos.find(
        (item: any) => item.id_veiculo === id_veiculo,
      );

      try {
        const veiculoMovimentacoes = await api.get(
          `veiculos/${id_veiculo}/movimentacoes`,
        );

        if (
          veiculoMovimentacoes.data.movimentacoes.length > 0 &&
          (veiculoMovimentacoes.data.movimentacoes[0].fases[0].nome
            .toLowerCase()
            .includes('oferta') ||
            veiculoMovimentacoes.data.movimentacoes[0].fases[0].nome
              .toLowerCase()
              .includes('concessão'))
        ) {
          toast({
            title: 'Ocorreu um erro.',
            description: 'Veiculos já esta em outra movimentacao',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });

          return;
        }

        setVeiculo({
          id_veiculo: veiculoEncontrado?.id_veiculo,
          marca: veiculoEncontrado?.veiculoMarca.nome,
          modelo: veiculoEncontrado?.veiculoModelo.nome,
          placa: {
            value: veiculoEncontrado.id_veiculo,
            label: veiculoEncontrado.placa,
          },
          renavam: {
            value: veiculoEncontrado.id_veiculo,
            label: veiculoEncontrado.renavam,
          },
          prefixo: veiculoEncontrado.prefixos.map((prefixo: any) => ({
            prefixo_sequencia: prefixo.prefixo_sequencia,
          })),
        });
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            toast({
              title: 'Ocorreu um erro.',
              description:
                'Você expirou o tempo ou não possui mais acesso ao sistema',
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
            signOut();
          } else {
            toast({
              title: 'Ocorreu um erro.',
              description: error.response.data.message || 'Erro interno',
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
          }
        }
      }
    },
    [veiculos, toast, signOut],
  );

  const [opmSearch, setOpmSearch] = useState<OptionType[]>([]);

  const promiseOptionsOpms = async (
    inputValue: string,
  ): Promise<OptionType[]> => {
    if (inputValue.length >= 3) {
      const response = await api.get<IOPMs[]>(`opms?query=${inputValue}`);

      const responseFormated = response.data.map<OptionType>((item) => {
        return {
          value: item.id_opm.toString(),
          label: `${item.nome} - ${item.sigla}`,
        };
      });

      setOpmSearch(responseFormated);

      return responseFormated;
    }

    return [];
  };
  const handleOpenModal = (): void => {
    setShowModal(true);
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
  };

  useEffect(() => {
    async function loadTiposMovimentacoes(): Promise<void> {
      try {
        const tiposMovimentacoesResponse = await api.get<TiposMovimentacoes[]>(
          '/movimentacoes/tipos',
        );
        setTiposMovimentacoes(
          tiposMovimentacoesResponse.data.map<OptionType>(
            (tipoMovimentacaoData) => {
              return {
                label: tipoMovimentacaoData.tipo_movimentacao,
                value: tipoMovimentacaoData.id_tipo_movimentacao.toString(),
              };
            },
          ),
        );
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            toast({
              title: 'Ocorreu um erro.',
              description:
                'Você expirou o tempo ou não possui mais acesso ao sistema',
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
            signOut();
          } else {
            toast({
              title: 'Ocorreu um erro.',
              description: error.data.message || 'Erro interno',
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
          }
        }
      }
    }

    loadTiposMovimentacoes();
  }, [toast, signOut]);

  const onSubmit = async (formValues: IFormInputs): Promise<undefined> => {
    try {
      setData({
        body: {
          movimentacao: {
            ...formValues,
            id_tipo_movimentacao_fase: fase.id_tipo_movimentacao_fase,
          },
        },
      });
      handleOpenModal();
    } catch (error) {
      console.log(error);
    }
    return undefined;
  };

  useEffect(() => {
    async function load(): Promise<void> {
      let responseFormated;
      if (veiculo) {
        try {
          const opmDestino = await api.get(
            `veiculos/${veiculo.id_veiculo}/movimentacoes`,
          );
          responseFormated = [
            {
              value: opmDestino.data?.movimentacoes[0].opm_destino.id_opm.toString(),
              label: `${opmDestino.data?.movimentacoes[0].opm_destino.nome} - ${opmDestino.data?.movimentacoes[0].opm_destino.sigla}`,
            },
          ];
          setOpmOrigemNome(opmDestino.data?.movimentacoes[0].opm_destino.sigla);
          setValue(
            'id_opm_origem',
            opmDestino.data?.movimentacoes[0].opm_destino.id_opm.toString(),
          );
          setVeiculoOpmDestino(responseFormated);
        } catch (error) {
          if (error.response) {
            if (error.response.status === 401) {
              toast({
                title: 'Ocorreu um erro.',
                description:
                  'Você expirou o tempo ou não possui mais acesso ao sistema',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });
              signOut();
            } else {
              toast({
                title: 'Ocorreu um erro.',
                description: error.data.message || 'Erro interno',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });
            }
          }
        }
      }
    }

    load();
  }, [veiculo, setValue, signOut, toast]);

  useEffect(() => {
    async function loadFasesMovimentacaoByTipoMovimentacao(): Promise<void> {
      try {
        const response = await api.get<TiposMovimentacoes>(
          '/movimentacoes/tipos',
          {
            params: {
              tipoMovimentacaoNome: tipoMovimentacao,
            },
          },
        );

        const { fases } = response.data;

        const orderedFases = fases.sort(function (a, b) {
          return a.id_tipo_movimentacao_fase - b.id_tipo_movimentacao_fase;
        });

        setFase(orderedFases[0]);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            toast({
              title: 'Ocorreu um erro.',
              description:
                'Você expirou o tempo ou não possui mais acesso ao sistema',
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
            signOut();
          } else {
            toast({
              title: 'Ocorreu um erro.',
              description: error.response.data.message || 'Erro interno',
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
          }
        }
      }
    }

    loadFasesMovimentacaoByTipoMovimentacao();
  }, [tipoMovimentacao, toast, signOut]);

  return (
    <>
      <TituloPagina title="Movimentar veículo" />
      <BoxContent>
        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <FormCategory>Dados do veículo</FormCategory>
              <Row>
                <FormGroup required name="Placa" cols={[3, 6, 12]}>
                  <Controller
                    name="id_veiculo"
                    control={control}
                    render={({ onChange }) => (
                      <AsyncSelect
                        loadOptions={promiseOptionsPlaca}
                        value={veiculo?.placa}
                        onChange={(option: ValueType<OptionType>) => {
                          const optionSelected = option as OptionType;

                          veiculoSelected(optionSelected.value);
                          onChange(optionSelected);
                        }}
                        isDisabled={!!state.veiculo}
                        error={errors.id_veiculo?.message}
                      />
                    )}
                  />
                </FormGroup>
                <FormGroup required name="Renavam" cols={[3, 6, 12]}>
                  <Controller
                    name="id_veiculo"
                    control={control}
                    render={({ onChange }) => (
                      <AsyncSelect
                        loadOptions={promiseOptionsRenavam}
                        value={veiculo?.renavam}
                        onChange={(option: ValueType<OptionType>) => {
                          const optionSelected = option as OptionType;

                          veiculoSelected(optionSelected.value);
                          onChange(option);
                        }}
                        isDisabled={!!state.veiculo}
                        error={errors.id_veiculo?.message}
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup name="Marca" cols={[3, 6, 12]}>
                  <Input disabled value={veiculo?.marca} />
                </FormGroup>

                <FormGroup name="Modelo" cols={[3, 6, 12]}>
                  <Input value={veiculo?.modelo} disabled />
                </FormGroup>
              </Row>

              <FormCategory>Dados da Movimentação</FormCategory>
              <Row>
                <FormGroup
                  required
                  name="Tipo de Movimentação"
                  cols={[4, 6, 12]}
                >
                  <Controller
                    name="id_tipo_movimentacao"
                    control={control}
                    defaultValue=""
                    render={({ onChange, value }) => (
                      <ReactSelect
                        placeholder="Selecione..."
                        optionsSelect={tiposMovimentacoes}
                        value={tiposMovimentacoes.find(
                          (option) => option.value === value,
                        )}
                        onChange={(option: ValueType<OptionType>) => {
                          const optionSelected = option as OptionType;
                          setTipoMovimentacao(optionSelected.label);
                          onChange(optionSelected.value);
                        }}
                        error={errors.id_tipo_movimentacao?.message}
                      />
                    )}
                  />
                </FormGroup>

                {/* <FormGroup required name="Data Devolução" cols={[4, 6, 12]}>
                <Controller
                  name="data_devolucao"
                  control={control}
                  render={({ onChange, value }) => (
                    <DatePicker
                      showYearDropdown
                      selected={value}
                      onChange={onChange}
                      // error={errors.data_situacao?.message}
                      dateFormat="dd/MM/yyyy"
                    />
                  )}
                />
              </FormGroup> */}
              </Row>

              <Row>
                {/* campo disabled nao passa valores, esse é o problema */}
                <FormGroup required name="OPM de Origem" cols={[4, 6, 12]}>
                  <Controller
                    name="id_opm_origem"
                    control={control}
                    render={() => (
                      <ReactSelect
                        value={veiculoOpmDestino[0]}
                        optionsSelect={veiculoOpmDestino}
                        error={errors.id_opm_origem?.message}
                        isDisabled
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup required name="OPM de Destino" cols={[4, 6, 12]}>
                  <Controller
                    name="id_opm_destino"
                    control={control}
                    render={({ onChange, value }) => (
                      <AsyncSelect
                        loadOptions={promiseOptionsOpms}
                        onChange={(option: ValueType<OptionType>) => {
                          const optionSelected = option as OptionType;
                          const [, sigla] = optionSelected.label
                            .trim()
                            .split('-');

                          setOpmDestinoNome(sigla);
                          onChange(optionSelected.value);
                        }}
                        error={errors.id_opm_destino?.message}
                        value={opmSearch.find((option) => {
                          return option.value === value;
                        })}
                      />
                    )}
                  />
                </FormGroup>
              </Row>
            </div>
            <PanelBottomActions>
              <>
                <Button
                  color="red"
                  icon={FaTimes}
                  onClick={() => history.push('/')}
                >
                  Cancelar
                </Button>
                <Button
                  color="yellow"
                  icon={FaEraser}
                  type="button"
                  onClick={() => reset()}
                >
                  Limpar
                </Button>
                <Button color="green" icon={FaSave} type="submit">
                  Movimentar
                </Button>
              </>
            </PanelBottomActions>
          </Form>
          <ModalTermo
            title={`${tipoMovimentacao} de carga`}
            subtitle="Envio"
            isOpen={showModal}
            handleCloseModal={handleCloseModal}
            width={400}
            height={300}
            data={data}
            tipo="movimentacao"
          >
            <p>
              Você confirma o envio do veiculo de placa {veiculo?.placa.label}{' '}
              {!!veiculo.prefixo?.length && (
                <>
                  e Prefixo{' '}
                  {
                    veiculo?.prefixo[veiculo.prefixo.length - 1]
                      ?.prefixo_sequencia
                  }
                </>
              )}{' '}
              da {opmOrigemNome} para {opmDestinoNome}?
            </p>
            <br />
            <p>
              Este procedimento gera um termo eletrônico de transferência de
              veículo. Para ter validade o termo deveŕa ser assinado
              eletronicamente
            </p>
          </ModalTermo>
        </FormProvider>
      </BoxContent>
    </>
  );
};

export default NovaMovimentacao;
