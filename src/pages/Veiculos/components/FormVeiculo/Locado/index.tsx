import React, { useState, useEffect, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { parseISO } from 'date-fns';
import { MdModeEdit } from 'react-icons/md';
import { FaSave, FaTimes, FaEraser, FaExternalLinkAlt } from 'react-icons/fa';
import api from 'services/api';
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
import { Form } from './styles';
import Identificador from './Identificador';
import { dadosGerais, identificador } from '../utils/schemaFormVeiculo';
import { aquisicaoGenerica } from '../utils/schemaFormVeiculo';

import DadosGerais from './DadosGerais';

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

const aquisicaoLoc = aquisicaoGenerica;

const schemaEditar = Yup.object()
  .shape({
    aquisicaoLoc,
  })
  .concat(dadosGerais);
export type IFormLocadoEditar = Yup.InferType<typeof schemaEditar>;

const schemaCadastrar = schemaEditar.concat(identificador);
export type IFormLocadoCadastrar = Yup.InferType<typeof schemaCadastrar>;

export type IFormInputsLocado = IFormLocadoEditar | IFormLocadoCadastrar;

const FormLocado: React.FC<IProps> = ({ action }) => {
  const { veiculo, createVeiculo, updateVeiculo } = useVeiculo();
  const history = useHistory();
  const toast = useToast();
  const [disabled, setDisabled] = useState(action !== 'cadastrar');
  const [, setOrgaosAquisicao] = useState<OptionType[]>([]);

  // const [origemAquisicao] = useState('');

  const [, setVeiculoReferencias] = useState<OptionType[]>([]);

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const [referencias, orgaos] = await Promise.all([
          api.get('referencias_pneus'),
          api.get('orgaos'),
        ]);

        const orgaosFormated = orgaos.data.map((orgaoAtual: IOrgao) => {
          return {
            value: orgaoAtual.id_orgao,
            label: `${orgaoAtual.sigla} - ${orgaoAtual.nome}`,
          };
        });

        const referenciasFormated = referencias.data.map(
          (referencia: IVeiculoReferencia) => {
            return {
              value: referencia.id_referencia_pneu,
              label: referencia.descricao,
            };
          },
        );

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
  //       value: item.id_referencia_pneu,
  //       label: item.descricao,
  //     };
  //   });
  // }, [veiculo]);

  const initialCleanValues = {
    aquisicaoLoc: {
      origem_aquisicao: '2',
      doc_aquisicao: '',
    },
    identificador: '',
  } as IFormInputsLocado;

  const initialValues = (): object => {
    if (action === 'editar') {
      return {
        aquisicaoLoc: {
          data_aquisicao:
            parseISO(veiculo.aquisicoes[0].data_aquisicao) || undefined,
          doc_aquisicao: veiculo.aquisicoes[0].doc_aquisicao || undefined,
          aquisicao_file: veiculo.aquisicoes[0].file_path || undefined,
        },
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
        orgao_tombo: veiculo.orgao_tombo || undefined,
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
        doc_aquisicao: '',
        data_aquisicao: undefined,
        data_prefixo: undefined,
        origem_aquisicao: '',
        forma_aquisicao: '',
        id_orgao_aquisicao: '',
        valor_aquisicao: 0,
        observacao: veiculo.observacao || '',
      };
    }
    return initialCleanValues;
  };

  const methods = useForm<IFormInputsLocado>({
    resolver: yupResolver(
      action === 'cadastrar' ? schemaCadastrar : schemaEditar,
    ),
    defaultValues: initialValues(),
  });

  const { handleSubmit, errors, control, reset, setValue } = methods;

  const onSubmit = async (data: IFormInputsLocado): Promise<void> => {
    const {
      aquisicaoLoc: aquisicao,
      placa,
      renavam,
      chassi,
      ...restForm
    } = data;
    const rest = {
      ...restForm,
      placa: placa?.trim(),
      renavam: renavam?.trim(),
      chassi: chassi.trim(),
    };
    const { aquisicao_file, ...restAquiscao } = aquisicao;
    if (action === 'cadastrar') {
      try {
        const {
          identificador: ident,
          data_identificador,
          ...restData
        } = rest as Partial<IFormLocadoCadastrar>;

        const createdVeiculo = await createVeiculo({
          aquisicao: {
            origem_aquisicao: '1',
            ...restAquiscao,
          },
          aquisicao_file,
          identificador: {
            identificador: ident,
            data_identificador,
          },
          ...restData,
        });

        if (createdVeiculo) {
          history.push('/veiculos/consulta');
          reset(initialValues());
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await updateVeiculo(
          {
            aquisicao: {
              ...restAquiscao,
            },
            aquisicao_file,
            ...rest,
          },
          veiculo.id_veiculo && veiculo.id_veiculo,
        );
        history.push('/veiculos/consulta');
      } catch (error) {
        console.log(error);
      }
    }
    /*  const referenciasFormated =
      data.referenciasPneus &&
      data.referenciasPneus.map((item: any): object => {
        return {
          id_referencia_pneu: item.value,
        };
      });
    console.log(referenciasFormated);
    const dataFormated = (): any => {
      if (action === 'editar') {
        return {
          ...data,
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

        referenciasPneus: referenciasFormated,
        ano_fabricacao: new Date(data.ano_fabricacao).getFullYear(),
        ano_modelo: new Date(data.ano_modelo).getFullYear(),
        numero_crv: data.numero_crv.trim(),
        codigo_seguranca_crv: data.codigo_seguranca_crv.trim(),
        prefixo_sequencia: data.prefixo_sequencia.trim(),
        renavam: data.renavam.trim(),
        numero_doc_carga: data.numero_doc_carga.trim(),
        aquisicao: {
          origem_aquisicao: data.origem_aquisicao,
          forma_aquisicao: data.forma_aquisicao,
          id_orgao_aquisicao: data.id_orgao_aquisicao,
          data_aquisicao: data.data_aquisicao,
          valor_aquisicao: data.valor_aquisicao,
        },
        identificador: {
          data_identificador: data.data_identificador,
          identificador: data.identificador,
        },
      };
    }; */

    /* if (action === 'editar') {
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
        const createdVeiculo = await createVeiculo(dataFormated());

        if (createdVeiculo) {
          reset(initialValues());
        }
        console.log(dataFormated());
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
        setValue('aquisicaoLoc.aquisicao_file', file);
      }
    }
  }

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <>
            <Row>
              <FormGroup required name="Data da locação" cols={[3, 6, 12]}>
                <Controller
                  name="aquisicaoLoc.data_aquisicao"
                  control={control}
                  render={({ onChange, value }) => (
                    <DatePicker
                      showYearDropdown
                      selected={value}
                      onChange={onChange}
                      error={errors.aquisicaoLoc?.data_aquisicao?.message}
                      dateFormat="dd/MM/yyyy"
                      disabled={disabled}
                    />
                  )}
                />
              </FormGroup>

              {/* <FormGroup
                required
                name="Empresa de Aquisição"
                cols={[5, 12, 12]}
              >
                <Controller
                  name="id_orgao_aquisicao"
                  control={control}
                  render={({ onChange, value }) => (
                    <ReactSelect
                      placeholder="Selecione..."
                      optionsSelect={orgaosAquisicaoFiltered}
                      value={orgaosAquisicao.find(
                        (option) => option.value === value,
                      )}
                      onChange={(option: ValueType<OptionType>) => {
                        const optionSelected = option as OptionType;
                        onChange(optionSelected.value);
                      }}
                      error={errors.aquisicaoLoc?.id_orgao_aquisicao?.message}
                      isDisabled={disabled}
                    />
                  )}
                />
              </FormGroup> */}
              <FormGroup
                name="Descrição do Documento Locação"
                cols={[4, 12, 12]}
              >
                <Controller
                  name="aquisicaoLoc.doc_aquisicao"
                  control={control}
                  render={(props) => (
                    <FormInput
                      {...props}
                      disabled={disabled}
                      error={errors.aquisicaoLoc?.doc_aquisicao?.message}
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup
                name="Arquivo de locação (OBS: MAX: 2MB - PNG/JPEG/JPG/PDF)"
                cols={[6, 3, 2]}
              >
                <Controller
                  name="aquisicaoLoc.aquisicao_file"
                  control={control}
                  render={({ onChange, value }) => (
                    <FormInputFile
                      onChange={(e) => {
                        handleSelectedFile(e);
                      }}
                      error={errors.aquisicaoLoc?.aquisicao_file?.message}
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
                    <FaExternalLinkAlt
                      size={16}
                      style={{ marginRight: '8px' }}
                    />
                    Clique aqui para ver o arquivo
                  </ButtonAccordeon>
                )}
              </FormGroup>
            </Row>
            {action === 'cadastrar' && (
              <>
                <FormCategory>IDENTIFICADOR ATUAL</FormCategory>
                <Identificador disabled={disabled} />
              </>
            )}
          </>

          <>
            <FormCategory>DADOS GERAIS</FormCategory>
            <DadosGerais action={action} disabled={disabled} />

            {/* <FormCategory>DADOS ADICIONAIS</FormCategory>
            <Row>
              <FormGroup name="Referências Pneus" cols={[8, 6, 12]}>
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
                      // error={errors.referenciasPneus?.message}
                      isDisabled={disabled}
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
            </Row> */}
          </>
        </div>

        <PanelBottomActions>
          {action === 'editar' ? (
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
          ) : (
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

export default FormLocado;
