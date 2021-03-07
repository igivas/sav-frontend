import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { ValueType } from 'react-select';
import { useHistory } from 'react-router-dom';
import { Form } from 'pages/Veiculos/components/FormVeiculo/styles';
import Row from 'components/form/Row';
import FormGroup from 'components/form/FormGroup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as Yup from 'yup';
import * as _ from 'lodash';
import TituloPagina from 'components/TituloPagina';
import BoxContent from 'components/BoxContent';
import ReactSelect from 'components/form/ReactSelect';
import AsyncSelect from 'components/form/AsyncSelect';
import { FaSave, FaTimes, FaEraser } from 'react-icons/fa';
import Input from '../../../components/form/FormInput';
import FormCategory from '../../../components/form/FormCategory';
import FormTextArea from '../../../components/form/FormTextArea';
import Button from '../../../components/form/Button';
import PanelBottomActions from '../../../components/PanelBottomActions';
import DatePicker from '../../../components/form/FormDatePicker';
import api from '../../../services/api';
import { useSituacao } from '../../../contexts/SituacaoContext';

interface ISituacaoTipo {
  id_situacao_tipo: number;
  nome: string;
  especificacao: string;
}

interface IOptionsProps {
  value: string;
  label: string;
}

interface IFormInputs {
  id_veiculo: string;
  data_situacao: string | null;
  id_situacao_tipo: string;
  observacao: string;
}

type OptionType = { label: string; value: string };

const schema = Yup.object().shape({
  id_veiculo: Yup.string().required('Esse campo é requerido'),
  data_situacao: Yup.date().typeError('Insira uma data válida!'),
  id_situacao_tipo: Yup.string().required('Esse campo é requerido'),
  observacao: Yup.string().max(150, 'Tamanho máximo 150 caracteres'),
});

const initialValues = {
  id_veiculo: '',
  observacao: '',
  data_situacao: null,
  id_situacao_tipo: '',
};

interface IVeiculo {
  id_veiculo: string;
  marca: string;
  modelo: string;
  placa: OptionType;
  renavam: OptionType;
  situacoes: [];
}

const NovaSituacao: React.FC = () => {
  const { handleSubmit, errors, control, reset } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const [situacoes, setSituacoes] = useState<IOptionsProps[]>([]);

  const { createSituacao } = useSituacao();

  const [veiculos, setVeiculos] = useState([]);
  const [veiculo, setVeiculo] = useState<IVeiculo>();

  const history = useHistory();

  const promiseOptionsRenavam = async (
    inputValue: string,
  ): Promise<OptionType[]> => {
    const response = await api.get(`veiculos?renavam=${inputValue}`);

    const responseFormated = response.data.map((item: any) => {
      return {
        value: item.id_veiculo,
        label: item.renavam,
      };
    });

    setVeiculos(response.data);

    return responseFormated;
  };

  const promiseOptionsPlaca = async (
    inputValue: string,
  ): Promise<OptionType[]> => {
    const response = await api.get(`veiculos?placa=${inputValue}`);
    const responseFormated = response.data.map((item: any) => {
      return {
        value: item.id_veiculo,
        label: item.placa,
      };
    });

    setVeiculos(response.data);

    return responseFormated;
  };

  const veiculoSelected = useCallback(
    (id_veiculo: string) => {
      const veiculoEncontrado: any = veiculos.find(
        (item: any) => item.id_veiculo === id_veiculo,
      );

      if (veiculoEncontrado) {
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
          situacoes: veiculoEncontrado.situacoes,
        });
      }
    },
    [veiculos],
  );

  const situacaoAtual = useMemo((): any => {
    const situacoesOrdenadoPorData: any[] = _.orderBy(
      veiculo?.situacoes,
      ['data_situacao'],
      ['desc'],
    );

    if (situacoesOrdenadoPorData.length > 0) {
      return situacoesOrdenadoPorData[0].situacaoTipo.nome;
    }

    return '';
  }, [veiculo]);

  const onSubmit = async (data: any): Promise<void> => {
    try {
      await createSituacao({
        ...data,
        id_veiculo: veiculo?.id_veiculo,
        criado_por: 1,
      });

      // if (createdSituacao) {
      // }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const situacoesTipos = await api.get(`situacoes_tipos`);

        const situacoesTiposFormated = situacoesTipos.data.map(
          (item: ISituacaoTipo) => {
            return {
              value: item.id_situacao_tipo,
              label: item.nome,
            };
          },
        );

        setSituacoes(situacoesTiposFormated);
      } catch (error) {
        console.log(error);
      }
    }

    load();
  }, []);

  return (
    <>
      <TituloPagina title="Cadastro de Nova Situação" />
      <BoxContent>
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
                        onChange(option);
                      }}
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

            <Row>
              <FormCategory>Dados da situação</FormCategory>
              <FormGroup name="Situação Atual" cols={[4, 6, 12]}>
                <Input value={situacaoAtual} className="disabled" disabled />
              </FormGroup>

              <FormGroup required name="Nova Situação" cols={[4, 6, 12]}>
                <Controller
                  name="id_situacao_tipo"
                  control={control}
                  defaultValue=""
                  render={({ onChange, value }) => (
                    <ReactSelect
                      placeholder="Selecione..."
                      optionsSelect={situacoes}
                      value={situacoes.find((option) => option.value === value)}
                      onChange={(option: ValueType<OptionType>) => {
                        const optionSelected = option as OptionType;
                        onChange(optionSelected.value);
                      }}
                      error={errors.id_situacao_tipo?.message}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup required name="Data Situação" cols={[4, 6, 12]}>
                <Controller
                  name="data_situacao"
                  control={control}
                  render={({ onChange, value }) => (
                    <DatePicker
                      showYearDropdown
                      selected={value}
                      onChange={onChange}
                      error={errors.data_situacao?.message}
                      dateFormat="dd/MM/yyyy"
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup name="OBS" cols={[12, 12, 12]}>
                <Controller
                  name="observacao"
                  control={control}
                  render={(props) => (
                    <FormTextArea
                      {...props}
                      rows={5}
                      error={errors.observacao?.message}
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
                onClick={() => reset(initialValues)}
              >
                Limpar
              </Button>
              <Button color="green" icon={FaSave} type="submit">
                Salvar
              </Button>
            </>
          </PanelBottomActions>
        </Form>
      </BoxContent>
    </>
  );
};

export default NovaSituacao;
