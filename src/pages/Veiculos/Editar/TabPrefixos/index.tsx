import React, { useState, useCallback } from 'react';
import { FaPlus, FaSearch, FaSave } from 'react-icons/fa';
import { ValueType } from 'react-select';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { useToast } from '@chakra-ui/react';
import api from 'services/api';
import DataTable, { IColumns } from '../../../../components/DataTable';
import PanelBottomActions from '../../../../components/PanelBottomActions';
import Button from '../../../../components/form/Button';
import { useVeiculo } from '../../../../contexts/VeiculoContext';
import Modal from '../../../../components/Modal';
import Row from '../../../../components/form/Row';
import FormGroup from '../../../../components/form/FormGroup';
import NumberFormat from '../../../../components/form/InputNumberFormat';
import ReactSelect from '../../../../components/form/ReactSelect';

import { Container, PanelAction, Form } from './styles';

type OptionType = { label: string; value: string };

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

const optionsPrefixosTipos = [
  { value: '21', label: '21 - ADM' },
  { value: '22', label: '22 - Apoio' },
  { value: '23', label: '23 - Operacional' },
  { value: 'MR', label: 'MR - RAIO' },
  { value: 'MP', label: 'MP - POG' },
];

const schema = Yup.object().shape({
  prefixo_tipo: Yup.string().required('Esse campo é requerido'),
  emprego: Yup.string().required('Esse campo é requerido'),
  // data_prefixo: Yup.date().typeError('Insira uma data válida!'),
  prefixo_sequencia: Yup.string()
    .required('Esse campo é requerido')
    .max(5, 'No máximo 5 caracteres!'),
});

type IFormInputs = Yup.InferType<typeof schema>;

const TabPrefixos: React.FC = () => {
  const { veiculo, createPrefixo } = useVeiculo();
  const {
    handleSubmit,
    errors,
    control,
    setValue,
    clearErrors,
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const toast = useToast();

  const [showModal, setShowModal] = useState(false);
  const [prefixoTipo, setPrefixoTipo] = useState('');

  const handleOpenModal = (): void => {
    setShowModal(true);
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
  };

  const colunas: IColumns = [
    {
      field: 'prefixo_tipo',
      text: 'Tipo',
      type: {
        name: 'enum',
        enum: optionsPrefixosTipos.reduce((tipo, current) => {
          return {
            ...tipo,
            [current.value]: current.label,
          };
        }, {}),
      },
    },
    {
      field: 'prefixo_sequencia',
      text: 'Sequência',
      type: { name: 'text' },
    },

    {
      field: 'emprego',
      text: 'Emprego',
      type: {
        name: 'enum',
        enum: optionsEmprego.reduce((emprego, current) => {
          return {
            ...emprego,
            [current.value]: current.label,
          };
        }, {}),
      },
    },
  ];

  function handleClickEditar(row: object): void {
    // console.log('minha row', row);
    // history.push('/veiculos/editar');
    alert('Função não está pronta');
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
    order: {
      fields: ['data_prefixo'],
      orders: ['desc'],
    },
  };

  const prefixoValid = useCallback(
    (prefixoSequencia: string) => {
      async function isValidPrefixo(): Promise<void> {
        try {
          await api.get(`/check`, {
            params: {
              query: {
                prefixo: {
                  prefixo_tipo: prefixoTipo,
                  prefixo_sequencia: prefixoSequencia,
                },
              },
            },
          });
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

  const onSubmit = async (data: IFormInputs): Promise<void> => {
    try {
      const createdPrefixo = await createPrefixo(veiculo.id_veiculo, {
        ...data,
        emprego: optionsEmprego.find((option) => option.value === data.emprego),
        criado_por: 1,
      });

      if (createdPrefixo) setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <div>
        <DataTable
          columns={colunas}
          options={options}
          data={veiculo.prefixos}
        />

        <Modal
          title="Cadastro de Identificador"
          isOpen={showModal}
          handleCloseModal={handleCloseModal}
          width={600}
          height={400}
        >
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              {/* <FormGroup name="Data Prefixo" cols={[4, 6, 12]}>
                <Controller
                  name="data_prefixo"
                  control={control}
                  defaultValue={false}
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
              <FormGroup required name="Emprego" cols={[8, 6, 12]}>
                <Controller
                  name="emprego"
                  control={control}
                  defaultValue=""
                  render={({ onChange, value }) => (
                    <ReactSelect
                      placeholder="Selecione..."
                      optionsSelect={optionsEmprego}
                      value={optionsEmprego.find(
                        (option) => option.value === value,
                      )}
                      onChange={(option: ValueType<OptionType>) => {
                        const optionSelected = option as OptionType;
                        onChange(optionSelected.value);
                      }}
                      error={errors.emprego?.message}
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup name="Prefixo Tipo" cols={[8, 6, 12]}>
                <Controller
                  name="prefixo_tipo"
                  control={control}
                  defaultValue=""
                  render={({ onChange, value }) => (
                    <ReactSelect
                      placeholder="Selecione..."
                      optionsSelect={optionsPrefixosTipos}
                      value={optionsPrefixosTipos.find(
                        (option) => option.value === value,
                      )}
                      onChange={(option: ValueType<OptionType>) => {
                        const optionSelected = option as OptionType;
                        setPrefixoTipo(optionSelected.value);
                        onChange(optionSelected.value);
                      }}
                      error={errors.prefixo_tipo?.message}
                    />
                  )}
                />
              </FormGroup>

              <FormGroup required name="Prefixo Sequencia" cols={[4, 6, 12]}>
                <Controller
                  name="prefixo_sequencia"
                  control={control}
                  defaultValue=""
                  render={({ onChange, value }) => (
                    <NumberFormat
                      onChange={onChange}
                      value={value}
                      error={errors.prefixo_sequencia?.message}
                      format="#####"
                      onBlur={() => prefixoValid(value)}
                    />
                  )}
                />
              </FormGroup>
            </Row>

            <PanelAction>
              <Button color="green" icon={FaSave} type="submit">
                Salvar
              </Button>
            </PanelAction>
          </Form>
        </Modal>
      </div>
      <PanelBottomActions>
        <Button color="green" icon={FaPlus} onClick={handleOpenModal}>
          Adicionar
        </Button>
      </PanelBottomActions>
    </Container>
  );
};

export default TabPrefixos;
