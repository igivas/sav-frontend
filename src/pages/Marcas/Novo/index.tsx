import React, { useState, ChangeEvent, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../../services/api';

// import { useVeiculo } from '../../../contexts/VeiculoContext';

import TituloPagina from '../../../components/TituloPagina';
import BoxContent from '../../../components/BoxContent';
import { useVeiculo } from '../../../contexts/VeiculoContext';

import { Container } from './styles';

interface IOptionsProps {
  value: string | number;
  text: string;
}

interface IVeiculoEspecie {
  id_veiculo_especie: number;
  nome: string;
}

interface IVeiculoCores {
  id_cor: number;
  nome: string;
}

const optionsOrigemAquisicao = [
  { value: '0', babel: 'Orgânico' },
  { value: '1', babel: 'Locado' },
  { value: '2', babel: 'Cessão' },
];

const optionsCombustiveis = [
  { value: '1', babel: 'Gasolina' },
  { value: '2', babel: 'Álcool' },
  { value: '3', babel: 'Diesel' },
  { value: '4', babel: 'GNV' },
  { value: '5', babel: 'Elétrico' },
  { value: '6', babel: 'Flex - Gasolina-Álcool' },
];

const optionsFormaAquisicao = [
  { value: '0', babel: 'Compra' },
  { value: '1', babel: 'Doação' },
];

const optionsTipoDocCarga = [
  { value: '0', babel: 'BCG' },
  { value: '1', babel: 'DOE' },
];

const VeiculoNovo: React.FC = () => {
  const history = useHistory();
  const { createVeiculo } = useVeiculo();
  const [veiculosEspecies, setVeiculosEspecies] = useState<IOptionsProps[]>([]);
  const [veiculosCores, setVeiculosCores] = useState<IOptionsProps[]>([]);
  // const [disabled, setDisabled] = useState(true);

  // Primeira row
  const [chassi, setChassi] = useState<string>('');
  const [placa, setPlaca] = useState<string>('');
  const [marca, setMarca] = useState<string>('');
  const [modelo, setModelo] = useState<string>('');
  const [anoFabricacao, setAnoFabricacao] = useState<Date | null>(null);
  const [anoModelo, setAnoModelo] = useState<Date | null>(null);

  // Segunda Row
  const [cor, setCor] = useState<string>('');

  const [motor, setMotor] = useState<string>('');
  const [renavam, setRenavam] = useState<string>('');
  const [combustivel, setCombustivel] = useState<string>('');

  // Terceira row
  const [especie, setEspecie] = useState<string>('');
  const [origemArquisicao, setOrigemArquisicao] = useState<string>('');
  const [formaArquisicao, setFormaArquisicao] = useState<string>('');
  const [orgaoAquisicao, setOrgaoAquisicao] = useState<string | number>('');
  const [valor, setValor] = useState<string | number>('');

  // Quarta row
  const [tipoDocCarga, setTipoDocCarga] = useState<string>('');
  const [numeroDocCarga, setNumeroDocCarga] = useState<string>('');

  const [dataDocCarga, setDataDocCarga] = useState<Date | null>(null);

  const [opmCarga, setOpmCarga] = useState<string | number>('');

  const [saved, setSaved] = useState<boolean>(true);

  const handleChangeChassi = (event: ChangeEvent<HTMLInputElement>): void => {
    setChassi(event.target.value);

    setSaved(false);
  };

  const handleChangePlaca = (event: ChangeEvent<HTMLInputElement>): void => {
    setPlaca(event.target.value);

    setSaved(false);
  };

  const handleChangeAnoModelo = (date: Date | null): void => {
    setAnoModelo(date);

    setSaved(false);
  };

  const handleChangeAnoFabricacao = (date: Date | null): void => {
    setAnoFabricacao(date);

    setSaved(false);
  };

  const handleChangeMotor = (event: ChangeEvent<HTMLInputElement>): void => {
    setMotor(event.target.value);

    setSaved(false);
  };

  const handleChangeRenavam = (event: ChangeEvent<HTMLInputElement>): void => {
    setRenavam(event.target.value);

    setSaved(false);
  };

  const handleChangeCor = (event: ChangeEvent<HTMLSelectElement>): void => {
    setCor(event.target.value);

    setSaved(false);
  };

  const handleChangeEspecie = (event: ChangeEvent<HTMLSelectElement>): void => {
    setEspecie(event.target.value);

    setSaved(false);
  };

  const handleChangeOrigemAquisicao = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    setOrigemArquisicao(event.target.value);

    setSaved(false);
  };

  const handleChangeFormaAquisicao = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    setFormaArquisicao(event.target.value);

    setSaved(false);
  };

  const handleChangeCombustivel = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    setCombustivel(event.target.value);

    setSaved(false);
  };

  const handleChangeTipoDoc = (event: ChangeEvent<HTMLSelectElement>): void => {
    setTipoDocCarga(event.target.value);

    setSaved(false);
  };

  const handleChangeNumeroDocCarga = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setNumeroDocCarga(event.target.value);

    setSaved(false);
  };

  const handleChangeDataDocCarga = (date: Date | null): void => {
    setDataDocCarga(date);

    setSaved(false);
  };

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const especies = await api.get('veiculos_especies');
        const cores = await api.get('veiculos_cores');

        const especiesFormated = especies.data.map((esp: IVeiculoEspecie) => {
          return {
            value: esp.id_veiculo_especie,
            text: esp.nome,
          };
        });

        const coresFormated = cores.data.map((corAtual: IVeiculoCores) => {
          return {
            value: corAtual.id_cor,
            text: corAtual.nome,
          };
        });
        setVeiculosEspecies(especiesFormated);
        setVeiculosCores(coresFormated);
      } catch (error) {
        console.log(error);
      }
    }

    load();
  }, []);

  const novoVeiculo = (): object => {
    return {
      chassi,
      id_cor: cor,
      ano_fabricacao: anoFabricacao,
      ano_modelo: anoModelo,
      placa,
      numero_motor: motor,
      renavam,
      origem_aquisicao: origemArquisicao,
      forma_aquisicao: formaArquisicao,
      tipo_doc_carga: tipoDocCarga,
      numero_doc_carga: numeroDocCarga,
      combustivel,
      data_doc_carga: dataDocCarga,
      id_veiculo_especie: especie,
      id_orgao_aquisicao: 1,
      id_marca: 1,
      id_modelo: 1,
      tombo: 'jkhkjhkjh',
      criado_por: 1,
      atualizado_por: 1,
    };
  };

  const handleCleanFields = (): void => {
    setChassi('');
    setCor('');
    setPlaca('');
    setAnoModelo(null);
    setAnoFabricacao(null);
    setMotor('');
    setRenavam('');
    setOrigemArquisicao('');
    setFormaArquisicao('');
    setTipoDocCarga('');
    setNumeroDocCarga('');
    setCombustivel('');
    setEspecie('');
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      await createVeiculo(novoVeiculo());
      // const response = await api.post(`veiculos`, novoVeiculo());
      setSaved(true);
      // history.push(`/veiculos/editar/${response.data.id_veiculo}`);
    } catch (error) {}
  };

  return (
    <Container>
      <TituloPagina title="Cadastro de Novo Veículo" />
      <BoxContent />
    </Container>
  );
};

export default VeiculoNovo;
