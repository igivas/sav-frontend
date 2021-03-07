import React, { useState } from 'react';
import { FaPlus, FaSearch, FaSave } from 'react-icons/fa';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import DataTable, { IColumns } from '../../../../components/DataTable';
import PanelBottomActions from '../../../../components/PanelBottomActions';
import Button from '../../../../components/form/Button';
import { useVeiculo } from '../../../../contexts/VeiculoContext';
import Modal from '../../../../components/Modal';
import Row from '../../../../components/form/Row';
import FormGroup from '../../../../components/form/FormGroup';
import FormInput from '../../../../components/form/FormInput';
import DatePicker from '../../../../components/form/FormDatePicker';
import FormTextArea from '../../../../components/form/FormTextArea';
import { Container, PanelAction, Form } from './styles';

const schema = Yup.object().shape({
  data_identificador: Yup.date().typeError('Insira uma data válida!'),
  identificador: Yup.string()
    .required('Esse campo é requerido')
    .max(15, 'Tamanho máximo 15 caracteres'),
  observacao: Yup.string().max(150, 'Tamanho máximo 150 caracteres'),
});

interface IFormInputs {
  data_identificador: string;
  identificador: string;
  observacao: string;
}

const TabIdentificadores: React.FC = () => {
  const { veiculo, createIdentificador } = useVeiculo();
  const { handleSubmit, errors, control } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const [showModal, setShowModal] = useState(false);

  const onSubmit = async (data: any): Promise<void> => {
    try {
      const createdIdentificador = await createIdentificador(
        veiculo.id_veiculo,
        { ...data },
      );

      if (createdIdentificador) {
        setShowModal(false);

        // setDataIdentificador(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const colunas: IColumns = [
    {
      field: 'data_identificador',
      text: 'Data',
      type: { name: 'date', format: 'dd/MM/yyyy' },
    },
    {
      field: 'identificador',
      text: 'Identificador',
      type: { name: 'text' },
    },
    {
      field: 'observacao',
      text: 'OBS',
      type: { name: 'text' },
    },
  ];

  function handleClickEditar(row: object): void {
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
      fields: ['data_identificador'],
      orders: ['desc'],
    },
  };

  const handleOpenModal = (): void => {
    setShowModal(true);
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
  };

  return (
    <Container>
      <div>
        <DataTable
          columns={colunas}
          options={options}
          data={veiculo.identificadores}
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
              <FormGroup required name="Data Identificador" cols={[4, 12, 12]}>
                <Controller
                  name="data_identificador"
                  control={control}
                  defaultValue={false}
                  render={({ onChange, value }) => (
                    <DatePicker
                      showYearDropdown
                      selected={value}
                      onChange={onChange}
                      error={errors.data_identificador?.message}
                      dateFormat="dd/MM/yyyy"
                    />
                  )}
                />
              </FormGroup>

              <FormGroup required name="Identificador" cols={[8, 12, 12]}>
                <Controller
                  name="identificador"
                  control={control}
                  defaultValue=""
                  render={(props) => (
                    <FormInput
                      {...props}
                      error={errors.identificador?.message}
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
                  defaultValue=""
                  render={(props) => (
                    <FormTextArea
                      {...props}
                      rows={4}
                      maxLength={150}
                      error={errors.observacao?.message}
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

export default TabIdentificadores;
