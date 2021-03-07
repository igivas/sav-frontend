import React, { useEffect, useState } from 'react';

import { FaEraser, FaSave } from 'react-icons/fa';
import { useToast } from '@chakra-ui/react';
import BoxContent from '../../../components/BoxContent';
import ReactSelect from '../../../components/form/ReactSelect';
import TituloPagina from '../../../components/TituloPagina';
import { Container } from './styles';
import FormCategory from '../../../components/form/FormCategory';
import Row from '../../../components/form/Row';
import FormGroup from '../../../components/form/FormGroup';
import FormImput from '../../../components/form/FormInput';
import api from '../../../services/api';
import PanelBottomActions from '../../../components/PanelBottomActions';
import Button from '../../../components/form/Button';

type OptionFormat = {
  value: string;
  label: string;
};

type IVeiculoEspecie = {
  id_veiculo_especie: number;
  nome: string;
};

const NovaReferenciaPneu: React.FC = () => {
  const toast = useToast();
  const [veiculosEspecies, setVeiculosEspecies] = useState<OptionFormat[]>([]);
  const [selectedEspecie, setSelectedEspecie] = useState<OptionFormat>(
    {} as OptionFormat,
  );
  const [referenciaPneu, setReferenciaPneu] = useState('');
  const handleSubmit = async (): Promise<void> => {
    try {
      await api.post('referencias_pneus', {
        id_veiculo_especie: selectedEspecie.value,
        descricao: referenciaPneu,
      });
      toast({
        title: 'Sucesso!',
        description: 'Referência criada com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      toast({
        title: 'Ocorreu um erro.',
        description: 'Ocorreu um error ao tentar criar a referência.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const especies = await api.get<IVeiculoEspecie[]>('veiculos_especies');
        const especiesFormated = especies.data.map((esp) => {
          return {
            value: esp.id_veiculo_especie.toString(),
            label: esp.nome,
          };
        });

        setVeiculosEspecies(especiesFormated);
      } catch (error) {
        // if (error.response && error.response.status === 401) signOut();
      }
    }

    load();
  }, []);

  return (
    <Container>
      <TituloPagina title="Cadastro de Pneus" />
      <BoxContent>
        <div>
          <FormCategory> Cadastro de Categorias </FormCategory>
          <Row>
            <FormGroup cols={[3, 6, 12]} name="Espécie de Veículo">
              <ReactSelect
                placeholder="Selecione..."
                optionsSelect={veiculosEspecies}
                onChange={(e) => {
                  const value = e as OptionFormat;
                  setSelectedEspecie(value);
                }}
                value={selectedEspecie}
              />
            </FormGroup>

            <FormGroup cols={[3, 6, 12]} name="Referência de Pneus">
              <FormImput
                value={referenciaPneu}
                onChange={(e) => setReferenciaPneu(e.target.value)}
              />
            </FormGroup>
          </Row>
        </div>
        <PanelBottomActions>
          <>
            <Button
              color="yellow"
              icon={FaEraser}
              type="button"
              onClick={() => {
                setSelectedEspecie({} as OptionFormat);
                setReferenciaPneu('');
              }}
            >
              Limpar
            </Button>
            <Button
              color="green"
              icon={FaSave}
              type="submit"
              onClick={handleSubmit}
            >
              Salvar
            </Button>
          </>
        </PanelBottomActions>
      </BoxContent>
    </Container>
  );
};

export default NovaReferenciaPneu;
