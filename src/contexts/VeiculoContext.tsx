import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import api from '../services/api';

import IVeiculo from '../interfaces/IVeiculo';

interface IPrefixo {
  prefixo_sequencia: string;
}

interface IKm {
  [key: string]: string | number | object[];
}

interface ISituacoes {
  id_situacao: number;
  nome: string;
  observacao: string;
  situacao: number;
  data_situacao: Date;
}

interface ISituacaoVeiculo {
  total: number;
  totalPage: number;
  situacoes: ISituacoes[];
}

interface IIdentificador {
  id_veiculo: number;
  data_identificador: string;
  identificador: string;
  observacao: string;
}

interface IAquisicoes {
  id_aquisicao: number;
  id_veiculo: number;
  origem_aquisicao: string;
  forma_aquisicao: string;
  data_aquisicao: string;
  doc_aquisicao: string;
  valor_aquisicao: string;
  criado_por: string;
  criado_em: string;
  id_orgao_aquisicao: number;
  file_path: string;
}

export type MovimentacaoOpm = {
  id_movimentacao: number;
  opm_origem: any;
  opm_destino: any;
  tipoMovimentacao: any;
  fases: any;
};

interface IMovimentacoes {
  total: number;
  totalPage: number;
  movimentacoes: MovimentacaoOpm[];
}

interface IVeiculoObject extends IVeiculo {
  prefixos: IPrefixo[];
  situacoes: ISituacaoVeiculo[];
  identificadores: IIdentificador[];
  kms: IKm[];
  aquisicoes: IAquisicoes[];
  movimentacoes: MovimentacaoOpm[];
}

interface IPrefixoObject {
  id_veiculo: number;
  emprego: string;
  prefixo_sequencia: string;
  prefixo_tipo: string;
  data_prefixo: string;
}

interface IVeiculoContextData {
  veiculo: IVeiculoObject;
  loadVeiculo(id: number): Promise<void>;
  updateVeiculo(fieldsUpdated: object, id: number): Promise<void>;
  createVeiculo(novoVeiculo: object): Promise<IVeiculoObject>;
  createPrefixo(
    id_veiculo: number,
    novoPrefixo: object,
  ): Promise<IPrefixoObject | undefined>;
  createSituacao(
    id_veiculo: number,
    novaSituacao: object,
  ): Promise<ISituacoes | undefined>;
  createIdentificador(
    id_veiculo: number,
    novoIdentificador: object,
  ): Promise<IIdentificador | undefined>;
  // cleanVeiculo(): void;
}

const VeiculoContext = createContext<IVeiculoContextData>(
  {} as IVeiculoContextData,
);

export const VeiculoProvider: React.FC = ({ children }) => {
  const toast = useToast();
  const [veiculo, setVeiculo] = useState<any>({} as IVeiculoObject);
  // const history = useHistory();
  const loadVeiculo = useCallback(async (id: number): Promise<void> => {
    try {
      const [
        veiculoResponse,
        situacoes,
        prefixos,
        identificadores,
        movimentacoes,
      ] = await Promise.all([
        api.get(`veiculos/${id}`),
        api.get<ISituacaoVeiculo>(`veiculos/${id}/situacoes`),
        api.get<IPrefixoObject>(`veiculos/${id}/prefixos`),
        api.get<IIdentificador>(`veiculos/${id}/identificadores`),
        api.get<IMovimentacoes>(`veiculos/${id}/movimentacoes`),
      ]);

      setVeiculo({
        ...veiculoResponse.data,
        situacoes: situacoes.data.situacoes,
        prefixos: prefixos.data,
        identificadores: identificadores.data,
        movimentacoes: movimentacoes.data.movimentacoes,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const updateVeiculo = useCallback(
    async (fieldsUpdated, id) => {
      try {
        let veiculoUpdated;
        const { aquisicao_file, ...rest } = fieldsUpdated;
        if (aquisicao_file) {
          const formData = new FormData();
          formData.append('aquisicao_file', aquisicao_file);
          formData.append('body', JSON.stringify(rest));
          veiculoUpdated = await api.put(`veiculos/${id}`, formData);
        } else {
          veiculoUpdated = await api.put(`veiculos/${id}`, fieldsUpdated);
        }

        // const veiculoUpdated = await api.put(`veiculos/${id}`, fieldsUpdated);
        setVeiculo(veiculoUpdated.data);
        toast({
          title: 'Sucesso!',
          description: 'Veículo atualizado com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      } catch (error) {
        toast({
          title: 'Ocorreu um erro.',
          description:
            error.response.data.messenge ||
            'Ocorreu um error ao tentar atualizar o veículo.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    },
    [toast],
  );

  const createVeiculo = useCallback(
    async (novoVeiculo): Promise<any> => {
      try {
        const { aquisicao_file, ...rest } = novoVeiculo;
        let response;
        if (aquisicao_file) {
          const formData = new FormData();
          formData.append('aquisicao_file', aquisicao_file);
          formData.append('body', JSON.stringify(rest));
          response = await api.post('veiculos', formData);
        } else {
          response = await api.post('veiculos', { body: rest });
        }

        setVeiculo(response.data);

        toast({
          title: 'Sucesso!',
          description: 'Veículo cadastrado com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });

        return response.data;
      } catch (error) {
        toast({
          title: 'Ocorreu um erro.',
          description:
            (error.response && error.response.message) ||
            'Ocorreu um error ao tentar cadastrar o veículo.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return undefined;
      }
    },
    [toast],
  );

  const createPrefixo = useCallback(
    async (id_veiculo, novoPrefixo): Promise<IPrefixoObject | undefined> => {
      try {
        const response = await api.post(
          `veiculos/${id_veiculo}/prefixos`,
          novoPrefixo,
        );

        /* const ano = novoPrefixo.data_prefixo.getFullYear();
        const mes = novoPrefixo.data_prefixo.getMonth() + 1;
        const dia = novoPrefixo.data_prefixo.getDate(); */

        setVeiculo({
          ...veiculo,
          prefixos: [
            ...veiculo.prefixos,
            { ...novoPrefixo },
            /* {
              ...novoPrefixo,
              data_prefixo: `${ano}-${mes < 10 ? '0' : ''}${mes}-${
                dia < 10 ? '0' : ''
              }${dia}`,
            }, */
          ],
        });

        toast({
          title: 'Sucesso!',
          description: 'Prefixo cadastrado com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return response.data;
      } catch (error) {
        console.log(error);

        toast({
          title: 'Ocorreu um erro.',
          description:
            error.response.data.message ||
            'Ocorreu um error ao tentar cadastrar o prefixo.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return undefined;
      }
    },
    [veiculo, toast],
  );

  const createSituacao = useCallback(
    async (id_veiculo, novaSituacao): Promise<ISituacoes | undefined> => {
      try {
        const response = await api.post(
          `veiculos/${id_veiculo}/situacoes`,
          novaSituacao,
        );

        const ano = novaSituacao.data_situacao.getFullYear();
        const mes = novaSituacao.data_situacao.getMonth() + 1;
        const dia = novaSituacao.data_situacao.getDate();

        setVeiculo({
          ...veiculo,
          situacoes: [
            ...veiculo.situacoes,
            {
              ...novaSituacao,
              data_situacao: `${ano}-${mes < 10 ? '0' : ''}${mes}-${
                dia < 10 ? '0' : ''
              }${dia}`,
            },
          ],
        });
        toast({
          title: 'Sucesso!',
          description: 'Situação cadastrada com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return response.data;
      } catch (error) {
        toast({
          title: 'Ocorreu um erro.',
          description:
            error.response.data.message ||
            'Ocorreu um error ao tentar cadastrar a situação.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return undefined;
      }
    },
    [veiculo, toast],
  );

  const createIdentificador = useCallback(
    async (
      id_veiculo,
      novoIdentificador,
    ): Promise<IIdentificador | undefined> => {
      try {
        const response = await api.post(
          `veiculos/${id_veiculo}/identificadores`,
          novoIdentificador,
        );

        const ano = novoIdentificador.data_identificador.getFullYear();
        const mes = novoIdentificador.data_identificador.getMonth() + 1;
        const dia = novoIdentificador.data_identificador.getDate();

        setVeiculo({
          ...veiculo,
          identificadores: [
            ...veiculo.identificadores,
            {
              ...novoIdentificador,
              data_identificador: `${ano}-${mes < 10 ? '0' : ''}${mes}-${
                dia < 10 ? '0' : ''
              }${dia}`,
            },
          ],
        });

        toast({
          title: 'Sucesso!',
          description: 'Identificador cadastrado com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return response.data;
      } catch (error) {
        toast({
          title: 'Ocorreu um erro.',
          description:
            error.response.data.message ||
            'Ocorreu um error ao tentar cadastrar o identificador.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return undefined;
      }
    },
    [veiculo, toast],
  );

  return (
    <VeiculoContext.Provider
      value={{
        veiculo,
        loadVeiculo,
        updateVeiculo,
        createVeiculo,
        createPrefixo,
        createSituacao,
        createIdentificador,
      }}
    >
      {children}
    </VeiculoContext.Provider>
  );
};

export function useVeiculo(): IVeiculoContextData {
  const context = useContext(VeiculoContext);

  if (!context) {
    throw new Error(
      'useVeiculo precisa estar dentro de VeiculoContext provider',
    );
  }
  return context;
}
