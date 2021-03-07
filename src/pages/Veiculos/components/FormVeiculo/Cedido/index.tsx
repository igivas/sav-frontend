import React, { useState, useEffect, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { parseISO } from 'date-fns';
import { MdModeEdit } from 'react-icons/md';
import { FaSave, FaTimes, FaEraser, FaExternalLinkAlt } from 'react-icons/fa';
import { ValueType } from 'react-select';
import { useToast } from '@chakra-ui/react';
import FormInputFile from '../../../../../components/form/FormInputFile';
import { useVeiculo } from '../../../../../contexts/VeiculoContext';
import FormGroup from '../../../../../components/form/FormGroup';
import FormInput from '../../../../../components/form/FormInput';
import DatePicker from '../../../../../components/form/FormDatePicker';
import Row from '../../../../../components/form/Row';
import PanelBottomActions from '../../../../../components/PanelBottomActions';
import Button from '../../../../../components/form/Button';
import ButtonAccordeon from '../../../../../components/Button';
import FormCategory from '../../../../../components/form/FormCategory';
import ReactSelect from '../../../../../components/form/ReactSelect';
import api from '../../../../../services/api';
import { Form } from './styles';
import FormTextArea from '../../../../../components/form/FormTextArea';

import Carga from './CargaAtual';
import Identificador from './Identificador';
import Prefixo from './Prefixo';
import DadosGerais from './DadosGerais';

// import { useAuth } from '../../../../../contexts/auth';
import {
  dadosGerais,
  identificador,
  cargaAtualOrganicoOrCedido,
  dadosGeraisOrganicoOrCedido,
  prefixoOrganicoOrCedido,
} from '../utils/schemaFormVeiculo';

import { aquisicaoGenerica, dadosAdicionais } from '../utils/schemaFormVeiculo';
import { formatReferenciasPneus } from '../utils/dataFormated';

interface IProps {
  action: 'editar' | 'cadastrar';
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

const aquisicaoCed = aquisicaoGenerica.concat(
  Yup.object({
    id_orgao_aquisicao: Yup.string().required('Selecione uma opção'),
  }),
);

const schemaEditar = Yup.object()
  .shape({
    aquisicaoCed,

    numero_crv: Yup.string().notRequired(),
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
export type IFormEditarCedido = Yup.InferType<typeof schemaEditar>;

const schemaCadastrar = schemaEditar
  .concat(prefixoOrganicoOrCedido)
  .concat(identificador);
export type IFormCadastarCedido = Yup.InferType<typeof schemaCadastrar>;

export type IFormInputsCedido = IFormCadastarCedido | IFormEditarCedido;

const FormCedido: React.FC<IProps> = ({ action }) => {
  const { veiculo, updateVeiculo, createVeiculo } = useVeiculo();
  const history = useHistory();
  const toast = useToast();
  const [disabled, setDisabled] = useState(action !== 'cadastrar');
  const [orgaosAquisicao, setOrgaosAquisicao] = useState<OptionType[]>([]);

  const [veiculoReferencias, setVeiculoReferencias] = useState<OptionType[]>(
    [],
  );

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const [referencias, orgaos] = await Promise.all([
          api.get<IVeiculoReferencia[]>('referencias_pneus'),
          api.get<IOrgao[]>('orgaos'),
        ]);

        const orgaosFormated = orgaos.data.map((orgaoAtual) => {
          return {
            value: orgaoAtual.id_orgao.toString(),
            label: `${orgaoAtual.sigla} - ${orgaoAtual.nome}`,
          };
        });

        const referenciasFormated = referencias.data.map((referencia) => {
          return {
            value: referencia.id_referencia_pneu.toString(),
            label: referencia.descricao.toString(),
          };
        });

        setOrgaosAquisicao(orgaosFormated);
        setVeiculoReferencias(referenciasFormated);
      } catch (error) {
        console.log(error);
      }
    }

    load();
  }, []);

  // const formatInitialReferencias = useCallback((): any[] => {
  //   return veiculo.referenciasPneus?.map((item) => {
  //     return {
  //       value: item.id_referencia_pneu.toString(),
  //       label: item.descricao,
  //     };
  //   });
  // }, [veiculo]);

  const initialCleanValues = {
    numero_doc_carga: '',
  } as IFormInputsCedido;
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

        aquisicaoCed: {
          aquisicao_file: veiculo.aquisicoes[0].file_path || undefined,
          doc_aquisicao: veiculo.aquisicoes[0].doc_aquisicao
            ? veiculo.aquisicoes[0].doc_aquisicao
            : undefined,
          data_aquisicao: veiculo.aquisicoes.length
            ? parseISO(veiculo.aquisicoes[0].data_aquisicao)
            : undefined,

          origem_aquisicao: '',
          forma_aquisicao: '',
          id_orgao_aquisicao: veiculo.aquisicoes[0].id_orgao_aquisicao.toString(),
          valor_aquisicao: 0,
        },
        data_prefixo: undefined,
        observacao: veiculo.observacao || undefined,
      };
    }
    return initialCleanValues;
  };

  const methods = useForm<IFormInputsCedido>({
    resolver: yupResolver(
      action === 'cadastrar' ? schemaCadastrar : schemaEditar,
      { stripUnknown: true, abortEarly: false },
    ),
    defaultValues: initialValues(),
  });

  const { handleSubmit, errors, control, reset, setValue } = methods;

  const onSubmit = async (data: IFormInputsCedido): Promise<void> => {
    const {
      aquisicaoCed: aquisicao,
      ano_modelo,
      ano_fabricacao,
      referenciasPneus,
      numero_doc_carga,
      numero_motor,
      placa,
      renavam,
      tombo,
      chassi,
      ...restForm
    } = data;
    const { aquisicao_file, ...restAquisicao } = aquisicao;

    const rest = {
      ...restForm,
      numero_doc_carga: numero_doc_carga?.trim(),
      numero_motor: numero_motor?.trim(),
      placa: placa?.trim(),
      renavam: renavam?.trim() || null,
      tombo: tombo?.trim() || null,
      chassi: chassi.trim(),
    };

    const veiculoCaracteristicas = {
      ano_fabricacao: ano_fabricacao?.getFullYear(),
      ano_modelo: ano_modelo?.getFullYear(),
      referenciasPneus:
        referenciasPneus && formatReferenciasPneus(referenciasPneus),
      aquisicao_file,
    };

    if (action === 'cadastrar') {
      const {
        prefixo_sequencia,
        prefixo_tipo,
        emprego,
        data_identificador,
        identificador: ident,
        ...restDataCadastrar
      } = rest as Partial<IFormCadastarCedido>;
      try {
        const createdVeiculo = await createVeiculo({
          prefixo: {
            prefixo_sequencia,
            prefixo_tipo,
            emprego,
          },
          identificador: {
            data_identificador,
            identificador: ident,
          },
          aquisicao: {
            origem_aquisicao: '2',
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
      try {
        await updateVeiculo(
          {
            ...veiculoCaracteristicas,
            ...rest,
            aquisicao: {
              ...restAquisicao,
            },
          },
          veiculo.id_veiculo && veiculo.id_veiculo,
        );
        history.push('/veiculos/consulta');
      } catch (error) {
        console.log(error);
      }
    }
    /* const referenciasFormated = data.referenciasPneus.map(
      (item: any): object => {
        return {
          id_referencia_pneu: item.value,
        };
      },
    );
    const dataFormated = (): any => {
      if (action === 'editar') {
        return {
          ...data,
          // opm_carga: data.opm_carga,
          referenciasPneus: referenciasFormated,
          ano_fabricacao: new Date(data.ano_fabricacao).getFullYear(),
          ano_modelo: new Date(data.ano_modelo).getFullYear(),
          numero_crv: data.numero_crv.trim(),
          codigo_seguranca_crv: data.codigo_seguranca_crv.trim(),
          renavam: data.renavam.trim(),
          numero_doc_carga: data.numero_doc_carga.trim(),
          // opm_carga: opmSelected?.uni_codigo,
        };
      }
      return {
        ...data,
        // opm_carga: data.opm_carga,
        referenciasPneus: referenciasFormated,
        ano_fabricacao: new Date(data.ano_fabricacao).getFullYear(),
        ano_modelo: new Date(data.ano_modelo).getFullYear(),
        numero_crv: data.numero_crv.trim(),
        codigo_seguranca_crv: data.codigo_seguranca_crv.trim(),
        prefixo_sequencia: data.prefixo_sequencia.trim(),
        renavam: data.renavam.trim(),
        numero_doc_carga: data.numero_doc_carga.trim(),
        prefixo: {
          prefixo_tipo: data.prefixo_tipo,
          emprego: data.emprego,
          prefixo_sequencia: data.prefixo_sequencia,
          data_prefixo: data.data_prefixo,
          criado_por: 1,
        },
        aquisicao: {
          origem_aquisicao: '2',
          // forma_aquisicao: data.aquisicaoCed.forma_aquisicao,
          id_orgao_aquisicao: data.aquisicaoCed.id_orgao_aquisicao,
          data_aquisicao: data.aquisicaoCed.data_aquisicao,
          valor_aquisicao: '0',
        },
        identificador: {
          data_identificador: data.data_identificador,
          identificador: data.identificador,
        },
      };
    };
    if (action === 'editar') {
      try {
        await updateVeiculo(
          dataFormated(),
          veiculo.id_veiculo && veiculo.id_veiculo,
        );
      } catch (error) {
        console.log(error);
      }
    }
    if (action === 'cadastrar') {
      try {
        console.log(dataFormated());
        const createdVeiculo = await createVeiculo(dataFormated());
        if (createdVeiculo) {
          reset(initialValues());
        }
      } catch (error) {
        console.log(error);
      }
    } */
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
        setValue('aquisicaoCed.aquisicao_file', file);
      }
    }
  }

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Row>
            <FormGroup required name="Data de Aquisição" cols={[4, 6, 12]}>
              <Controller
                name="aquisicaoCed.data_aquisicao"
                control={control}
                render={({ onChange, value }) => (
                  <DatePicker
                    showYearDropdown
                    selected={value}
                    onChange={onChange}
                    error={errors.aquisicaoCed?.data_aquisicao?.message}
                    dateFormat="dd/MM/yyyy"
                    disabled={disabled}
                  />
                )}
              />
            </FormGroup>

            {/* <FormGroup name="Valor de Aquisição" cols={[4, 6, 12]}>
                <Controller
                  name="valor_aquisicao"
                  control={control}
                  render={({ onChange, value }) => (
                    <InputCurrency
                      value={value}
                      onChange={(
                        event: any,
                        valueInput: any,
                        maskedValue: any,
                      ) => onChange(Number(valueInput))}
                      error={errors.valor_aquisicao?.message}
                      disabled={disabled}
                    />
                  )}
                />
              </FormGroup> */}
          </Row>
          <Row>
            <FormGroup name="Orgão de Aquisição" cols={[6, 12, 12]}>
              <Controller
                name="aquisicaoCed.id_orgao_aquisicao"
                control={control}
                render={({ onChange, value }) => (
                  <ReactSelect
                    placeholder="Selecione um"
                    optionsSelect={orgaosAquisicao}
                    value={orgaosAquisicao.find(
                      (option) => option.value === value,
                    )}
                    onChange={(option: ValueType<OptionType>) => {
                      const optionSelected = option as OptionType;
                      onChange(optionSelected.value);
                    }}
                    error={errors.aquisicaoCed?.id_orgao_aquisicao?.message}
                    isDisabled={disabled}
                  />
                )}
              />
            </FormGroup>
            <FormGroup name="Documento Aquisição" cols={[6, 12, 12]}>
              <Controller
                name="aquisicaoCed.doc_aquisicao"
                control={control}
                render={(props) => (
                  <FormInput
                    {...props}
                    disabled={disabled}
                    error={errors.aquisicaoCed?.doc_aquisicao?.message}
                  />
                )}
              />
            </FormGroup>
          </Row>
          <Row>
            <FormGroup
              name="Arquivo de aquisição (OBS: MAX: 2MB - PNG/JPEG/JPG/PDF)"
              cols={[6, 3, 2]}
            >
              <Controller
                name="aquisicaoCed.aquisicao_file"
                control={control}
                render={({ onChange, value }) => (
                  <FormInputFile
                    onChange={(e) => {
                      handleSelectedFile(e);
                    }}
                    error={errors.aquisicaoCed?.aquisicao_file?.message}
                    disabled={disabled}
                  />
                )}
              />

              {action === 'editar' && veiculo.aquisicoes[0].file_path && (
                <ButtonAccordeon
                  style={{
                    background: '#e4e9ee',
                    marginTop: '8px',
                    justifyContent: 'space-between',
                    color: '#444444',
                  }}
                  onClick={async (event) => {
                    event.preventDefault();
                    const file = await api.get(
                      `documentos/${veiculo.aquisicoes[0].file_path}`,
                      {
                        responseType: 'blob',
                      },
                    );

                    const blob = new Blob([file.data], {
                      type: file.headers['content-type'],
                    });

                    const fileURL = URL.createObjectURL(blob);
                    window.open(fileURL, '_blank');
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
                      error={errors.data_operacao?.message}
                      dateFormat="dd/MM/yyyy"
                      disabled={disabled}
                    />
                  )}
                  error={errors.data_operacao?.message}
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
                onClick={() => reset(initialValues())}
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

export default FormCedido;
