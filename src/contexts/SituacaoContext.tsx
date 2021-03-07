import React, { createContext, useContext, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import api from '../services/api';

interface ISituacao {
  id_veiculo: number;
  data_situacao: string;
  id_situacao_tipo: string;
  km: string;
  observacao: string;
}

interface ISituacaoContextData {
  createSituacao(novaSituacao: object): Promise<ISituacao | undefined>;
}

const SituacaoContext = createContext<ISituacaoContextData>(
  {} as ISituacaoContextData,
);

export const SituacaoProvider: React.FC = ({ children }) => {
  const toast = useToast();

  const createSituacao = useCallback(
    async (novaSituacao): Promise<ISituacao | undefined> => {
      try {
        const response = await api.post(
          `veiculos/${novaSituacao.id_veiculo}/situacoes`,
          novaSituacao,
        );

        toast({
          title: 'Sucesso!',
          description: 'Situação cadastrada.',
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
            'Ocorreu um erro ao cadastrar a situação.',
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

  return (
    <SituacaoContext.Provider
      value={{
        createSituacao,
      }}
    >
      {children}
    </SituacaoContext.Provider>
  );
};

export function useSituacao(): ISituacaoContextData {
  const context = useContext(SituacaoContext);

  if (!context) {
    throw new Error(
      'useSituacao precisa estar dentro de SituaçãoContext provider',
    );
  }
  return context;
}
