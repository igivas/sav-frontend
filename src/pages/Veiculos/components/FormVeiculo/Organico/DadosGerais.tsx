import React, { useEffect, useState, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ValueType } from 'react-select';
import { useAuth } from 'contexts/auth';
import { useToast } from '@chakra-ui/react';
import api from '../../../../../services/api';
import { useVeiculo } from '../../../../../contexts/VeiculoContext';
import Row from '../../../../../components/form/Row';
import ReactSelect from '../../../../../components/form/ReactSelect';
import FormInput from '../../../../../components/form/FormInput';
import FormGroup from '../../../../../components/form/FormGroup';
import NumberFormat from '../../../../../components/form/InputNumberFormat';
import DatePicker from '../../../../../components/form/FormDatePicker';
import InputCurrency from '../../../../../components/form/InputCurrency';
import {
  IDadosGerais,
  IDadosGeraisOrganicoOrCedido,
} from '../utils/schemaFormVeiculo';

type OptionFormat = {
  value: string;
  label: string;
};

type IProps = {
  disabled: boolean;
  action: 'editar' | 'cadastrar';
};

type IVeiculoEspecie = {
  id_veiculo_especie: number;
  nome: string;
};

type IVeiculoCores = {
  id_cor: number;
  nome: string;
};

type IVeiculoMarca = {
  id_veiculo_marca: number;
  nome: string;
};

type IVeiculoModelo = {
  id_veiculo_modelo: number;
  id_veiculo_marca: number;
  nome: string;
};

interface IUFResponse {
  id_estado: number;
  sigla: string;
  nome: string;
}

const optionsCombustiveis: OptionFormat[] = [
  { value: '1', label: 'Gasolina' },
  { value: '2', label: 'Álcool' },
  { value: '3', label: 'Diesel' },
  { value: '4', label: 'GNV' },
  { value: '5', label: 'Elétrico' },
  { value: '6', label: 'Flex - Gasolina-Álcool' },
];
const DadosGerais: React.FC<IProps> = ({ disabled, action }) => {
  const { control, errors, clearErrors, setValue } = useFormContext<
    IDadosGerais & IDadosGeraisOrganicoOrCedido & { numero_motor: string }
  >();
  const { veiculo } = useVeiculo();
  const { signOut } = useAuth();
  const toast = useToast();
  const [veiculosEspecies, setVeiculosEspecies] = useState<OptionFormat[]>([]);
  const [veiculosCores, setVeiculosCores] = useState<OptionFormat[]>([]);
  const [veiculosMarcas, setVeiculosMarcas] = useState<OptionFormat[]>([]);
  const [veiculosModelos, setVeiculosModelos] = useState<OptionFormat[]>([]);
  const [marca, setMarca] = useState<string | number>(veiculo.id_marca);
  const [modeloEnable, setModeloEnable] = useState<boolean>(
    action !== 'cadastrar',
  );
  const [ufs, setUfs] = useState<OptionFormat[]>([]);

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const [especies, cores, marcas, estados] = await Promise.all([
          api.get<IVeiculoEspecie[]>('veiculos_especies'),
          api.get<IVeiculoCores[]>('veiculos_cores'),
          api.get<IVeiculoMarca[]>('marcas'),
          api.get<IUFResponse[]>('estados'),
        ]);

        const especiesFormated: OptionFormat[] = especies.data.map((esp) => {
          return {
            value: esp.id_veiculo_especie.toString(),
            label: esp.nome,
          };
        });

        const coresFormated: OptionFormat[] = cores.data.map((corAtual) => {
          return {
            value: corAtual.id_cor.toString(),
            label: corAtual.nome,
          };
        });

        const marcasFormated = marcas.data.map((marcaAtual) => {
          return {
            value: marcaAtual.id_veiculo_marca.toString(),
            label: marcaAtual.nome,
          };
        });

        const ufsFormated = estados
          ? estados.data.map((uf) => {
              return {
                value: uf.id_estado.toString(),
                label: uf.sigla,
              };
            })
          : [];

        ufsFormated.sort((a, b) => {
          return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
        });

        setVeiculosEspecies(especiesFormated);
        setVeiculosCores(coresFormated);
        setVeiculosMarcas(marcasFormated);
        setUfs(ufsFormated);
      } catch (error) {
        if (error.response && error.response.status === 401) signOut();
      }
    }

    load();
  }, [signOut]);

  useEffect(() => {
    async function load(): Promise<void> {
      if (!marca) {
        setModeloEnable(false);
        return;
      }
      setModeloEnable(true);
      try {
        const modelos = await api.get(`marcas/${marca}/modelos`);
        const modelosFormated = modelos.data.map(
          (modeloAtual: IVeiculoModelo) => {
            return {
              value: modeloAtual.id_veiculo_modelo,
              label: modeloAtual.nome,
            };
          },
        );

        setVeiculosModelos(modelosFormated);
      } catch (error) {
        console.log(error);
      }
    }

    load();
  }, [marca]);

  const chassiValid = useCallback(
    (chassi: string) => {
      async function isValidChassi(): Promise<void> {
        try {
          await api.get(`/veiculos/check/chassi/${chassi}`);
          clearErrors('chassi');
        } catch (error) {
          if (error.response) {
            switch (error.response.status) {
              case 400: {
                toast({
                  title: 'Erro',
                  description: 'Chassi já existente',
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                  position: 'top-right',
                });
                setValue('chassi', '');

                break;
              }

              default: {
                /* empty */
              }
            }
          }
        }
      }

      isValidChassi();
    },
    [clearErrors, setValue, toast],
  );

  const placaValid = useCallback(
    (placa: string) => {
      async function isValidPlaca(): Promise<void> {
        try {
          await api.get(`/veiculos/check/placa/${placa}`);
          clearErrors('placa');
        } catch (error) {
          if (error.response) {
            switch (error.response.status) {
              case 400: {
                toast({
                  title: 'Erro',
                  description: 'Placa já existente',
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                  position: 'top-right',
                });
                setValue('placa', '');

                break;
              }

              default: {
                /* empty */
              }
            }
          }
        }
      }

      isValidPlaca();
    },
    [clearErrors, setValue, toast],
  );

  return (
    <>
      <Row>
        <FormGroup required name="Chassi" cols={[2.5, 6, 12]}>
          <Controller
            name="chassi"
            control={control}
            render={(props) => {
              const toUpperChassi = String(props.value || '');
              return (
                <FormInput
                  {...props}
                  disabled={disabled}
                  error={errors.chassi?.message}
                  value={toUpperChassi.toUpperCase()}
                  onBlur={() => chassiValid(props.value)}
                />
              );
            }}
          />
        </FormGroup>
        <FormGroup name="Placa" cols={[1.5, 6, 12]}>
          <Controller
            name="placa"
            control={control}
            render={(props) => {
              const toUpperPlaca = String(props.value || '');
              return (
                <FormInput
                  {...props}
                  disabled={disabled}
                  error={errors.placa?.message}
                  value={toUpperPlaca.trim().toUpperCase()}
                  onBlur={() => placaValid(props.value)}
                />
              );
            }}
          />
        </FormGroup>

        <FormGroup name="Renavam" cols={[2, 6, 12]}>
          <Controller
            name="renavam"
            control={control}
            render={({ onChange, value }) => {
              const trimmedRenavam = String(value).trim();
              return (
                <NumberFormat
                  onChange={onChange}
                  value={trimmedRenavam}
                  error={errors.renavam?.message}
                  format="###########"
                  disabled={disabled}
                />
              );
            }}
          />
        </FormGroup>
        <FormGroup required name="Cor" cols={[2, 6, 6]}>
          <Controller
            name="id_cor"
            control={control}
            render={({ onChange, value }) => (
              <ReactSelect
                placeholder="Selecione..."
                optionsSelect={veiculosCores}
                value={veiculosCores.find((option) => option.value === value)}
                onChange={(option: ValueType<OptionFormat>) => {
                  const optionSelected = option as OptionFormat;
                  onChange(optionSelected.value);
                }}
                error={errors.id_cor?.message}
                isDisabled={disabled}
              />
            )}
          />
        </FormGroup>
        <FormGroup required name="Espécie" cols={[2, 6, 12]}>
          <Controller
            name="id_veiculo_especie"
            control={control}
            render={({ onChange, value }) => (
              <ReactSelect
                placeholder="Selecione..."
                optionsSelect={veiculosEspecies}
                value={veiculosEspecies.find(
                  (option) => option.value === value,
                )}
                onChange={(option: ValueType<OptionFormat>) => {
                  const optionSelected = option as OptionFormat;
                  onChange(optionSelected.value);
                  setMarca(optionSelected.value);
                }}
                error={errors.id_veiculo_especie?.message}
                isDisabled={disabled}
              />
            )}
          />
        </FormGroup>
        <FormGroup required name="Marca" cols={[2, 6, 12]}>
          <Controller
            name="id_marca"
            control={control}
            render={({ onChange, value }) => (
              <ReactSelect
                placeholder="Selecione..."
                optionsSelect={veiculosMarcas}
                value={veiculosMarcas.find((option) => option.value === value)}
                onChange={(option: ValueType<OptionFormat>) => {
                  const optionSelected = option as OptionFormat;
                  onChange(optionSelected.value);
                  setMarca(optionSelected.value);
                }}
                error={errors.id_marca?.message}
                isDisabled={disabled}
              />
            )}
          />
        </FormGroup>
      </Row>
      <Row>
        <FormGroup required name="Modelo" cols={[3, 6, 12]}>
          <Controller
            name="id_modelo"
            control={control}
            render={({ onChange, value }) => (
              <ReactSelect
                placeholder="Selecione..."
                optionsSelect={veiculosModelos}
                value={veiculosModelos.find((option) => option.value === value)}
                onChange={(option: ValueType<OptionFormat>) => {
                  const optionSelected = option as OptionFormat;
                  onChange(optionSelected.value);
                }}
                error={errors.id_modelo?.message}
                isDisabled={disabled || !modeloEnable}
              />
            )}
          />
        </FormGroup>
        <FormGroup required name="Número CRV" cols={[2, 6, 12]}>
          <Controller
            name="numero_crv"
            control={control}
            render={({ onChange, value }) => {
              const trimmedNumeroCRV = String(value).trim();
              return (
                <NumberFormat
                  onChange={onChange}
                  value={trimmedNumeroCRV}
                  error={errors.numero_crv?.message}
                  format="###############"
                  disabled={disabled}
                />
              );
            }}
          />
        </FormGroup>
        <FormGroup required name="Cód. Seg. CRV" cols={[2.5, 6, 12]}>
          <Controller
            name="codigo_seguranca_crv"
            control={control}
            render={({ onChange, value }) => {
              const trimmedCodSegurancaCRV = String(value).trim();
              return (
                <NumberFormat
                  onChange={onChange}
                  value={trimmedCodSegurancaCRV}
                  error={errors.codigo_seguranca_crv?.message}
                  format="###############"
                  disabled={disabled}
                />
              );
            }}
          />
        </FormGroup>
        <FormGroup name="N° Motor" cols={[4, 12, 12]}>
          <Controller
            name="numero_motor"
            control={control}
            render={(props) => {
              const toUpperNumeroMotor = String(props.value || '');
              return (
                <FormInput
                  {...props}
                  disabled={disabled}
                  error={errors.numero_motor?.message}
                  value={toUpperNumeroMotor.toUpperCase()}
                />
              );
            }}
          />
        </FormGroup>
      </Row>
      {/* <Row>

        <FormGroup name="Caracterizado?" cols={[3, 6, 6]}>
          <Controller
            name="adesivado"
            control={control}
            render={({ onChange, value }) => (
              <ReactSelect
                placeholder="Selecione..."
                optionsSelect={optionsSimNao}
                value={optionsSimNao.find((option) => option.value === value)}
                onChange={(option: ValueType<OptionFormat>) => {
                  const optionSelected = option as OptionFormat;
                  onChange(optionSelected.value);
                }}
                error={errors.adesivado?.message}
                isDisabled={disabled}
              />
            )}
          />
        </FormGroup>

      </Row> */}

      <Row>
        <FormGroup required name="Ano Fab." cols={[1.5, 6, 12]}>
          <Controller
            name="ano_fabricacao"
            control={control}
            render={({ onChange, value }) => (
              <DatePicker
                showYearPicker
                selected={value}
                onChange={onChange}
                error={errors.ano_fabricacao?.message}
                dateFormat="yyyy"
                disabled={disabled}
              />
            )}
          />
        </FormGroup>
        <FormGroup required name="Ano Mod." cols={[1.5, 6, 12]}>
          <Controller
            name="ano_modelo"
            control={control}
            render={({ onChange, value }) => (
              <DatePicker
                showYearPicker
                selected={value}
                onChange={onChange}
                error={errors.ano_modelo?.message}
                dateFormat="yyyy"
                disabled={disabled}
              />
            )}
          />
        </FormGroup>
        <FormGroup required name="UF" cols={[1.5, 6, 12]}>
          <Controller
            name="uf"
            control={control}
            render={({ onChange, value }) => (
              <ReactSelect
                placeholder="Selecione..."
                optionsSelect={ufs}
                value={ufs.find((option) => option.value === value)}
                onChange={(option: ValueType<OptionFormat>) => {
                  const optionSelected = option as OptionFormat;
                  onChange(optionSelected.value);
                }}
                error={errors.uf?.message}
                isDisabled={disabled}
              />
            )}
          />
        </FormGroup>

        <FormGroup required name="Combustível" cols={[4, 6, 12]}>
          <Controller
            name="combustivel"
            control={control}
            render={({ onChange, value }) => (
              <ReactSelect
                placeholder="Selecione..."
                optionsSelect={optionsCombustiveis}
                value={optionsCombustiveis.find(
                  (option) => option.value === value,
                )}
                onChange={(option: ValueType<OptionFormat>) => {
                  const optionSelected = option as OptionFormat;
                  onChange(optionSelected.value);
                }}
                error={errors.combustivel?.message}
                isDisabled={disabled}
              />
            )}
          />
        </FormGroup>
        {/* <FormGroup name="Caracterizado?" cols={[3, 6, 6]}>
          <Controller
            name="adesivado"
            control={control}
            render={({ onChange, value }) => (
              <ReactSelect
                placeholder="Selecione..."
                optionsSelect={optionsSimNao}
                value={optionsSimNao.find((option) => option.value === value)}
                onChange={(option: ValueType<OptionFormat>) => {
                  const optionSelected = option as OptionFormat;
                  onChange(optionSelected.value);
                }}
                error={errors.adesivado?.message}
                isDisabled={disabled}
              />
            )}
          />
        </FormGroup> */}
        <FormGroup required name="Valor FIPE" cols={[4, 6, 12]}>
          <Controller
            name="valor_fipe"
            control={control}
            render={({ onChange, value }) => (
              <InputCurrency
                value={value}
                onChange={(event: any, valueInput: any) =>
                  onChange(Number(valueInput))
                }
                error={errors.valor_fipe?.message}
                disabled={disabled}
              />
            )}
          />
        </FormGroup>
      </Row>
    </>
  );
};

export default DadosGerais;
