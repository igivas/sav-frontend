import React, {
  useState,
  useEffect,
  useCallback,
  FormEvent,
  useMemo,
} from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { parseISO } from 'date-fns';
import { MdModeEdit } from 'react-icons/md';
import { FaSave, FaTimes, FaEraser, FaExternalLinkAlt } from 'react-icons/fa';
import { ValueType } from 'react-select';
import api from 'services/api';
import { useToast } from '@chakra-ui/react';
import { useAuth } from 'contexts/auth';
import { yupResolver } from '@hookform/resolvers';
import FormTextArea from '../../../../../components/form/FormTextArea';
import ReactSelect from '../../../../../components/form/ReactSelect';
import FormCategory from '../../../../../components/form/FormCategory';
import PanelBottomActions from '../../../../../components/PanelBottomActions';
import Row from '../../../../../components/form/Row';
import DatePicker from '../../../../../components/form/FormDatePicker';
import FormInputFile from '../../../../../components/form/FormInputFile';
import Button from '../../../../../components/form/Button';
import ButtonAccordeon from '../../../../../components/Button';

import {
  dadosGerais,
  identificador,
  dadosGeraisOrganicoOrCedido,
  cargaAtualOrganicoOrCedido,
  prefixoOrganicoOrCedido,
  aquisicaoGenerica,
  dadosAdicionais,
} from '../utils/schemaFormVeiculo';
import { useVeiculo } from '../../../../../contexts/VeiculoContext';
import FormGroup from '../../../../../components/form/FormGroup';
import FormInput from '../../../../../components/form/FormInput';
import InputCurrency from '../../../../../components/form/InputCurrency';
import { Form } from './styles';
import Carga from './CargaAtual';
import Identificador from './Identificador';
import Prefixo from './Prefixo';
import DadosGerais from './DadosGerais';

import { formatReferenciasPneus } from '../utils/dataFormated';

interface IProps {
  action: 'editar' | 'cadastrar';
}

interface IOpm {
  uni_codigo: number;
  uni_nome: string;
  uni_sigla: string;
  uni_lob: number;
  tipo: string;
}

interface IVeiculoReferencia {
  id_referencia_pneu: number;
  descricao: string;
}

interface IOrgao {
  id_orgao: number;
  nome: string;
  sigla: string;
}

type OptionType = { label: string; value: string };

const optionsFormaAquisicao = [
  { value: '0', label: 'Compra' },
  { value: '1', label: 'Doação' },
];

const maxValueAquisicao = 99000000;

const aquisicaoOrg = aquisicaoGenerica.concat(
  Yup.object({
    forma_aquisicao: Yup.string().required('Esse campo é requerido'),
    id_orgao_aquisicao: Yup.string().when('forma_aquisicao', {
      is: '1',
      then: Yup.string().required('Esse campo é requerido'),
      otherwise: Yup.string().default(''),
    }),
    valor_aquisicao: Yup.string()
      .when('forma_aquisicao', {
        is: '0',
        then: Yup.string().required('Esse campo é requerido'),
        otherwise: Yup.string().notRequired(),
      })
      .test('invalidValue', 'Valor de aquisição invalido', (value) => {
        try {
          if (Number.parseFloat(value) || !value) return true;
          return false;
        } catch (error) {
          return false;
        }
      })
      .test(
        'bigValue',
        'Valor maior que R$ 99.000.000',
        (value) => Number.parseFloat(value) <= maxValueAquisicao || !value,
      )
      .test(
        'bigValue',
        'Insira um valor maior que R$ 0,00',
        (value) => !!(Number.parseFloat(value) !== 0 || !value),
      ),
  }),
);

const schemaEditar = Yup.object()
  .shape({
    aquisicaoOrg,

    numero_crv: Yup.string().required('Esse campo é requerido'),
    codigo_seguranca_crv: Yup.string().required('Esse campo é requerido'),
    numero_motor: Yup.string()
      .transform((value) => value || undefined)
      .notRequired()
      .max(20, 'No máximo 20 caracteres!'),
  })

  .concat(dadosGerais)
  .concat(dadosGeraisOrganicoOrCedido)
  .concat(cargaAtualOrganicoOrCedido)
  .concat(dadosAdicionais);
export type IFormOrganicoEditar = Yup.InferType<typeof schemaEditar>;

const schemaCadastrar = schemaEditar
  .concat(prefixoOrganicoOrCedido)
  .concat(identificador);
export type IFormOrganicoCadastrar = Yup.InferType<typeof schemaCadastrar>;

export type IFormInputsOrganico = IFormOrganicoEditar | IFormOrganicoCadastrar;

const FormVeiculo: React.FC<IProps> = ({ action }) => {
  const { veiculo, updateVeiculo, createVeiculo } = useVeiculo();
  const history = useHistory();
  const toast = useToast();
  const { signOut } = useAuth();
  const [disabled, setDisabled] = useState(action !== 'cadastrar');
  const [orgaosAquisicao, setOrgaosAquisicao] = useState<OptionType[]>([]);
  const [orgaoList, setorgaoList] = useState<IOrgao[]>([]);

  const [veiculoReferencias, setVeiculoReferencias] = useState<OptionType[]>(
    [],
  );

  const validationSchema = useMemo(
    () => (action === 'editar' ? schemaEditar : schemaCadastrar),
    [action],
  );

  // const formatInitialReferencias = useCallback((): OptionType[] => {
  //   return veiculo.referenciasPneus?.map<OptionType>((item) => {
  //     return {
  //       value: item.id_referencia_pneu.toString(),
  //       label: item.descricao,
  //     };
  //   });
  // }, [veiculo]);

  const orderOptions = useCallback((options: OptionType[]) => {
    return options.sort((a: OptionType, b: OptionType) => {
      return a.label.localeCompare(b.label);
    });
  }, []);

  const initialCleanValues = {
    aquisicaoOrg: {
      valor_aquisicao: '0',
      forma_aquisicao: '',
    },
    numero_doc_carga: '',
  } as Partial<IFormInputsOrganico>;

  const lastFileVeiculoAquisicao =
    action === 'editar'
      ? veiculo.aquisicoes[veiculo.aquisicoes.length - 1].file_path
      : undefined;
  const initialValues = (): object => {
    if (action === 'editar') {
      return {
        chassi: veiculo.chassi || undefined,
        placa: veiculo.placa || undefined,
        id_veiculo_especie: veiculo.id_veiculo_especie.toString() || undefined,
        id_marca: veiculo.id_marca.toString() || undefined,
        id_modelo: veiculo.id_modelo || undefined,
        id_cor: veiculo.id_cor.toString() || undefined,
        ano_fabricacao: veiculo.ano_modelo
          ? new Date(Number(veiculo.ano_modelo), 0, 1)
          : undefined,

        ano_modelo: veiculo.ano_modelo
          ? new Date(Number(veiculo.ano_modelo), 0, 1)
          : undefined,
        numero_motor: veiculo.numero_motor || undefined,
        renavam: veiculo.renavam || undefined,
        combustivel: veiculo.combustivel || undefined,

        numero_doc_carga: veiculo.numero_doc_carga || undefined,
        valor_fipe: veiculo.valor_fipe ? Number(veiculo.valor_fipe) : 0,
        uf: veiculo.uf && veiculo.uf.trim() ? veiculo.uf.toString() : undefined,
        adesivado: veiculo.adesivado || undefined,
        orgao_tombo: veiculo.orgao_tombo
          ? String(veiculo.orgao_tombo)
          : undefined,
        tombo: veiculo.tombo || undefined,
        tipo_doc_carga: veiculo.tipo_doc_carga || undefined,
        data_doc_carga: veiculo.data_doc_carga
          ? parseISO(veiculo.data_doc_carga)
          : undefined,

        data_operacao: veiculo.data_operacao
          ? parseISO(veiculo.data_operacao)
          : undefined,
        opm_carga: veiculo.opm_carga || undefined,
        opm_carga_sigla: veiculo.opm_carga_sigla || undefined,
        opm_carga_lob: veiculo.opm_carga_lob || undefined,
        numero_crv: veiculo.numero_crv || undefined,
        codigo_seguranca_crv: veiculo.codigo_seguranca_crv || undefined,
        referenciasPneus: veiculo.referenciasPneus || [],
        identificador: '',
        data_identificador: '',
        prefixo_tipo: '',
        emprego: '',
        prefixo_sequencia: '',

        aquisicaoOrg: {
          data_aquisicao: veiculo.aquisicoes.length
            ? parseISO(veiculo.aquisicoes[0].data_aquisicao)
            : undefined,
          forma_aquisicao: veiculo.aquisicoes.length
            ? veiculo.aquisicoes[0].forma_aquisicao
            : undefined,
          valor_aquisicao: veiculo.aquisicoes.length
            ? veiculo.aquisicoes[0].valor_aquisicao
            : undefined,
          doc_aquisicao: veiculo.aquisicoes[0].doc_aquisicao
            ? veiculo.aquisicoes[0].doc_aquisicao
            : undefined,
          aquisicao_file: lastFileVeiculoAquisicao,
          id_orgao_aquisicao: veiculo.aquisicoes[0].id_orgao_aquisicao.toString(),
        },
        data_prefixo: undefined,
        origem_aquisicao: '',

        id_orgao_aquisicao: '',

        observacao: veiculo.observacao || '',
      };
    }

    return initialCleanValues;
  };
  const methods = useForm<IFormInputsOrganico>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues(),
    mode: 'onSubmit',
    // reValidateMode: 'onSubmit',
  });

  const { handleSubmit, errors, control, reset, watch, setValue } = methods;

  const forma_aquisicao = watch('aquisicaoOrg.forma_aquisicao');

  const onSubmit = async (data: IFormInputsOrganico): Promise<void> => {
    const {
      aquisicaoOrg: aquisicao,
      ano_fabricacao,
      ano_modelo,
      referenciasPneus,
      numero_doc_carga,
      numero_motor,
      placa,
      renavam,
      tombo,
      chassi,
      ...restForm
    } = data;

    const rest = {
      ...restForm,
      numero_doc_carga: numero_doc_carga?.trim(),
      numero_motor: numero_motor?.trim(),
      placa: placa?.trim(),
      renavam: renavam?.trim(),
      tombo: tombo?.trim(),
      chassi: chassi.trim(),
    };
    const { aquisicao_file, ...restAquisicao } = aquisicao;
    const veiculoCaracteristicas = {
      ano_fabricacao: ano_fabricacao?.getFullYear(),
      ano_modelo: ano_modelo?.getFullYear(),
      referenciasPneus:
        referenciasPneus && formatReferenciasPneus(referenciasPneus),
      aquisicao_file,
    };

    if (action === 'cadastrar') {
      try {
        const {
          prefixo_sequencia,
          prefixo_tipo,
          emprego,
          data_identificador,
          identificador: ident,
          ...restDataCadastrar
        } = rest as Partial<IFormOrganicoCadastrar>;
        const createdVeiculo = await createVeiculo({
          prefixo: {
            prefixo_sequencia: prefixo_sequencia?.trim(),
            prefixo_tipo: prefixo_tipo?.trim(),
            emprego,
          },
          identificador: {
            data_identificador,
            identificador: ident?.trim(),
          },
          aquisicao: {
            origem_aquisicao: '0',
            ...restAquisicao,
          },
          ...veiculoCaracteristicas,
          ...restDataCadastrar,
        });

        if (createdVeiculo) {
          reset(initialValues());
          history.push('/veiculos/consulta');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      await updateVeiculo(
        {
          aquisicao: {
            ...restAquisicao,
          },
          ...veiculoCaracteristicas,
          ...rest,
          aquisicao_file,
        },
        veiculo.id_veiculo && veiculo.id_veiculo,
      );
      history.push('/veiculos/consulta');
    }
  };

  function handleSelectedFile(event: FormEvent<HTMLInputElement>): void {
    const file = event.currentTarget.files
      ? event.currentTarget.files[0]
      : null;
    const element = event;
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'Erro.',
          description: 'Tamanho do arquivo nao pode ser superior a 2MB',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      } else if (
        !file.type.match(/^(application\/pdf)|(image\/((pn|(jpe?))g))$/)
      ) {
        toast({
          title: 'Erro.',
          description: 'Arquivo invalido. Apenas PDF/PNG/JPG/JPEG',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });

        element.currentTarget.value = '';
      } else {
        setValue('aquisicaoOrg.aquisicao_file', file);
      }
    }
  }

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const [referencias, orgaos] = await Promise.all([
          api.get<IVeiculoReferencia[]>('referencias_pneus'),
          api.get<IOrgao[]>('orgaos'),
        ]);
        setorgaoList(orgaos.data);

        const referenciasFormated = referencias.data.map(
          (referencia): OptionType => {
            return {
              value: referencia.id_referencia_pneu.toLocaleString(),
              label: referencia.descricao,
            };
          },
        );

        setVeiculoReferencias(referenciasFormated);
      } catch (error) {
        if (error.response && error.response.status === 401) signOut();
      }
    }
    load();
  }, [signOut]);

  useEffect(() => {
    if (forma_aquisicao === '0') {
      const orgaoContainsPMCE = orgaoList.find((orgaoAtual) => {
        return orgaoAtual.sigla.includes('PMCE');
      });

      if (orgaoContainsPMCE)
        setOrgaosAquisicao([
          {
            label: `${orgaoContainsPMCE.sigla} - ${orgaoContainsPMCE.nome}`,
            value: orgaoContainsPMCE.id_orgao.toString(),
          },
        ]);
    } else {
      const orgaosWithoutPMCE = orgaoList.filter(
        (orgao) => !orgao.sigla.includes('PMCE'),
      );

      setOrgaosAquisicao(
        orgaosWithoutPMCE.map<OptionType>((orgao) => ({
          label: `${orgao.nome} - ${orgao.sigla}`,
          value: orgao.id_orgao.toString(),
        })),
      );
    }
  }, [orgaoList, forma_aquisicao]);

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Row>
            <FormGroup required name="Data de Aquisição" cols={[4, 6, 12]}>
              <Controller
                name="aquisicaoOrg.data_aquisicao"
                control={control}
                render={({ onChange, value }) => (
                  <DatePicker
                    showYearDropdown
                    onChange={onChange}
                    dateFormat="dd/MM/yyyy"
                    disabled={disabled}
                    error={errors.aquisicaoOrg?.data_aquisicao?.message}
                    selected={value}
                  />
                )}
              />
            </FormGroup>
            <FormGroup required name="Forma de Aquisição" cols={[4, 6, 12]}>
              <Controller
                name="aquisicaoOrg.forma_aquisicao"
                control={control}
                render={({ onChange, value }) => (
                  <ReactSelect
                    placeholder="Selecione..."
                    optionsSelect={orderOptions(optionsFormaAquisicao)}
                    value={optionsFormaAquisicao.find(
                      (option) => option.value === value,
                    )}
                    onChange={(option: ValueType<OptionType>) => {
                      const optionSelected = option as OptionType;
                      onChange(optionSelected.value);
                    }}
                    error={errors.aquisicaoOrg?.forma_aquisicao?.message}
                    isDisabled={disabled}
                  />
                )}
              />
            </FormGroup>

            {forma_aquisicao === '0' && (
              <FormGroup required name="Valor de Aquisição" cols={[4, 6, 12]}>
                <Controller
                  name="aquisicaoOrg.valor_aquisicao"
                  control={control}
                  render={({ onChange, value }) => (
                    <InputCurrency
                      value={value}
                      onChange={(
                        event: any,
                        valueInput: any,
                        maskedValue: any,
                      ) => onChange(Number(valueInput))}
                      error={errors.aquisicaoOrg?.valor_aquisicao?.message}
                      disabled={disabled}
                    />
                  )}
                  defaultValue={0}
                />
              </FormGroup>
            )}
          </Row>
          <Row>
            {forma_aquisicao === '0' && (
              <FormGroup required name="Orgão de Aquisição" cols={[6, 12, 12]}>
                <Controller
                  name="aquisicaoOrg.id_orgao_aquisicao"
                  control={control}
                  render={({ onChange }) => (
                    <ReactSelect
                      placeholder="Selecione..."
                      optionsSelect={orgaosAquisicao}
                      error={errors.aquisicaoOrg?.id_orgao_aquisicao?.message}
                      isDisabled
                      value={orgaosAquisicao[0]}
                    />
                  )}
                  defaultValue={8}
                />
              </FormGroup>
            )}

            {forma_aquisicao === '1' && (
              <FormGroup required name="Orgão de doação" cols={[6, 12, 12]}>
                <Controller
                  name="aquisicaoOrg.id_orgao_aquisicao"
                  control={control}
                  render={({ onChange, value }) => (
                    <ReactSelect
                      placeholder="Selecione..."
                      optionsSelect={orgaosAquisicao}
                      value={orgaosAquisicao.find(
                        (option) => option.value === value,
                      )}
                      onChange={(option: ValueType<OptionType>) => {
                        const optionSelected = option as OptionType;
                        onChange(optionSelected.value);
                      }}
                      error={errors.aquisicaoOrg?.id_orgao_aquisicao?.message}
                      isDisabled={disabled}
                    />
                  )}
                />
              </FormGroup>
            )}

            <FormGroup name="Documento Aquisição" cols={[6, 12, 12]}>
              <Controller
                name="aquisicaoOrg.doc_aquisicao"
                control={control}
                render={(props) => (
                  <FormInput
                    {...props}
                    disabled={disabled}
                    error={errors.aquisicaoOrg?.doc_aquisicao?.message}
                  />
                )}
              />
            </FormGroup>
          </Row>
          <Row>
            <FormGroup
              name="Arquivo de aquisição (OBS: MAX: 2MB - PNG/JPEG/JPG/PDF)"
              cols={[6, 4, 3]}
            >
              <Controller
                name="aquisicaoOrg.aquisicao_file"
                control={control}
                render={({ onChange, value }) => (
                  <FormInputFile
                    onChange={(e) => {
                      handleSelectedFile(e);
                    }}
                    error={errors.aquisicaoOrg?.aquisicao_file?.message}
                    disabled={disabled}
                  />
                )}
              />

              {action === 'editar' && lastFileVeiculoAquisicao && (
                <ButtonAccordeon
                  style={{
                    background: '#e4e9ee',
                    marginTop: '8px',
                    justifyContent: 'space-between',
                    color: '#444444',
                  }}
                  onClick={async (event) => {
                    event.preventDefault();

                    if (lastFileVeiculoAquisicao) {
                      const file = await api.get(
                        `documentos/${lastFileVeiculoAquisicao}`,
                        {
                          responseType: 'blob',
                        },
                      );

                      const blob = new Blob([file.data], {
                        type: file.headers['content-type'],
                      });

                      const fileURL = URL.createObjectURL(blob);
                      window.open(fileURL, '_blank');
                    }
                  }}
                >
                  <FaExternalLinkAlt size={16} style={{ marginRight: '8px' }} />
                  Clique aqui para ver o arquivo atual
                </ButtonAccordeon>
              )}
            </FormGroup>
          </Row>

          {action === 'cadastrar' && (
            <>
              <FormCategory>PREFIXO ATUAL</FormCategory>
              <Prefixo />

              <FormCategory>IDENTIFICADOR ATUAL</FormCategory>
              <Identificador disabled={disabled} />
            </>
          )}

          <>
            <FormCategory>DADOS GERAIS</FormCategory>
            <DadosGerais action={action} disabled={disabled} />

            <FormCategory>CARGA ATUAL</FormCategory>
            <Carga disabled={disabled} />

            <FormCategory>DADOS ADICIONAIS</FormCategory>
            <Row>
              <FormGroup required name="Referências Pneus" cols={[8, 6, 12]}>
                <Controller
                  name="referenciasPneus"
                  control={control}
                  render={({ onChange, value }) => (
                    <ReactSelect
                      placeholder="Selecione..."
                      optionsSelect={veiculoReferencias}
                      isMulti
                      value={value}
                      onChange={(option: ValueType<OptionType>) => {
                        const optionSelected = option as OptionType;
                        onChange(optionSelected || []);
                      }}
                      isDisabled={disabled}
                      error={(errors.referenciasPneus as any)?.message}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup name="Data Operação" cols={[4, 6, 12]}>
                <Controller
                  name="data_operacao"
                  control={control}
                  render={({ onChange, value }) => (
                    <DatePicker
                      showYearDropdown
                      selected={value}
                      onChange={onChange}
                      dateFormat="dd/MM/yyyy"
                      disabled={disabled}
                      error={errors.data_operacao?.message}
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup name="Observação" cols={[12, 12, 12]}>
                <Controller
                  name="observacao"
                  control={control}
                  render={(props) => (
                    <FormTextArea
                      {...props}
                      rows={5}
                      disabled={disabled}
                      error={errors.observacao?.message}
                    />
                  )}
                />
              </FormGroup>
            </Row>
          </>
        </div>

        <PanelBottomActions>
          {action === 'editar' && (
            <>
              <Button
                color="red"
                icon={FaTimes}
                onClick={() => history.push('/veiculos/consulta')}
              >
                Cancelar
              </Button>
              {disabled && (
                <Button
                  color="yellow"
                  icon={MdModeEdit}
                  onClick={() => setDisabled(!disabled)}
                  disabled={!disabled}
                >
                  Editar
                </Button>
              )}

              {!disabled && (
                <Button
                  color="green"
                  icon={FaSave}
                  type="submit"
                  disabled={false}
                >
                  Salvar
                </Button>
              )}
            </>
          )}
          {action === 'cadastrar' && (
            <>
              <Button
                color="red"
                icon={FaTimes}
                onClick={() => history.push('/veiculos/consulta')}
              >
                Cancelar
              </Button>
              <Button
                color="yellow"
                icon={FaEraser}
                type="button"
                onClick={() => {
                  reset(initialValues());
                }}
              >
                Limpar
              </Button>
              <Button color="green" icon={FaSave} type="submit">
                Salvar
              </Button>
            </>
          )}
        </PanelBottomActions>
      </Form>
    </FormProvider>
  );
};

export default FormVeiculo;
