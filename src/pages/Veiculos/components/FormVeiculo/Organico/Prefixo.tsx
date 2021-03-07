import React, { useState, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ValueType } from 'react-select';
import { useToast } from '@chakra-ui/react';
import api from '../../../../../services/api';
import NumberFormat from '../../../../../components/form/InputNumberFormat';
import ReactSelect from '../../../../../components/form/ReactSelect';
import Row from '../../../../../components/form/Row';
import FormGroup from '../../../../../components/form/FormGroup';
import { IPrefixoOrganicoOrCedido } from '../utils/schemaFormVeiculo';

type OptionFormat = { label: string; value: string };

const optionsPrefixosTipos = [
  { value: '21', label: '21 - ADM' },
  { value: '22', label: '22 - Apoio' },
  { value: '23', label: '23 - Operacional' },
  { value: 'MR', label: 'MR - RAIO' },
  { value: 'MP', label: 'MP - POG' },
];

const optionsEmprego = [
  { value: '0', label: 'Não Consta' },
  { value: '1', label: 'Transporte de Pessoas' },
  { value: '2', label: 'Transporte de Animais' },
  { value: '3', label: 'Transporte Especializado' },
  { value: '4', label: 'Base Móvel' },
  { value: '5', label: 'Ambulância' },
  { value: '50', label: 'Operacional - Caracterizada' },
  { value: '51', label: 'Operacional - Inteligência' },
];

const PrefixoCedidoOrOrganico: React.FC = () => {
  const {
    control,
    errors,
    setValue,
    clearErrors,
  } = useFormContext<IPrefixoOrganicoOrCedido>();
  const [isPrefixoSequenciaClosed, setIsPrefixoSequenciaClosed] = useState(
    true,
  );
  const toast = useToast();

  const [prefixoTipo, setPrefixoTipo] = useState('');

  const prefixoValid = useCallback(
    (prefixoSequencia: string) => {
      async function isValidPrefixo(): Promise<void> {
        try {
          await api.get(
            `/prefixos/check?prefixoTipo=${prefixoTipo}&prefixoSequencia=${prefixoSequencia}`,
          );
          clearErrors(['prefixo_sequencia', 'prefixo_tipo']);
        } catch (error) {
          if (error.response) {
            switch (error.response.status) {
              case 400: {
                toast({
                  title: 'Erro',
                  description: 'Prefixo já existente',
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                  position: 'top-right',
                });
                setValue('prefixo_sequencia', '');

                break;
              }

              default: {
                /* empty */
              }
            }
          }
        }
      }

      isValidPrefixo();
    },
    [toast, prefixoTipo, setValue, clearErrors],
  );

  return (
    <>
      <Row>
        {/* <FormGroup required name="Data Prefixo" cols={[2, 6, 6]}>
          <Controller
            name="data_prefixo"
            control={control}
            render={({ onChange, value }) => (
              <DatePicker
                showYearDropdown
                selected={value}
                onChange={onChange}
                error={errors.data_prefixo?.message}
                dateFormat="dd/MM/yyyy"
              />
            )}
          />
        </FormGroup> */}
        <FormGroup required name="Prefixo Tipo" cols={[3, 6, 12]}>
          <Controller
            name="prefixo_tipo"
            control={control}
            render={({ onChange, value }) => (
              <ReactSelect
                placeholder="Selecione..."
                optionsSelect={optionsPrefixosTipos}
                value={optionsPrefixosTipos.find(
                  (option) => option.value === value,
                )}
                onChange={(option: ValueType<OptionFormat>) => {
                  const optionSelected = option as OptionFormat;
                  onChange(optionSelected.value);
                  setPrefixoTipo(optionSelected.value);
                  setIsPrefixoSequenciaClosed(false);
                }}
                error={errors.prefixo_tipo?.message}
              />
            )}
          />
        </FormGroup>
        <FormGroup required name="Prefixo Sequência" cols={[2, 6, 12]}>
          <Controller
            name="prefixo_sequencia"
            control={control}
            render={({ onChange, value }) => (
              <NumberFormat
                onChange={onChange}
                value={value}
                error={errors.prefixo_sequencia?.message}
                format="#####"
                disabled={isPrefixoSequenciaClosed}
                onBlur={() => prefixoValid(value)}
              />
            )}
          />
        </FormGroup>
        <FormGroup required name="Emprego" cols={[5, 6, 12]}>
          <Controller
            name="emprego"
            control={control}
            render={({ onChange, value }) => (
              <ReactSelect
                placeholder="Selecione..."
                optionsSelect={optionsEmprego}
                value={optionsEmprego.find((option) => option.value === value)}
                onChange={(option: ValueType<OptionFormat>) => {
                  const optionSelected = option as OptionFormat;
                  onChange(optionSelected.value);
                }}
                error={errors.emprego?.message}
              />
            )}
          />
        </FormGroup>
      </Row>
    </>
  );
};

export default PrefixoCedidoOrOrganico;
