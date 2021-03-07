import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ValueType } from 'react-select';
import api from '../../../../../services/api';
import { useAuth } from '../../../../../contexts/auth';
import FormGroup from '../../../../../components/form/FormGroup';
import Row from '../../../../../components/form/Row';
import ReactSelect from '../../../../../components/form/ReactSelect';
import FormInput from '../../../../../components/form/FormInput';
import NumberFormat from '../../../../../components/form/InputNumberFormat';
import DatePicker from '../../../../../components/form/FormDatePicker';
import { ICargaAtualOrganicoOrCedido } from '../utils/schemaFormVeiculo';

type OptionFormat = { label: string; value: string };

interface IOPMs {
  id_opm: number;
  nome: string;
  sigla: string;
}

interface IOrgao {
  id_orgao: number;
  nome: string;
  sigla: string;
}

const optionsTipoDocCarga: OptionFormat[] = [
  { value: '', label: 'Selecione uma Opção' },
  { value: '0', label: 'BCG' },
  { value: '1', label: 'DOE' },
];

/* const optionsTipoTombo: OptionFormat[] = [
  { value: '', label: 'Selecione uma Opção' },
  { value: '0', label: 'PMCE' },
  { value: '1', label: 'Outro Orgão' },
]; */

interface IProps {
  disabled: boolean;
}

const FormCargaOrganicoOrCedido: React.FC<IProps> = ({ disabled }) => {
  // const [opmSearch, setOpmSearch] = useState<OptionFormat[]>([]);
  const [optionsTipoTombo, setOptionsTipoTombo] = useState<OptionFormat[]>([]);

  const { signOut } = useAuth();
  const {
    control,
    errors,
    watch,
    setValue,
    getValues,
  } = useFormContext<ICargaAtualOrganicoOrCedido>();

  const formaAquisicao = watch('aquisicaoOrg.forma_aquisicao');

  formaAquisicao === '0'
    ? setValue('orgao_tombo', '8')
    : setValue('orgao_tombo', null);

  const orgaoTombo = getValues('orgao_tombo');

  // const promiseOptionsOpms = async (
  //   inputValue: string,
  // ): Promise<OptionFormat[]> => {
  //   if (inputValue.length >= 3) {
  //     const response = await api.get<IOPMs[]>(`opms?query=${inputValue}`);

  //     const responseFormated = response.data.map<OptionFormat>((item) => {
  //       return {
  //         value: item.id_opm.toString(),
  //         label: `${item.nome} - ${item.sigla}`,
  //       };
  //     });

  //     // setOpmSearch(responseFormated);

  //     return responseFormated;
  //   }

  //   return [];
  // };

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const [listOrgaos] = await Promise.all([api.get<IOrgao[]>('orgaos')]);

        const formatedOrgaos = listOrgaos.data.map<OptionFormat>((orgao) => ({
          label: `${orgao.nome} - ${orgao.sigla}`,
          value: orgao.id_orgao.toString(),
        }));

        setOptionsTipoTombo([
          { label: 'Selecione uma Opção', value: '' },
          ...formatedOrgaos,
        ]);
      } catch (error) {
        if (error.response && error.response.status === 401) signOut();
      }
    }
    load();
  }, [signOut]);

  return (
    <>
      <Row>
        <FormGroup name="Orgão do Tombo" cols={[3, 6, 12]}>
          <Controller
            name="orgao_tombo"
            control={control}
            render={({ onChange, value }) => (
              <ReactSelect
                placeholder="Selecione..."
                optionsSelect={optionsTipoTombo}
                value={optionsTipoTombo.find(
                  (option) => option.value === value,
                )}
                onChange={(option: ValueType<OptionFormat>) => {
                  const optionSelected = option as OptionFormat;
                  onChange(optionSelected.value);
                }}
                error={errors.orgao_tombo?.message}
                isDisabled={
                  disabled || formaAquisicao === '0' || orgaoTombo === '8'
                }
              />
            )}
          />
        </FormGroup>

        <FormGroup name="Tombo" cols={[2.5, 6, 12]}>
          <Controller
            name="tombo"
            control={control}
            render={(props) => {
              const toUpperTombo = String(props.value || '');
              return (
                <FormInput
                  {...props}
                  disabled={disabled}
                  error={errors.tombo?.message}
                  value={toUpperTombo.toUpperCase()}
                />
              );
            }}
          />
        </FormGroup>

        <FormGroup name="Tipo Doc. Carga" cols={[2.5, 6, 12]}>
          <Controller
            name="tipo_doc_carga"
            control={control}
            render={({ onChange, value }) => (
              <ReactSelect
                placeholder="Selecione..."
                optionsSelect={optionsTipoDocCarga}
                value={optionsTipoDocCarga.find(
                  (option) => option.value === value,
                )}
                onChange={(option: ValueType<OptionFormat>) => {
                  const optionSelected = option as OptionFormat;
                  onChange(optionSelected.value);
                }}
                error={errors.tipo_doc_carga?.message}
                isDisabled={disabled}
              />
            )}
          />
        </FormGroup>
        <FormGroup name="Nº Doc. Carga" cols={[2, 6, 12]}>
          <Controller
            name="numero_doc_carga"
            control={control}
            render={({ onChange, value }) => (
              <NumberFormat
                onChange={onChange}
                value={value}
                error={errors.numero_doc_carga?.message}
                format="####"
                disabled={disabled}
              />
            )}
          />
        </FormGroup>
        <FormGroup name="Data Doc. Carga" cols={[2, 6, 12]}>
          <Controller
            name="data_doc_carga"
            control={control}
            render={({ onChange, value }) => (
              <DatePicker
                showYearDropdown
                selected={value}
                onChange={onChange}
                error={errors.data_doc_carga?.message}
                dateFormat="dd/MM/yyyy"
                disabled={disabled}
              />
            )}
          />
        </FormGroup>
      </Row>
    </>
  );
};

export default FormCargaOrganicoOrCedido;
