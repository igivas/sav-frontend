import React, { createContext, useContext, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import api from '../services/api';
import { useAuth } from './auth';

interface IMovimentacao {
  id_veiculo: number;
  id_opm_origem: string;
  autoridade_origem: string;
  id_opm_destino: string;
  tipo_movimentacao: string;
  observacao: string;
}

interface IMovimentacaoContextData {
  createMovimentacao(
    novaMovimentacao: object,
  ): Promise<IMovimentacao | undefined>;
}

const MovimentacaoContext = createContext<IMovimentacaoContextData>(
  {} as IMovimentacaoContextData,
);

export const MovimentacaoProvider: React.FC = ({ children }) => {
  const toast = useToast();
  const { signOut } = useAuth();

  const createMovimentacao = useCallback(
    async (novaMovimentacao): Promise<IMovimentacao | undefined> => {
      try {
        const response = await api.post(
          `veiculos/${novaMovimentacao.body.id_veiculo}/movimentacoes`,
          novaMovimentacao,
        );

        toast({
          title: 'Sucesso!',
          description: 'Movimentação cadastrada cadastrada.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });

        return response.data;
      } catch (error) {
        if (error.response.status === 401) signOut();
        toast({
          title: 'Ocorreu um erro.',
          description:
            error.response.data.message ||
            'Ocorreu um erro ao cadastrar a movimentação.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return undefined;
      }
    },
    [toast, signOut],
  );

  return (
    <MovimentacaoContext.Provider
      value={{
        createMovimentacao,
      }}
    >
      {children}
    </MovimentacaoContext.Provider>
  );
};

export function useMovimentacao(): IMovimentacaoContextData {
  const context = useContext(MovimentacaoContext);

  if (!context) {
    throw new Error(
      'useMovimentacao precisa estar dentro de MovimentacaoContext provider',
    );
  }
  return context;
}
