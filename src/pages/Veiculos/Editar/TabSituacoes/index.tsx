import React, { useState, useEffect } from 'react';
import { FaSearch, FaSave } from 'react-icons/fa';

import { ValueType } from 'react-select';
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

import DatePicker from '../../../../components/form/FormDatePicker';

import ReactSelect from '../../../../components/form/ReactSelect';
import api from '../../../../services/api';
import FormTextArea from '../../../../components/form/FormTextArea';
import { Container, PanelAction, Form } from './styles';

type OptionType = { label: string; value: string };

const schema = Yup.object().shape({
  data_situacao: Yup.date().typeError('Insira uma data válida!'),
  id_situacao_tipo: Yup.string().required('Esse campo é requerido'),
  observacao: Yup.string().max(150, 'Tamanho máximo 150 caracteres'),
});

interface IFormInputs {
  data_situacao: string;
  id_situacao_tipo: string;
  km: string;
  observacao: string;
}

interface ISituacaoTipo {
  id_situacao_tipo: number;
  nome: string;
  especificacao: string;
}

interface IOptionsProps {
  value: string;
  label: string;
}

const TabSituacoes: React.FC = () => {
  const [situacoes, setSituacoes] = useState<IOptionsProps[]>([]);
  const { veiculo, createSituacao } = useVeiculo();
  const { handleSubmit, errors, control } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const [showModal, setShowModal] = useState(false);

  const onSubmit = async (data: any): Promise<void> => {
    try {
      const createdSituacao = await createSituacao(veiculo.id_veiculo, {
        ...data,
        criado_por: 1,
      });

      if (createdSituacao) {
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const colunas: IColumns = [
    {
      field: 'data_situacao',
      text: 'Data',
      type: { name: 'date', format: 'dd/MM/yyyy' },
    },
    {
      field: 'nome',
      text: 'Situação',
      type: { name: 'text' },
    },
    {
      field: 'km',
      text: 'KM',
      type: { name: 'text' },
    },
    {
      field: 'observacao',
      text: 'OBS',
      type: { name: 'text' },
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
      fields: ['data_situacao'],
      orders: ['desc'],
    },
  };

  const handleOpenModal = (): void => {
    setShowModal(true);
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
  };

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const situacoesTipos = await api.get(`situacoes_tipos`);
        const situacoesTiposFormated = situacoesTipos.data.map(
          (situacaoAtual: ISituacaoTipo) => {
            return {
              value: situacaoAtual.id_situacao_tipo,
              label: situacaoAtual.nome,
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
    <Container>
      <div>
        <DataTable
          columns={colunas}
          options={options}
          data={veiculo.situacoes}
        />

        <Modal
          title="Cadastro de Situação"
          isOpen={showModal}
          handleCloseModal={handleCloseModal}
          width={600}
          height={400}
        >
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <FormGroup required name="Data Situação" cols={[4, 6, 12]}>
                <Controller
                  name="data_situacao"
                  control={control}
                  defaultValue={false}
                  render={({ onChange, onBlur, value }) => (
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

              <FormGroup required name="Situação Tipo" cols={[8, 12, 12]}>
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
                      rows={5}
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
        <Button color="green" onClick={handleOpenModal}>
          Mudar Situação
        </Button>
      </PanelBottomActions>
    </Container>
  );
};

export default TabSituacoes;
